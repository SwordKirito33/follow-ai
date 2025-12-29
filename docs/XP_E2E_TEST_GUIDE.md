# Phase 2: XP System End-to-End Test Guide

## Pre-check: Test User
- **User ID**: `7f0544b3-d62b-4100-9176-ce6f0a558acd`
- **Email**: `test99@gmail.com`

---

## Step 1: Record Baseline

Execute in **Supabase SQL Editor**:

```sql
SELECT id, username, xp, total_xp, level, updated_at
FROM profiles
WHERE id = '7f0544b3-d62b-4100-9176-ce6f0a558acd';
```

**Record:**
- Current XP: `___`
- Current total_xp: `___`
- Current level: `___`
- updated_at: `___`

---

## Step 2: Start Dev Server

```bash
npm run dev
```

**Status:** 
- [ ] Started
- [ ] Already running (port 5173 in use)

**URL:** http://localhost:5173

---

## Step 3: Manual Test

1. **Open browser:** http://localhost:5173
2. **Login** as `test99@gmail.com`
3. **Navigate** to `/tasks` (or `/#/tasks` if using hash router)
4. **Select a task** with small XP reward (e.g., 50 XP)
5. **Fill form:**
   - Upload output file OR enter output text
   - Enter experience text (min 100 chars)
   - Select AI tools used (optional)
6. **Submit** the form
7. **Observe and report:**

   - Success message displayed? [ ] YES [ ] NO
   - XP toast displayed? [ ] YES [ ] NO
   - Console errors? (paste if any): `___`

---

## Step 4: Verify Database (Execute Immediately After Submission)

### 4.1 Check xp_events Table

Execute in **Supabase SQL Editor**:

```sql
-- Check xp_events table (newest first)
SELECT 
  id,
  user_id,
  amount,
  reason,
  source,
  source_id,
  created_at
FROM xp_events
WHERE user_id = '7f0544b3-d62b-4100-9176-ce6f0a558acd'
ORDER BY created_at DESC
LIMIT 5;
```

**Report:**
- New record exists? [ ] YES [ ] NO
- Amount matches task reward? [ ] YES [ ] NO
- Source is 'task'? [ ] YES [ ] NO
- reason contains task title? [ ] YES [ ] NO
- source_id matches task ID? [ ] YES [ ] NO
- **New xp_event amount:** `___`

### 4.2 Check profiles Table (MUST Run After xp_events Check)

Execute in **Supabase SQL Editor**:

```sql
-- Check profiles updated (MUST run after xp_events check)
SELECT 
  id,
  username,
  xp,
  total_xp,
  level,
  updated_at
FROM profiles
WHERE id = '7f0544b3-d62b-4100-9176-ce6f0a558acd';
```

**Report:**
- XP increased? by how much: `___`
- total_xp increased? by how much: `___`
- Level changed? from `___` to `___`
- **New profiles XP:** `___`
- **New profiles total_xp:** `___`
- **New profiles level:** `___`
- **updated_at changed?** [ ] YES [ ] NO

**Expected Behavior:**
- `xp` should increase by the task reward amount
- `total_xp` should increase by the same amount
- `level` should update if total_xp crosses a level threshold
- `updated_at` should be recent (within last minute)

---

## Step 5: Verify Frontend

1. **Hard refresh browser** (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows/Linux)
2. **Navigate** to `/profile` (or `/#/profile`)
3. **Check XP display:**
   - Current XP: `___`
   - Total XP: `___`
   - Level: `___`
   - XP progress bar: [ ] Visible [ ] Correct percentage

4. **Report:**
   - Profile page XP matches database? [ ] YES [ ] NO
   - If NO, what's the difference? `___`

---

## Success Criteria Checklist

- [ ] `xp_events` has new record
- [ ] `xp_events.amount` matches task reward
- [ ] `xp_events.source` is 'task'
- [ ] `profiles.xp` increased correctly
- [ ] `profiles.total_xp` increased correctly
- [ ] `profiles.level` updated (if applicable)
- [ ] Frontend shows correct XP
- [ ] No console errors
- [ ] Trigger worked (profiles updated automatically)

---

## Expected Flow

```
User submits task
    ↓
TaskSubmit.tsx calls grantXp()
    ↓
xp-service.ts inserts into xp_events
    ↓
Database trigger fires
    ↓
profiles.xp and profiles.total_xp updated
    ↓
Frontend refreshProfile() fetches updated profile
    ↓
UI displays new XP
```

---

## Troubleshooting

### If xp_events has record but profiles not updated:
- Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'xp_events_after_insert';`
- Check trigger function: `SELECT * FROM pg_proc WHERE proname = 'update_profiles_xp_from_event';`

### If frontend shows old XP:
- Check `AuthContext.refreshProfile()` is called after submission
- Check browser cache (hard refresh)
- Check console for errors

### If console shows errors:
- Check network tab for failed requests
- Check Supabase RLS policies
- Check user authentication status

---

## Test Report Template

**Baseline:**
- XP: `___`
- total_xp: `___`
- level: `___`

**After submission:**
- New xp_event amount: `___`
- New profiles XP: `___`
- New profiles total_xp: `___`
- New profiles level: `___`

**Frontend:**
- Profile page XP: `___`
- Matches database? [ ] YES [ ] NO

**Console:**
- Errors: `___` (paste or "none")

**Status:**
- [ ] ✅ All checks passed
- [ ] ⚠️ Some issues found (describe below)
- [ ] ❌ Test failed (describe below)

**Issues Found:**
```
(Describe any issues here)
```

---

**Test Date:** `___`
**Tester:** `___`

