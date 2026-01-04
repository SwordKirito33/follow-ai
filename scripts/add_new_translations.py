#!/usr/bin/env python3
"""
批量添加新的翻译键到所有语言文件
"""

import os
import re

# 新增的翻译键
NEW_TRANSLATIONS = {
    'socialShare': {
        'en': {
            'reviewSubmitted': 'Review Submitted!',
            'potentialEarnings': 'Potential earnings',
            'pendingVerification': 'pending verification',
            'shareToBoost': 'Share to Boost Your Reputation',
            'aiGenerated': 'AI Generated',
            'copied': 'Copied!',
            'copyText': 'Copy Text',
            'skip': 'Skip',
        },
        'zh': {
            'reviewSubmitted': '评测已提交！',
            'potentialEarnings': '预计收益',
            'pendingVerification': '待验证',
            'shareToBoost': '分享以提升您的声誉',
            'aiGenerated': 'AI 生成',
            'copied': '已复制！',
            'copyText': '复制文本',
            'skip': '跳过',
        },
        'ja': {
            'reviewSubmitted': 'レビューが送信されました！',
            'potentialEarnings': '予想収益',
            'pendingVerification': '検証待ち',
            'shareToBoost': 'シェアして評判を上げる',
            'aiGenerated': 'AI生成',
            'copied': 'コピーしました！',
            'copyText': 'テキストをコピー',
            'skip': 'スキップ',
        },
        'ko': {
            'reviewSubmitted': '리뷰가 제출되었습니다!',
            'potentialEarnings': '예상 수익',
            'pendingVerification': '검증 대기 중',
            'shareToBoost': '공유하여 평판 높이기',
            'aiGenerated': 'AI 생성',
            'copied': '복사됨!',
            'copyText': '텍스트 복사',
            'skip': '건너뛰기',
        },
        'es': {
            'reviewSubmitted': '¡Reseña enviada!',
            'potentialEarnings': 'Ganancias potenciales',
            'pendingVerification': 'pendiente de verificación',
            'shareToBoost': 'Comparte para aumentar tu reputación',
            'aiGenerated': 'Generado por IA',
            'copied': '¡Copiado!',
            'copyText': 'Copiar texto',
            'skip': 'Omitir',
        },
        'fr': {
            'reviewSubmitted': 'Avis soumis !',
            'potentialEarnings': 'Gains potentiels',
            'pendingVerification': 'en attente de vérification',
            'shareToBoost': 'Partagez pour booster votre réputation',
            'aiGenerated': 'Généré par IA',
            'copied': 'Copié !',
            'copyText': 'Copier le texte',
            'skip': 'Passer',
        },
        'de': {
            'reviewSubmitted': 'Bewertung eingereicht!',
            'potentialEarnings': 'Potenzielle Einnahmen',
            'pendingVerification': 'ausstehende Verifizierung',
            'shareToBoost': 'Teilen Sie, um Ihren Ruf zu steigern',
            'aiGenerated': 'KI-generiert',
            'copied': 'Kopiert!',
            'copyText': 'Text kopieren',
            'skip': 'Überspringen',
        },
        'pt': {
            'reviewSubmitted': 'Avaliação enviada!',
            'potentialEarnings': 'Ganhos potenciais',
            'pendingVerification': 'verificação pendente',
            'shareToBoost': 'Compartilhe para aumentar sua reputação',
            'aiGenerated': 'Gerado por IA',
            'copied': 'Copiado!',
            'copyText': 'Copiar texto',
            'skip': 'Pular',
        },
        'ru': {
            'reviewSubmitted': 'Отзыв отправлен!',
            'potentialEarnings': 'Потенциальный заработок',
            'pendingVerification': 'ожидает проверки',
            'shareToBoost': 'Поделитесь, чтобы повысить репутацию',
            'aiGenerated': 'Сгенерировано ИИ',
            'copied': 'Скопировано!',
            'copyText': 'Копировать текст',
            'skip': 'Пропустить',
        },
        'ar': {
            'reviewSubmitted': 'تم إرسال المراجعة!',
            'potentialEarnings': 'الأرباح المحتملة',
            'pendingVerification': 'في انتظار التحقق',
            'shareToBoost': 'شارك لتعزيز سمعتك',
            'aiGenerated': 'مُنشأ بالذكاء الاصطناعي',
            'copied': 'تم النسخ!',
            'copyText': 'نسخ النص',
            'skip': 'تخطي',
        },
    },
    'admin': {
        'en': {
            'xpPanelTitle': 'Admin XP Panel',
            'searchUser': 'Search User',
            'searchPlaceholder': 'Search by username or name...',
            'selectedUser': 'Selected User',
            'xpAmount': 'XP Amount (positive to grant, negative to revoke)',
            'xpPlaceholder': 'e.g., 100 or -50',
            'note': 'Note (optional)',
            'notePlaceholder': 'Reason for this XP adjustment...',
            'grantXp': 'Grant XP',
            'revokeXp': 'Revoke XP',
            'recentActions': 'Recent Admin Actions',
            'checkingPermissions': 'Checking permissions...',
            'accessDenied': 'Access Denied',
            'noPermission': 'You do not have admin permissions to access this panel.',
            'notAuthorized': 'You are not authorized to grant XP',
            'invalidInput': 'Invalid user ID or XP amount',
            'grantSuccess': 'Successfully granted {amount} XP',
            'revokeSuccess': 'Successfully revoked {amount} XP',
            'grantFailed': 'Failed to grant XP',
            'searchFailed': 'Failed to search users',
        },
        'zh': {
            'xpPanelTitle': '管理员 XP 面板',
            'searchUser': '搜索用户',
            'searchPlaceholder': '按用户名或姓名搜索...',
            'selectedUser': '已选用户',
            'xpAmount': 'XP 数量（正数授予，负数撤销）',
            'xpPlaceholder': '例如：100 或 -50',
            'note': '备注（可选）',
            'notePlaceholder': '此次 XP 调整的原因...',
            'grantXp': '授予 XP',
            'revokeXp': '撤销 XP',
            'recentActions': '最近管理员操作',
            'checkingPermissions': '正在检查权限...',
            'accessDenied': '访问被拒绝',
            'noPermission': '您没有管理员权限访问此面板。',
            'notAuthorized': '您无权授予 XP',
            'invalidInput': '无效的用户 ID 或 XP 数量',
            'grantSuccess': '成功授予 {amount} XP',
            'revokeSuccess': '成功撤销 {amount} XP',
            'grantFailed': '授予 XP 失败',
            'searchFailed': '搜索用户失败',
        },
        'ja': {
            'xpPanelTitle': '管理者 XP パネル',
            'searchUser': 'ユーザー検索',
            'searchPlaceholder': 'ユーザー名または名前で検索...',
            'selectedUser': '選択されたユーザー',
            'xpAmount': 'XP 量（正の値で付与、負の値で取り消し）',
            'xpPlaceholder': '例：100 または -50',
            'note': 'メモ（任意）',
            'notePlaceholder': 'この XP 調整の理由...',
            'grantXp': 'XP を付与',
            'revokeXp': 'XP を取り消し',
            'recentActions': '最近の管理者アクション',
            'checkingPermissions': '権限を確認中...',
            'accessDenied': 'アクセス拒否',
            'noPermission': 'このパネルにアクセスする管理者権限がありません。',
            'notAuthorized': 'XP を付与する権限がありません',
            'invalidInput': '無効なユーザー ID または XP 量',
            'grantSuccess': '{amount} XP を正常に付与しました',
            'revokeSuccess': '{amount} XP を正常に取り消しました',
            'grantFailed': 'XP の付与に失敗しました',
            'searchFailed': 'ユーザーの検索に失敗しました',
        },
        'ko': {
            'xpPanelTitle': '관리자 XP 패널',
            'searchUser': '사용자 검색',
            'searchPlaceholder': '사용자 이름 또는 이름으로 검색...',
            'selectedUser': '선택된 사용자',
            'xpAmount': 'XP 양 (양수는 부여, 음수는 취소)',
            'xpPlaceholder': '예: 100 또는 -50',
            'note': '메모 (선택사항)',
            'notePlaceholder': '이 XP 조정의 이유...',
            'grantXp': 'XP 부여',
            'revokeXp': 'XP 취소',
            'recentActions': '최근 관리자 작업',
            'checkingPermissions': '권한 확인 중...',
            'accessDenied': '접근 거부',
            'noPermission': '이 패널에 접근할 관리자 권한이 없습니다.',
            'notAuthorized': 'XP를 부여할 권한이 없습니다',
            'invalidInput': '잘못된 사용자 ID 또는 XP 양',
            'grantSuccess': '{amount} XP를 성공적으로 부여했습니다',
            'revokeSuccess': '{amount} XP를 성공적으로 취소했습니다',
            'grantFailed': 'XP 부여 실패',
            'searchFailed': '사용자 검색 실패',
        },
        'es': {
            'xpPanelTitle': 'Panel de XP de Administrador',
            'searchUser': 'Buscar Usuario',
            'searchPlaceholder': 'Buscar por nombre de usuario o nombre...',
            'selectedUser': 'Usuario Seleccionado',
            'xpAmount': 'Cantidad de XP (positivo para otorgar, negativo para revocar)',
            'xpPlaceholder': 'ej., 100 o -50',
            'note': 'Nota (opcional)',
            'notePlaceholder': 'Razón de este ajuste de XP...',
            'grantXp': 'Otorgar XP',
            'revokeXp': 'Revocar XP',
            'recentActions': 'Acciones Recientes del Administrador',
            'checkingPermissions': 'Verificando permisos...',
            'accessDenied': 'Acceso Denegado',
            'noPermission': 'No tienes permisos de administrador para acceder a este panel.',
            'notAuthorized': 'No estás autorizado para otorgar XP',
            'invalidInput': 'ID de usuario o cantidad de XP inválidos',
            'grantSuccess': 'Se otorgaron {amount} XP exitosamente',
            'revokeSuccess': 'Se revocaron {amount} XP exitosamente',
            'grantFailed': 'Error al otorgar XP',
            'searchFailed': 'Error al buscar usuarios',
        },
        'fr': {
            'xpPanelTitle': 'Panneau XP Admin',
            'searchUser': 'Rechercher un utilisateur',
            'searchPlaceholder': 'Rechercher par nom d\'utilisateur ou nom...',
            'selectedUser': 'Utilisateur sélectionné',
            'xpAmount': 'Montant XP (positif pour accorder, négatif pour révoquer)',
            'xpPlaceholder': 'ex., 100 ou -50',
            'note': 'Note (optionnel)',
            'notePlaceholder': 'Raison de cet ajustement XP...',
            'grantXp': 'Accorder XP',
            'revokeXp': 'Révoquer XP',
            'recentActions': 'Actions Admin Récentes',
            'checkingPermissions': 'Vérification des permissions...',
            'accessDenied': 'Accès Refusé',
            'noPermission': 'Vous n\'avez pas les permissions admin pour accéder à ce panneau.',
            'notAuthorized': 'Vous n\'êtes pas autorisé à accorder des XP',
            'invalidInput': 'ID utilisateur ou montant XP invalide',
            'grantSuccess': '{amount} XP accordés avec succès',
            'revokeSuccess': '{amount} XP révoqués avec succès',
            'grantFailed': 'Échec de l\'attribution des XP',
            'searchFailed': 'Échec de la recherche d\'utilisateurs',
        },
        'de': {
            'xpPanelTitle': 'Admin XP-Panel',
            'searchUser': 'Benutzer suchen',
            'searchPlaceholder': 'Nach Benutzername oder Name suchen...',
            'selectedUser': 'Ausgewählter Benutzer',
            'xpAmount': 'XP-Menge (positiv zum Gewähren, negativ zum Widerrufen)',
            'xpPlaceholder': 'z.B., 100 oder -50',
            'note': 'Notiz (optional)',
            'notePlaceholder': 'Grund für diese XP-Anpassung...',
            'grantXp': 'XP gewähren',
            'revokeXp': 'XP widerrufen',
            'recentActions': 'Letzte Admin-Aktionen',
            'checkingPermissions': 'Berechtigungen werden überprüft...',
            'accessDenied': 'Zugriff verweigert',
            'noPermission': 'Sie haben keine Admin-Berechtigung für dieses Panel.',
            'notAuthorized': 'Sie sind nicht berechtigt, XP zu gewähren',
            'invalidInput': 'Ungültige Benutzer-ID oder XP-Menge',
            'grantSuccess': '{amount} XP erfolgreich gewährt',
            'revokeSuccess': '{amount} XP erfolgreich widerrufen',
            'grantFailed': 'XP-Gewährung fehlgeschlagen',
            'searchFailed': 'Benutzersuche fehlgeschlagen',
        },
        'pt': {
            'xpPanelTitle': 'Painel XP Admin',
            'searchUser': 'Buscar Usuário',
            'searchPlaceholder': 'Buscar por nome de usuário ou nome...',
            'selectedUser': 'Usuário Selecionado',
            'xpAmount': 'Quantidade de XP (positivo para conceder, negativo para revogar)',
            'xpPlaceholder': 'ex., 100 ou -50',
            'note': 'Nota (opcional)',
            'notePlaceholder': 'Motivo deste ajuste de XP...',
            'grantXp': 'Conceder XP',
            'revokeXp': 'Revogar XP',
            'recentActions': 'Ações Recentes do Admin',
            'checkingPermissions': 'Verificando permissões...',
            'accessDenied': 'Acesso Negado',
            'noPermission': 'Você não tem permissões de admin para acessar este painel.',
            'notAuthorized': 'Você não está autorizado a conceder XP',
            'invalidInput': 'ID de usuário ou quantidade de XP inválidos',
            'grantSuccess': '{amount} XP concedidos com sucesso',
            'revokeSuccess': '{amount} XP revogados com sucesso',
            'grantFailed': 'Falha ao conceder XP',
            'searchFailed': 'Falha ao buscar usuários',
        },
        'ru': {
            'xpPanelTitle': 'Панель XP администратора',
            'searchUser': 'Поиск пользователя',
            'searchPlaceholder': 'Поиск по имени пользователя или имени...',
            'selectedUser': 'Выбранный пользователь',
            'xpAmount': 'Количество XP (положительное для начисления, отрицательное для отмены)',
            'xpPlaceholder': 'напр., 100 или -50',
            'note': 'Примечание (необязательно)',
            'notePlaceholder': 'Причина этой корректировки XP...',
            'grantXp': 'Начислить XP',
            'revokeXp': 'Отменить XP',
            'recentActions': 'Недавние действия администратора',
            'checkingPermissions': 'Проверка разрешений...',
            'accessDenied': 'Доступ запрещен',
            'noPermission': 'У вас нет прав администратора для доступа к этой панели.',
            'notAuthorized': 'Вы не авторизованы для начисления XP',
            'invalidInput': 'Неверный ID пользователя или количество XP',
            'grantSuccess': 'Успешно начислено {amount} XP',
            'revokeSuccess': 'Успешно отменено {amount} XP',
            'grantFailed': 'Не удалось начислить XP',
            'searchFailed': 'Не удалось найти пользователей',
        },
        'ar': {
            'xpPanelTitle': 'لوحة XP للمسؤول',
            'searchUser': 'بحث عن مستخدم',
            'searchPlaceholder': 'البحث باسم المستخدم أو الاسم...',
            'selectedUser': 'المستخدم المحدد',
            'xpAmount': 'كمية XP (موجب للمنح، سالب للإلغاء)',
            'xpPlaceholder': 'مثال: 100 أو -50',
            'note': 'ملاحظة (اختياري)',
            'notePlaceholder': 'سبب تعديل XP هذا...',
            'grantXp': 'منح XP',
            'revokeXp': 'إلغاء XP',
            'recentActions': 'إجراءات المسؤول الأخيرة',
            'checkingPermissions': 'جاري التحقق من الصلاحيات...',
            'accessDenied': 'تم رفض الوصول',
            'noPermission': 'ليس لديك صلاحيات المسؤول للوصول إلى هذه اللوحة.',
            'notAuthorized': 'غير مصرح لك بمنح XP',
            'invalidInput': 'معرف مستخدم أو كمية XP غير صالحة',
            'grantSuccess': 'تم منح {amount} XP بنجاح',
            'revokeSuccess': 'تم إلغاء {amount} XP بنجاح',
            'grantFailed': 'فشل في منح XP',
            'searchFailed': 'فشل في البحث عن المستخدمين',
        },
    },
    'activity': {
        'en': {
            'justNow': 'Just now',
            'minutesAgo': '{count}m ago',
            'hoursAgo': '{count}h ago',
            'daysAgo': '{count}d ago',
            'noRecentActivity': 'No recent activity',
            'loadMore': 'Load more activity',
        },
        'zh': {
            'justNow': '刚刚',
            'minutesAgo': '{count}分钟前',
            'hoursAgo': '{count}小时前',
            'daysAgo': '{count}天前',
            'noRecentActivity': '暂无最近活动',
            'loadMore': '加载更多活动',
        },
        'ja': {
            'justNow': 'たった今',
            'minutesAgo': '{count}分前',
            'hoursAgo': '{count}時間前',
            'daysAgo': '{count}日前',
            'noRecentActivity': '最近のアクティビティはありません',
            'loadMore': 'さらに読み込む',
        },
        'ko': {
            'justNow': '방금',
            'minutesAgo': '{count}분 전',
            'hoursAgo': '{count}시간 전',
            'daysAgo': '{count}일 전',
            'noRecentActivity': '최근 활동 없음',
            'loadMore': '더 불러오기',
        },
        'es': {
            'justNow': 'Ahora mismo',
            'minutesAgo': 'hace {count}m',
            'hoursAgo': 'hace {count}h',
            'daysAgo': 'hace {count}d',
            'noRecentActivity': 'Sin actividad reciente',
            'loadMore': 'Cargar más actividad',
        },
        'fr': {
            'justNow': 'À l\'instant',
            'minutesAgo': 'il y a {count}m',
            'hoursAgo': 'il y a {count}h',
            'daysAgo': 'il y a {count}j',
            'noRecentActivity': 'Aucune activité récente',
            'loadMore': 'Charger plus d\'activité',
        },
        'de': {
            'justNow': 'Gerade eben',
            'minutesAgo': 'vor {count}m',
            'hoursAgo': 'vor {count}h',
            'daysAgo': 'vor {count}T',
            'noRecentActivity': 'Keine aktuelle Aktivität',
            'loadMore': 'Mehr Aktivität laden',
        },
        'pt': {
            'justNow': 'Agora mesmo',
            'minutesAgo': 'há {count}m',
            'hoursAgo': 'há {count}h',
            'daysAgo': 'há {count}d',
            'noRecentActivity': 'Sem atividade recente',
            'loadMore': 'Carregar mais atividade',
        },
        'ru': {
            'justNow': 'Только что',
            'minutesAgo': '{count}м назад',
            'hoursAgo': '{count}ч назад',
            'daysAgo': '{count}д назад',
            'noRecentActivity': 'Нет недавней активности',
            'loadMore': 'Загрузить больше активности',
        },
        'ar': {
            'justNow': 'الآن',
            'minutesAgo': 'منذ {count} دقيقة',
            'hoursAgo': 'منذ {count} ساعة',
            'daysAgo': 'منذ {count} يوم',
            'noRecentActivity': 'لا يوجد نشاط حديث',
            'loadMore': 'تحميل المزيد من النشاط',
        },
    },
    'common': {
        'en': {
            'search': 'Search',
            'user': 'User',
        },
        'zh': {
            'search': '搜索',
            'user': '用户',
        },
        'ja': {
            'search': '検索',
            'user': 'ユーザー',
        },
        'ko': {
            'search': '검색',
            'user': '사용자',
        },
        'es': {
            'search': 'Buscar',
            'user': 'Usuario',
        },
        'fr': {
            'search': 'Rechercher',
            'user': 'Utilisateur',
        },
        'de': {
            'search': 'Suchen',
            'user': 'Benutzer',
        },
        'pt': {
            'search': 'Buscar',
            'user': 'Usuário',
        },
        'ru': {
            'search': 'Поиск',
            'user': 'Пользователь',
        },
        'ar': {
            'search': 'بحث',
            'user': 'مستخدم',
        },
    },
}

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def format_section(section_name, translations):
    """Format a section of translations"""
    lines = [f"\n  {section_name}: {{"]
    for key, value in translations.items():
        escaped_value = value.replace("'", "\\'")
        lines.append(f"    {key}: '{escaped_value}',")
    lines.append("  },")
    return '\n'.join(lines)

