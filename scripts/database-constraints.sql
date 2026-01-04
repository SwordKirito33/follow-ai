-- Follow.ai 数据库约束和安全增强
-- 执行时间: 2026-01-04

-- =====================================================
-- 1. 添加数据完整性约束
-- =====================================================

-- 防止负数 XP
ALTER TABLE profiles 
ADD CONSTRAINT check_positive_xp CHECK (xp >= 0),
ADD CONSTRAINT check_positive_total_xp CHECK (total_xp >= 0),
ADD CONSTRAINT check_positive_level CHECK (level >= 1);

-- 防止负数钱包余额
ALTER TABLE profiles 
ADD CONSTRAINT check_positive_wallet CHECK (wallet_balance >= 0);

-- 防止负数收益
ALTER TABLE profiles 
ADD CONSTRAINT check_positive_earnings CHECK (total_earnings >= 0);

-- =====================================================
-- 2. 添加交易幂等性检查
-- =====================================================

-- 添加唯一约束防止重复交易
ALTER TABLE payments 
ADD CONSTRAINT unique_stripe_payment_intent UNIQUE (stripe_payment_intent_id);

-- 添加交易状态枚举约束
ALTER TABLE payments 
ADD CONSTRAINT check_payment_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded'));

-- =====================================================
-- 3. 添加索引优化查询性能
-- =====================================================

-- 用户查询索引
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON profiles(level);
CREATE INDEX IF NOT EXISTS idx_profiles_total_xp ON profiles(total_xp DESC);

-- 任务查询索引
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_difficulty ON tasks(difficulty);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);

-- 评论查询索引
CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- 支付查询索引
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- 工具查询索引
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);

-- =====================================================
-- 4. 创建 XP 变更审计日志表
-- =====================================================

CREATE TABLE IF NOT EXISTS xp_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    action VARCHAR(50) NOT NULL,
    xp_change INTEGER NOT NULL,
    xp_before INTEGER NOT NULL,
    xp_after INTEGER NOT NULL,
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_audit_user_id ON xp_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_audit_created_at ON xp_audit_log(created_at DESC);

-- =====================================================
-- 5. 创建 XP 变更触发器
-- =====================================================

CREATE OR REPLACE FUNCTION log_xp_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.xp IS DISTINCT FROM NEW.xp THEN
        INSERT INTO xp_audit_log (user_id, action, xp_change, xp_before, xp_after, reason)
        VALUES (
            NEW.id,
            CASE 
                WHEN NEW.xp > OLD.xp THEN 'increase'
                ELSE 'decrease'
            END,
            NEW.xp - OLD.xp,
            OLD.xp,
            NEW.xp,
            'Profile XP update'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_xp_audit ON profiles;
CREATE TRIGGER trigger_xp_audit
    AFTER UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION log_xp_change();

-- =====================================================
-- 6. 创建登录审计表
-- =====================================================

CREATE TABLE IF NOT EXISTS login_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    email VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_audit_user_id ON login_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_login_audit_created_at ON login_audit(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_audit_ip ON login_audit(ip_address);

-- =====================================================
-- 7. 创建速率限制表
-- =====================================================

CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(identifier, action)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- =====================================================
-- 8. 添加 RLS 策略增强
-- =====================================================

-- 确保用户只能读取自己的支付记录
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payments_select_own ON payments;
CREATE POLICY payments_select_own ON payments
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS payments_insert_own ON payments;
CREATE POLICY payments_insert_own ON payments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 确保用户只能修改自己的资料
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_all ON profiles;
CREATE POLICY profiles_select_all ON profiles
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- =====================================================
-- 9. 创建每日签到表
-- =====================================================

CREATE TABLE IF NOT EXISTS daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    checkin_date DATE NOT NULL,
    streak_count INTEGER DEFAULT 1,
    xp_earned INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, checkin_date)
);

CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON daily_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON daily_checkins(checkin_date DESC);

-- =====================================================
-- 10. 创建成就表
-- =====================================================

CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(50),
    rarity VARCHAR(20) DEFAULT 'common',
    xp_reward INTEGER DEFAULT 0,
    requirement_type VARCHAR(50),
    requirement_value INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    achievement_id UUID NOT NULL REFERENCES achievements(id),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- =====================================================
-- 11. 创建用户关注表
-- =====================================================

CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES profiles(id),
    following_id UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK(follower_id != following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON user_follows(following_id);

-- =====================================================
-- 12. 创建通知表
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- =====================================================
-- 13. 插入默认成就数据
-- =====================================================

INSERT INTO achievements (name, description, icon, category, rarity, xp_reward, requirement_type, requirement_value) VALUES
('新手', '完成第一个任务', '🌱', 'tasks', 'common', 10, 'tasks_completed', 1),
('初级测试者', '完成 5 个任务', '🌿', 'tasks', 'common', 25, 'tasks_completed', 5),
('中级测试者', '完成 25 个任务', '🌳', 'tasks', 'uncommon', 50, 'tasks_completed', 25),
('高级测试者', '完成 100 个任务', '🏆', 'tasks', 'rare', 100, 'tasks_completed', 100),
('专家测试者', '完成 500 个任务', '👑', 'tasks', 'epic', 250, 'tasks_completed', 500),
('传奇测试者', '完成 1000 个任务', '💎', 'tasks', 'legendary', 500, 'tasks_completed', 1000),
('评论新手', '发表第一条评论', '💬', 'reviews', 'common', 10, 'reviews_count', 1),
('评论达人', '发表 10 条评论', '📝', 'reviews', 'uncommon', 50, 'reviews_count', 10),
('评论专家', '发表 50 条评论', '✍️', 'reviews', 'rare', 100, 'reviews_count', 50),
('连续签到 7 天', '连续签到一周', '🔥', 'streaks', 'uncommon', 50, 'streak_days', 7),
('连续签到 30 天', '连续签到一个月', '⚡', 'streaks', 'rare', 150, 'streak_days', 30),
('连续签到 100 天', '连续签到 100 天', '🌟', 'streaks', 'epic', 500, 'streak_days', 100),
('社交新星', '获得 10 个关注者', '⭐', 'social', 'common', 25, 'followers_count', 10),
('社交达人', '获得 100 个关注者', '🌟', 'social', 'rare', 100, 'followers_count', 100),
('等级 5', '达到等级 5', '5️⃣', 'levels', 'common', 50, 'level', 5),
('等级 10', '达到等级 10', '🔟', 'levels', 'uncommon', 100, 'level', 10),
('等级 25', '达到等级 25', '🎯', 'levels', 'rare', 250, 'level', 25),
('等级 50', '达到等级 50', '🏅', 'levels', 'epic', 500, 'level', 50),
('等级 100', '达到等级 100', '🏆', 'levels', 'legendary', 1000, 'level', 100)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 完成
-- =====================================================
