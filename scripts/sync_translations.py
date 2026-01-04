#!/usr/bin/env python3
"""
同步所有语言文件的翻译键，确保所有语言都有相同的键结构
"""

import os
import re
import json

# 翻译映射表 - 从英语到其他语言
TRANSLATIONS = {
    # whyDifferent section
    'whyDifferent': {
        'title': {
            'zh': '为什么我们与众不同',
            'ja': 'なぜ私たちは違うのか',
            'ko': '왜 우리가 다른가',
            'es': 'Por qué somos diferentes',
            'fr': 'Pourquoi nous sommes différents',
            'de': 'Warum wir anders sind',
            'pt': 'Por que somos diferentes',
            'ru': 'Почему мы отличаемся',
            'ar': 'لماذا نحن مختلفون',
        },
        'proofRequired': {
            'zh': '需要证明',
            'ja': '証明が必要',
            'ko': '증명 필요',
            'es': 'Prueba requerida',
            'fr': 'Preuve requise',
            'de': 'Nachweis erforderlich',
            'pt': 'Prova necessária',
            'ru': 'Требуется доказательство',
            'ar': 'مطلوب إثبات',
        },
        'realOutputs': {
            'zh': '真实输出',
            'ja': '実際の出力',
            'ko': '실제 출력',
            'es': 'Salidas reales',
            'fr': 'Sorties réelles',
            'de': 'Echte Ausgaben',
            'pt': 'Saídas reais',
            'ru': 'Реальные результаты',
            'ar': 'مخرجات حقيقية',
        },
        'earnMoney': {
            'zh': '赚取收入',
            'ja': 'お金を稼ぐ',
            'ko': '수익 창출',
            'es': 'Ganar dinero',
            'fr': 'Gagner de l\'argent',
            'de': 'Geld verdienen',
            'pt': 'Ganhar dinheiro',
            'ru': 'Зарабатывать деньги',
            'ar': 'كسب المال',
        },
        'yes': {
            'zh': '是',
            'ja': 'はい',
            'ko': '예',
            'es': 'Sí',
            'fr': 'Oui',
            'de': 'Ja',
            'pt': 'Sim',
            'ru': 'Да',
            'ar': 'نعم',
        },
        'no': {
            'zh': '否',
            'ja': 'いいえ',
            'ko': '아니오',
            'es': 'No',
            'fr': 'Non',
            'de': 'Nein',
            'pt': 'Não',
            'ru': 'Нет',
            'ar': 'لا',
        },
        'mandatory': {
            'zh': '(强制)',
            'ja': '(必須)',
            'ko': '(필수)',
            'es': '(Obligatorio)',
            'fr': '(Obligatoire)',
            'de': '(Pflicht)',
            'pt': '(Obrigatório)',
            'ru': '(Обязательно)',
            'ar': '(إلزامي)',
        },
        'everyReview': {
            'zh': '每条评测',
            'ja': 'すべてのレビュー',
            'ko': '모든 리뷰',
            'es': 'Cada reseña',
            'fr': 'Chaque avis',
            'de': 'Jede Bewertung',
            'pt': 'Cada avaliação',
            'ru': 'Каждый отзыв',
            'ar': 'كل مراجعة',
        },
    },
    # reviews section
    'reviews': {
        'title': {
            'zh': '最新验证评测',
            'ja': '最新の検証済みレビュー',
            'ko': '최근 검증된 리뷰',
            'es': 'Reseñas verificadas recientes',
            'fr': 'Avis vérifiés récents',
            'de': 'Aktuelle verifizierte Bewertungen',
            'pt': 'Avaliações verificadas recentes',
            'ru': 'Последние проверенные отзывы',
            'ar': 'المراجعات الموثقة الأخيرة',
        },
        'all': {
            'zh': '全部',
            'ja': 'すべて',
            'ko': '전체',
            'es': 'Todos',
            'fr': 'Tous',
            'de': 'Alle',
            'pt': 'Todos',
            'ru': 'Все',
            'ar': 'الكل',
        },
        'coding': {
            'zh': '编程',
            'ja': 'コーディング',
            'ko': '코딩',
            'es': 'Programación',
            'fr': 'Programmation',
            'de': 'Programmierung',
            'pt': 'Programação',
            'ru': 'Программирование',
            'ar': 'البرمجة',
        },
        'design': {
            'zh': '设计',
            'ja': 'デザイン',
            'ko': '디자인',
            'es': 'Diseño',
            'fr': 'Design',
            'de': 'Design',
            'pt': 'Design',
            'ru': 'Дизайн',
            'ar': 'التصميم',
        },
    },
    # tasks section
    'tasks': {
        'title': {
            'zh': '测试AI赚钱',
            'ja': 'AIをテストして稼ぐ',
            'ko': 'AI 테스트로 수익 창출',
            'es': 'Gana dinero probando IA',
            'fr': 'Gagnez de l\'argent en testant l\'IA',
            'de': 'Verdienen Sie Geld beim Testen von KI',
            'pt': 'Ganhe dinheiro testando IA',
            'ru': 'Зарабатывайте, тестируя ИИ',
            'ar': 'اكسب المال باختبار الذكاء الاصطناعي',
        },
        'subtitle': {
            'zh': '完成验证任务获取保证奖励',
            'ja': '検証済みタスクを完了して報酬を獲得',
            'ko': '검증된 작업을 완료하여 보상 획득',
            'es': 'Completa tareas verificadas para ganar recompensas garantizadas',
            'fr': 'Complétez des tâches vérifiées pour gagner des récompenses garanties',
            'de': 'Erledigen Sie verifizierte Aufgaben für garantierte Belohnungen',
            'pt': 'Complete tarefas verificadas para ganhar recompensas garantidas',
            'ru': 'Выполняйте проверенные задания для гарантированных наград',
            'ar': 'أكمل المهام الموثقة للحصول على مكافآت مضمونة',
        },
        'preCheck': {
            'zh': 'AI预检',
            'ja': 'AI事前チェック',
            'ko': 'AI 사전 검사',
            'es': 'Pre-verificación IA',
            'fr': 'Pré-vérification IA',
            'de': 'KI-Vorprüfung',
            'pt': 'Pré-verificação IA',
            'ru': 'ИИ предпроверка',
            'ar': 'فحص مسبق بالذكاء الاصطناعي',
        },
        'xpChallenge': {
            'zh': 'XP挑战',
            'ja': 'XPチャレンジ',
            'ko': 'XP 챌린지',
            'es': 'Desafío XP',
            'fr': 'Défi XP',
            'de': 'XP-Herausforderung',
            'pt': 'Desafio XP',
            'ru': 'XP Челлендж',
            'ar': 'تحدي XP',
        },
        'bounty': {
            'zh': '悬赏任务',
            'ja': '報奨金タスク',
            'ko': '현상금 작업',
            'es': 'Recompensa',
            'fr': 'Prime',
            'de': 'Kopfgeld',
            'pt': 'Recompensa',
            'ru': 'Награда',
            'ar': 'مكافأة',
        },
        'hire': {
            'zh': '雇佣任务',
            'ja': '雇用タスク',
            'ko': '고용 작업',
            'es': 'Tarea de contratación',
            'fr': 'Tâche d\'embauche',
            'de': 'Einstellungsaufgabe',
            'pt': 'Tarefa de contratação',
            'ru': 'Задание по найму',
            'ar': 'مهمة توظيف',
        },
        'filterByType': {
            'zh': '按类型筛选',
            'ja': 'タイプで絞り込み',
            'ko': '유형별 필터',
            'es': 'Filtrar por tipo',
            'fr': 'Filtrer par type',
            'de': 'Nach Typ filtern',
            'pt': 'Filtrar por tipo',
            'ru': 'Фильтр по типу',
            'ar': 'تصفية حسب النوع',
        },
        'allTypes': {
            'zh': '所有类型',
            'ja': 'すべてのタイプ',
            'ko': '모든 유형',
            'es': 'Todos los tipos',
            'fr': 'Tous les types',
            'de': 'Alle Typen',
            'pt': 'Todos os tipos',
            'ru': 'Все типы',
            'ar': 'جميع الأنواع',
        },
        'levelRequired': {
            'zh': '需要等级 {level}+',
            'ja': 'レベル{level}以上が必要',
            'ko': '레벨 {level}+ 필요',
            'es': 'Se requiere nivel {level}+',
            'fr': 'Niveau {level}+ requis',
            'de': 'Level {level}+ erforderlich',
            'pt': 'Nível {level}+ necessário',
            'ru': 'Требуется уровень {level}+',
            'ar': 'مطلوب المستوى {level}+',
        },
        'profileRequired': {
            'zh': '需要完善个人资料',
            'ja': 'プロフィールの完成が必要',
            'ko': '프로필 완성 필요',
            'es': 'Se requiere completar el perfil',
            'fr': 'Profil complet requis',
            'de': 'Profilvervollständigung erforderlich',
            'pt': 'Conclusão do perfil necessária',
            'ru': 'Требуется заполнение профиля',
            'ar': 'مطلوب إكمال الملف الشخصي',
        },
        'unlockMessage': {
            'zh': '达到2级并完善个人资料即可解锁付费任务。您还需要 {xp} XP。',
            'ja': 'レベル2に達してプロフィールを完成させると有料タスクがアンロックされます。あと{xp} XP必要です。',
            'ko': '레벨 2에 도달하고 프로필을 완성하면 유료 작업이 잠금 해제됩니다. {xp} XP가 더 필요합니다.',
            'es': 'Desbloquea tareas pagadas alcanzando el Nivel 2 y completando tu perfil. Te faltan {xp} XP.',
            'fr': 'Débloquez les tâches payantes en atteignant le niveau 2 et en complétant votre profil. Il vous manque {xp} XP.',
            'de': 'Schalten Sie bezahlte Aufgaben frei, indem Sie Level 2 erreichen und Ihr Profil vervollständigen. Ihnen fehlen {xp} XP.',
            'pt': 'Desbloqueie tarefas pagas atingindo o Nível 2 e completando seu perfil. Você precisa de mais {xp} XP.',
            'ru': 'Разблокируйте платные задания, достигнув уровня 2 и заполнив профиль. Вам не хватает {xp} XP.',
            'ar': 'افتح المهام المدفوعة بالوصول إلى المستوى 2 وإكمال ملفك الشخصي. تحتاج {xp} XP إضافية.',
        },
        'findXpChallenges': {
            'zh': '寻找XP挑战',
            'ja': 'XPチャレンジを探す',
            'ko': 'XP 챌린지 찾기',
            'es': 'Buscar desafíos XP',
            'fr': 'Trouver des défis XP',
            'de': 'XP-Herausforderungen finden',
            'pt': 'Encontrar desafios XP',
            'ru': 'Найти XP челленджи',
            'ar': 'البحث عن تحديات XP',
        },
        'completeProfile': {
            'zh': '完善个人资料',
            'ja': 'プロフィールを完成させる',
            'ko': '프로필 완성',
            'es': 'Completar perfil',
            'fr': 'Compléter le profil',
            'de': 'Profil vervollständigen',
            'pt': 'Completar perfil',
            'ru': 'Заполнить профиль',
            'ar': 'إكمال الملف الشخصي',
        },
        'manualVerification': {
            'zh': '人工验证',
            'ja': '手動検証',
            'ko': '수동 검증',
            'es': 'Verificación manual',
            'fr': 'Vérification manuelle',
            'de': 'Manuelle Überprüfung',
            'pt': 'Verificação manual',
            'ru': 'Ручная проверка',
            'ar': 'التحقق اليدوي',
        },
        'requiredForPayout': {
            'zh': '支付所需',
            'ja': '支払いに必要',
            'ko': '지급에 필요',
            'es': 'requerido para el pago',
            'fr': 'requis pour le paiement',
            'de': 'erforderlich für Auszahlung',
            'pt': 'necessário para pagamento',
            'ru': 'требуется для выплаты',
            'ar': 'مطلوب للدفع',
        },
        'reward': {
            'zh': '奖励',
            'ja': '報酬',
            'ko': '보상',
            'es': 'Recompensa',
            'fr': 'Récompense',
            'de': 'Belohnung',
            'pt': 'Recompensa',
            'ru': 'Награда',
            'ar': 'المكافأة',
        },
        'spotsRemaining': {
            'zh': '剩余名额',
            'ja': '残り枠',
            'ko': '남은 자리',
            'es': 'plazas restantes',
            'fr': 'places restantes',
            'de': 'Plätze übrig',
            'pt': 'vagas restantes',
            'ru': 'мест осталось',
            'ar': 'الأماكن المتبقية',
        },
        'timeLeft': {
            'zh': '剩余时间',
            'ja': '残り時間',
            'ko': '남은 시간',
            'es': 'restante',
            'fr': 'restant',
            'de': 'übrig',
            'pt': 'restante',
            'ru': 'осталось',
            'ar': 'الوقت المتبقي',
        },
        'startTask': {
            'zh': '开始任务',
            'ja': 'タスクを開始',
            'ko': '작업 시작',
            'es': 'Iniciar tarea',
            'fr': 'Démarrer la tâche',
            'de': 'Aufgabe starten',
            'pt': 'Iniciar tarefa',
            'ru': 'Начать задание',
            'ar': 'بدء المهمة',
        },
    },
    # home section
    'home': {
        'viewTasks': {
            'zh': '查看任务',
            'ja': 'タスクを見る',
            'ko': '작업 보기',
            'es': 'Ver tareas',
            'fr': 'Voir les tâches',
            'de': 'Aufgaben ansehen',
            'pt': 'Ver tarefas',
            'ru': 'Посмотреть задания',
            'ar': 'عرض المهام',
        },
        'weeklyDigest': {
            'zh': '📬 每周AI工具精选',
            'ja': '📬 週刊AIツールダイジェスト',
            'ko': '📬 주간 AI 도구 다이제스트',
            'es': '📬 Resumen semanal de herramientas IA',
            'fr': '📬 Digest hebdomadaire des outils IA',
            'de': '📬 Wöchentlicher KI-Tools Digest',
            'pt': '📬 Resumo semanal de ferramentas IA',
            'ru': '📬 Еженедельный дайджест ИИ-инструментов',
            'ar': '📬 ملخص أدوات الذكاء الاصطناعي الأسبوعي',
        },
        'weeklyDigestDesc': {
            'zh': '每周一获取前10名AI工具。无垃圾邮件，随时退订。',
            'ja': '毎週月曜日にトップ10のAIツールを入手。スパムなし、いつでも解除可能。',
            'ko': '매주 월요일 상위 10개 AI 도구를 받아보세요. 스팸 없음, 언제든 구독 취소 가능.',
            'es': 'Recibe las 10 mejores herramientas IA cada lunes. Sin spam, cancela cuando quieras.',
            'fr': 'Recevez les 10 meilleurs outils IA chaque lundi. Pas de spam, désabonnement à tout moment.',
            'de': 'Erhalten Sie jeden Montag die Top 10 KI-Tools. Kein Spam, jederzeit abmelden.',
            'pt': 'Receba as 10 melhores ferramentas IA toda segunda-feira. Sem spam, cancele quando quiser.',
            'ru': 'Получайте топ-10 ИИ-инструментов каждый понедельник. Без спама, отписка в любое время.',
            'ar': 'احصل على أفضل 10 أدوات ذكاء اصطناعي كل يوم اثنين. بدون رسائل مزعجة، إلغاء الاشتراك في أي وقت.',
        },
        'subscribe': {
            'zh': '订阅',
            'ja': '購読する',
            'ko': '구독',
            'es': 'Suscribirse',
            'fr': 'S\'abonner',
            'de': 'Abonnieren',
            'pt': 'Inscrever-se',
            'ru': 'Подписаться',
            'ar': 'اشترك',
        },
        'subscribers': {
            'zh': '加入 {count} 位订阅者。',
            'ja': '{count}人の購読者に参加。',
            'ko': '{count}명의 구독자와 함께하세요.',
            'es': 'Únete a {count} suscriptores.',
            'fr': 'Rejoignez {count} abonnés.',
            'de': 'Schließen Sie sich {count} Abonnenten an.',
            'pt': 'Junte-se a {count} assinantes.',
            'ru': 'Присоединяйтесь к {count} подписчикам.',
            'ar': 'انضم إلى {count} مشترك.',
        },
        'comingSoon': {
            'zh': '🔮 即将推出',
            'ja': '🔮 近日公開',
            'ko': '🔮 곧 출시',
            'es': '🔮 Próximamente',
            'fr': '🔮 Bientôt disponible',
            'de': '🔮 Demnächst',
            'pt': '🔮 Em breve',
            'ru': '🔮 Скоро',
            'ar': '🔮 قريباً',
        },
        'comingSoonDesc': {
            'zh': '成为第一个评测新AI工具的人。',
            'ja': '新しいAIツールを最初にレビューしましょう。',
            'ko': '새로운 AI 도구를 가장 먼저 리뷰하세요.',
            'es': 'Sé el primero en revisar nuevas herramientas IA.',
            'fr': 'Soyez le premier à évaluer les nouveaux outils IA.',
            'de': 'Seien Sie der Erste, der neue KI-Tools bewertet.',
            'pt': 'Seja o primeiro a avaliar novas ferramentas IA.',
            'ru': 'Будьте первым, кто оценит новые ИИ-инструменты.',
            'ar': 'كن أول من يراجع أدوات الذكاء الاصطناعي الجديدة.',
        },
        'notifyMe': {
            'zh': '通知我 →',
            'ja': '通知する →',
            'ko': '알림 받기 →',
            'es': 'Notificarme →',
            'fr': 'Me notifier →',
            'de': 'Benachrichtigen →',
            'pt': 'Notifique-me →',
            'ru': 'Уведомить меня →',
            'ar': 'أبلغني →',
        },
        'notify': {
            'zh': '🔔 通知',
            'ja': '🔔 通知',
            'ko': '🔔 알림',
            'es': '🔔 Notificar',
            'fr': '🔔 Notifier',
            'de': '🔔 Benachrichtigen',
            'pt': '🔔 Notificar',
            'ru': '🔔 Уведомить',
            'ar': '🔔 إشعار',
        },
        'preview': {
            'zh': '预览',
            'ja': 'プレビュー',
            'ko': '미리보기',
            'es': 'Vista previa',
            'fr': 'Aperçu',
            'de': 'Vorschau',
            'pt': 'Prévia',
            'ru': 'Предпросмотр',
            'ar': 'معاينة',
        },
        'peopleInterested': {
            'zh': '人感兴趣',
            'ja': '人が興味を持っています',
            'ko': '명이 관심을 가지고 있습니다',
            'es': 'personas interesadas',
            'fr': 'personnes intéressées',
            'de': 'Personen interessiert',
            'pt': 'pessoas interessadas',
            'ru': 'человек заинтересовано',
            'ar': 'شخص مهتم',
        },
        'feature': {
            'zh': '功能',
            'ja': '機能',
            'ko': '기능',
            'es': 'Característica',
            'fr': 'Fonctionnalité',
            'de': 'Funktion',
            'pt': 'Recurso',
            'ru': 'Функция',
            'ar': 'الميزة',
        },
        'productHunt': {
            'zh': 'Product Hunt',
            'ja': 'Product Hunt',
            'ko': 'Product Hunt',
            'es': 'Product Hunt',
            'fr': 'Product Hunt',
            'de': 'Product Hunt',
            'pt': 'Product Hunt',
            'ru': 'Product Hunt',
            'ar': 'Product Hunt',
        },
        'followAi': {
            'zh': 'Follow-ai',
            'ja': 'Follow-ai',
            'ko': 'Follow-ai',
            'es': 'Follow-ai',
            'fr': 'Follow-ai',
            'de': 'Follow-ai',
            'pt': 'Follow-ai',
            'ru': 'Follow-ai',
            'ar': 'Follow-ai',
        },
    },
}

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def add_translations_to_file(filepath, lang):
    """Add missing translations to a language file"""
    content = read_file(filepath)
    
    for section, keys in TRANSLATIONS.items():
        # Check if section exists
        section_pattern = rf'{section}:\s*\{{'
        if not re.search(section_pattern, content):
            # Add section before the closing brace
            section_content = f"\n  // {section.title()}\n  {section}: {{\n"
            for key, translations in keys.items():
                if lang in translations:
                    value = translations[lang].replace("'", "\\'")
                    section_content += f"    {key}: '{value}',\n"
            section_content += "  },\n"
            
            # Insert before the last closing brace
            content = content.rstrip().rstrip(';').rstrip()
            if content.endswith('}'):
                content = content[:-1] + section_content + "};\n"
        else:
            # Section exists, add missing keys
            for key, translations in keys.items():
                if lang in translations:
                    key_pattern = rf'{section}:\s*\{{[^}}]*{key}:'
                    if not re.search(key_pattern, content, re.DOTALL):
                        # Find the section and add the key
                        value = translations[lang].replace("'", "\\'")
                        new_key = f"    {key}: '{value}',\n"
                        
                        # Find the section opening brace and add after it
                        section_match = re.search(rf'({section}:\s*\{{)', content)
                        if section_match:
                            insert_pos = section_match.end()
                            content = content[:insert_pos] + '\n' + new_key + content[insert_pos:]
    
    write_file(filepath, content)
    print(f"Updated: {filepath}")

def main():
    base_path = '/home/ubuntu/follow-ai-source/follow.ai/src/i18n/locales'
    languages = ['zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'ar']
    
    for lang in languages:
        filepath = os.path.join(base_path, f'{lang}.ts')
        if os.path.exists(filepath):
            add_translations_to_file(filepath, lang)
        else:
            print(f"File not found: {filepath}")

if __name__ == '__main__':
    main()