def add_translations_to_file(filepath, lang):
    """Add new translations to a language file"""
    content = read_file(filepath)
    
    for section_name, section_data in NEW_TRANSLATIONS.items():
        if lang not in section_data:
            continue
        
        translations = section_data[lang]
        
        # Check if section exists
        section_pattern = rf'{section_name}:\s*\{{'
        if re.search(section_pattern, content):
            # Section exists, add missing keys
            for key, value in translations.items():
                key_pattern = rf'{section_name}:\s*\{{[^}}]*{key}:'
                if not re.search(key_pattern, content, re.DOTALL):
                    # Find the section and add the key
                    escaped_value = value.replace("'", "\\'")
                    new_key = f"    {key}: '{escaped_value}',\n"
                    
                    # Find the section opening brace and add after it
                    section_match = re.search(rf'({section_name}:\s*\{{)', content)
                    if section_match:
                        insert_pos = section_match.end()
                        content = content[:insert_pos] + '\n' + new_key + content[insert_pos:]
        else:
            # Section doesn't exist, add it before the closing brace
            new_section = format_section(section_name, translations)
            
            # Find the last closing brace and insert before it
            last_brace = content.rfind('};')
            if last_brace != -1:
                content = content[:last_brace] + new_section + '\n' + content[last_brace:]
    
    write_file(filepath, content)
    print(f"Updated: {filepath}")

def main():
    base_path = '/home/ubuntu/follow-ai-source/follow.ai/src/i18n/locales'
    languages = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'ar']
    
    for lang in languages:
        filepath = os.path.join(base_path, f'{lang}.ts')
        if os.path.exists(filepath):
            add_translations_to_file(filepath, lang)
        else:
            print(f"File not found: {filepath}")

if __name__ == '__main__':
    main()
