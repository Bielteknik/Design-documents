

import { Project, Task, Resource, Event, ProjectStatus, Priority, TaskStatus, EventType, Notification, Idea, RsvpStatus, NotificationType, IdeaStatus, PurchaseRequest, PurchaseRequestStatus, Invoice, InvoiceStatus, Evaluation, VoteStatus, Comment, Department, EmploymentType, PerformanceEvaluation, Announcement, Feedback, FeedbackCategory, FeedbackStatus, ApiLog, SystemMetric, SystemStatus, DatabaseStats } from '../types';

export const mockDepartments: Department[] = [
    { id: 'd1', name: 'Yönetim' },
    { id: 'd2', name: 'Yazılım Geliştirme' },
    { id: 'd3', name: 'Tasarım' },
];

export const mockResources: Resource[] = [
    { 
        id: 'r1', 
        name: 'Elif Yılmaz', 
        initials: 'EY', 
        position: 'CEO & İnovasyon Direktörü', 
        departmentId: 'd1', 
        email: 'elif.yilmaz@example.com', 
        phone: '555-0101', 
        skills: ['Liderlik', 'Strateji', 'İnovasyon'], 
        weeklyHours: 40, 
        currentLoad: 30,
        managerId: undefined, // Top level
        bio: 'Şirketin vizyonunu belirler ve inovasyon projelerine liderlik eder. Teknolojiyi iş stratejileriyle birleştirmeyi hedefler.'
    },
    { 
        id: 'r2', 
        name: 'Ahmet Kaya', 
        initials: 'AK', 
        position: 'Kıdemli Proje Yöneticisi', 
        departmentId: 'd2', 
        email: 'ahmet.kaya@example.com', 
        phone: '555-0102', 
        skills: ['Agile', 'Scrum', 'Jira', 'React'], 
        weeklyHours: 40, 
        currentLoad: 38,
        managerId: 'r1',
        bio: 'Çevik metodolojilerle karmaşık projeleri yönetme konusunda uzman.',
        earnedBadges: ['idea_starter'],
    },
    { 
        id: 'r3', 
        name: 'Can Demir', 
        initials: 'CD', 
        position: 'Frontend Geliştirici', 
        departmentId: 'd2', 
        email: 'can.demir@example.com', 
        phone: '555-0103', 
        skills: ['React', 'TypeScript', 'Next.js'], 
        weeklyHours: 40, 
        currentLoad: 40,
        managerId: 'r2',
        bio: 'Modern web teknolojileriyle kullanıcı dostu arayüzler geliştirir.',
        earnedBadges: ['idea_starter'],
    },
    { 
        id: 'r4', 
        name: 'Selin Öztürk', 
        initials: 'SÖ', 
        position: 'Backend Geliştirici', 
        departmentId: 'd2', 
        email: 'selin.ozturk@example.com', 
        phone: '555-0104', 
        skills: ['Node.js', 'Python', 'GraphQL'], 
        weeklyHours: 40, 
        currentLoad: 35,
        managerId: 'r2',
        bio: 'Güçlü ve ölçeklenebilir sunucu tarafı uygulamaları oluşturur.',
        earnedBadges: ['idea_starter'],
    },
    { 
        id: 'r5', 
        name: 'Zeynep Aydın', 
        initials: 'ZA', 
        position: 'UI/UX Tasarım Lideri', 
        departmentId: 'd3', 
        email: 'zeynep.aydin@example.com', 
        phone: '555-0105', 
        skills: ['Figma', 'Kullanıcı Araştırması', 'Prototipleme'], 
        weeklyHours: 40, 
        currentLoad: 32,
        managerId: 'r1',
        bio: 'Kullanıcı merkezli tasarım prensipleriyle estetik ve işlevsel dijital ürünler yaratır.',
        earnedBadges: ['idea_starter'],
    },
    { 
        id: 'r6', 
        name: 'Mehmet Arslan', 
        initials: 'MA', 
        position: 'Grafik Tasarımcı', 
        departmentId: 'd3', 
        email: 'mehmet.arslan@example.com', 
        phone: '555-0106', 
        skills: ['Adobe Creative Suite', 'Marka Kimliği', 'İllüstrasyon'], 
        weeklyHours: 40, 
        currentLoad: 28,
        managerId: 'r5',
        bio: 'Marka kimliğini yansıtan görsel materyaller ve pazarlama içerikleri tasarlar.'
    }
];

export const mockIdeas: Idea[] = [
    { 
        id: 'i1', 
        name: 'Q4 Pazarlama Stratejisi Beyin Fırtınası', 
        status: IdeaStatus.Evaluating,
        // FIX: Changed property name to `authorId` to match the updated `Idea` type.
        authorId: 'r1',
        description: 'Dördüncü çeyrek için yenilikçi pazarlama stratejileri geliştirmek amacıyla bir beyin fırtınası oturumu düzenlemek.',
        problem: 'Mevcut pazarlama stratejilerimiz doygunluğa ulaştı ve yeni müşteri kazanım hızımız yavaşladı.',
        problemType: 'Stratejik',
        problemFrequency: 'Sık',
        tags: ['pazarlama', 'strateji', 'q4'],
        files: ['q3-report.pdf'],
        category: 'Pazarlama Stratejisi',
        targetAudience: '25-45 yaş arası, teknolojiye meraklı, şehirli profesyoneller.',
        totalBudget: 50000,
        expectedROI: 25,
        estimatedDuration: "0-3 Ay",
        risks: 'Yeni kampanyaların hedef kitle tarafından benimsenmemesi, beklenenden düşük etkileşim oranları.',
        riskLevel: 'Orta',
        mitigations: 'A/B testleri ile farklı kampanya versiyonlarını denemek, hedef kitle analizini derinleştirmek.',
        successCriteria: 'Kampanya sonrası web sitesi trafiğinde %20 artış, sosyal medya etkileşim oranlarında %15 artış.',
        priority: Priority.High,
        creationDate: '2025-08-10',
        // FIX: Changed property name to `projectLeaderId` to match the updated `Idea` type.
        projectLeaderId: 'r2',
        potentialTeam: ['r2', 'r5'],
    },
    { 
        id: 'i2', 
        name: 'Yeni Çalışan Oryantasyon Sürecini İyileştirme', 
        status: IdeaStatus.New,
        // FIX: Changed property name to `authorId` to match the updated `Idea` type.
        authorId: 'r4',
        // Temel Bilgiler
        category: 'İç Süreç İyileştirme',
        description: 'Yeni işe başlayan çalışanların şirkete adaptasyonunu hızlandıracak ve verimliliklerini artıracak dijital bir oryantasyon platformu oluşturmak.',
        problem: 'Mevcut oryantasyon süreci manuel, zaman alıcı ve standart değil. Yeni çalışanlar ilk haftalarda yeterli ve doğru bilgiye organize bir şekilde ulaşamıyor.',
        problemType: 'Operasyonel',
        problemFrequency: 'Sık',
        solution: 'Tüm oryantasyon materyallerini (eğitim videoları, dokümanlar, şirket kültürü sunumları) içeren, gamification elementleri ile zenginleştirilmiş, ilerleme takibi yapılabilen bir online platform geliştirilecek.',
        benefits: 'Oryantasyon süresini %50 kısaltmak. İlk 3 aydaki çalışan verimliliğini %20 artırmak. İK departmanının operasyonel yükünü %30 azaltmak.',
        targetAudience: 'Tüm yeni işe başlayan çalışanlar, İK departmanı, departman yöneticileri.',
        relatedDepartments: ['Teknoloji', 'İnsan Kaynakları', 'Pazarlama'],
        // Bütçe ve Süre Planı
        estimatedDuration: '3-6 Ay',
        timelinePhases: [
            { name: 'Analiz ve Planlama', duration: '2 Hafta' },
            { name: 'Tasarım (UI/UX)', duration: '3 Hafta' },
            { name: 'Geliştirme', duration: '8 Hafta' },
            { name: 'Test ve Geri Bildirim', duration: '2 Hafta' },
            { name: 'Yayınlama', duration: '1 Hafta' },
        ],
        criticalMilestones: 'Platformun beta sürümünün yayınlanması ve ilk kullanıcı grubundan geri bildirimlerin toplanması.',
        totalBudget: 85000,
        expectedROI: 120,
        expectedCostSavings: 25000,
        budgetItems: [
            { name: 'Yazılım Geliştirme (Dış Kaynak)', amount: 50000 },
            { name: 'Video Prodüksiyonu', amount: 15000 },
            { name: 'İçerik Geliştirme (İç Kaynak)', amount: 20000 },
        ],
        fundingSources: 'İK Departmanı 2025 yılı bütçesi, İnovasyon Fonu.',
        revenueSources: 'Bu bir iç süreç projesi olduğu için doğrudan gelir modeli yoktur. Getirisi verimlilik artışı ve maliyet tasarrufu olacaktır.',
        tags: ['İK', 'iç süreç', 'verimlilik', 'dijitalleşme'],
        priority: Priority.Medium,
        creationDate: '2025-07-25',
        projectLeaderId: 'r4',
        potentialTeam: ['r4', 'r3', 'r5'],
        riskLevel: 'Düşük',
    },
    { 
        id: 'i3', 
        name: 'Müşteri Geri Bildirim Platformu Fikri', 
        status: IdeaStatus.Approved,
        authorId: 'r2',
        description: 'Müşterilerden gelen geri bildirimleri, önerileri ve şikayetleri tek bir merkezde toplayacak ve analiz edecek bir platform geliştirmek.',
        problem: 'Geri bildirimler farklı kanallardan (e-posta, sosyal medya, anketler) dağınık olarak geliyor ve takibi zor.',
        problemType: 'Teknik',
        problemFrequency: 'Ara Sıra',
        tags: ['müşteri deneyimi', 'yeni ürün', 'veri analizi'],
        files: ['feedback-analysis.docx', 'platform-mockup.png'],
        totalBudget: 120000,
        estimatedDuration: "6-12 Ay",
        expectedROI: 200,
        expectedRevenueIncrease: 50000,
        priority: Priority.High,
        creationDate: '2025-06-15',
        projectLeaderId: 'r1',
        potentialTeam: ['r1', 'r3', 'r4', 'r5'],
        riskLevel: 'Yüksek',
        risks: 'Veri gizliliği ve güvenliği endişeleri. Müşterilerin platformu benimseme oranı.'
    },
    {
        id: 'i4',
        name: 'Mobil Uygulama için Gamification Entegrasyonu',
        status: IdeaStatus.New,
        authorId: 'r5',
        description: 'Kullanıcı etkileşimini ve bağlılığını artırmak için mobil uygulamamıza oyunlaştırma (gamification) elementleri eklemek.',
        problem: 'Kullanıcıların uygulama içi aktif kalma süresi düşük.',
        problemType: 'Stratejik',
        problemFrequency: 'Sık',
        tags: ['mobil', 'UX', 'kullanıcı etkileşimi'],
        totalBudget: 40000,
        estimatedDuration: "3-6 Ay",
        expectedROI: 90,
        priority: Priority.Medium,
        creationDate: '2025-08-01',
        projectLeaderId: 'r5',
        riskLevel: 'Orta',
    },
    {
        id: 'i5',
        name: 'İç Yazışmalar için Chatbot Geliştirme',
        status: IdeaStatus.Archived,
        authorId: 'r3',
        description: 'Sıkça sorulan İK ve IT sorularını otomatik olarak yanıtlayacak bir iç chatbot geliştirmek.',
        problem: 'İK ve IT departmanları tekrarlayan sorulara yanıt vermekten zaman kaybediyor.',
        problemType: 'Operasyonel',
        problemFrequency: 'Sık',
        tags: ['otomasyon', 'verimlilik', 'chatbot'],
        totalBudget: 65000,
        estimatedDuration: "6-12 Ay",
        expectedROI: 150,
        expectedCostSavings: 40000,
        priority: Priority.Low,
        creationDate: '2025-05-20',
        projectLeaderId: 'r3',
        riskLevel: 'Düşük',
    }
];

export const mockProjects: Project[] = [
    { 
        id: 'p1', 
        name: 'Yeni Web Sitesi', 
        code: 'PRJ-2024-001', 
        status: ProjectStatus.Active, 
        priority: Priority.High, 
        startDate: '2024-11-01', 
        endDate: '2025-03-05', 
        progress: 70, 
        managerId: 'r2', 
        team: ['r2', 'r3', 'r4', 'r5', 'r6'], 
        budget: 250000,
        color: '#6366F1',
        files: ['Proje_Plani_v1.2.docx', 'Tasarim_Mockups.fig', 'Teknik_Gereksinimler.pdf']
    },
    { 
        id: 'p2', 
        name: 'Mobil Uygulama', 
        code: 'PRJ-2024-002', 
        status: ProjectStatus.Planning, 
        priority: Priority.Medium, 
        startDate: '2025-01-01', 
        endDate: '2025-06-30', 
        progress: 5, 
        managerId: 'r2', 
        team: ['r2', 'r3', 'r4'], 
        budget: 150000,
        color: '#3B82F6',
    },
    { 
        id: 'p3', 
        name: 'CRM Sistemi', 
        code: 'PRJ-2024-003', 
        status: ProjectStatus.Completed, 
        priority: Priority.Low, 
        startDate: '2024-06-01', 
        endDate: '2024-11-30', 
        progress: 100, 
        managerId: 'r1', 
        team: ['r1', 'r2', 'r4'], 
        budget: 180000,
        color: '#10B981',
    },
];

export const mockTasks: Task[] = [
    // Project 1 Milestones
    { id: 't1', title: 'Tasarım Tamamlandı', status: TaskStatus.Done, priority: Priority.High, assigneeId: 'r5', projectId: 'p1' },
    { id: 't2', title: 'Backend Geliştirme', status: TaskStatus.ToDo, priority: Priority.High, assigneeId: 'r4', projectId: 'p1' },
    { 
        id: 't3', 
        title: 'Frontend Geliştirme', 
        status: TaskStatus.InProgress, 
        priority: Priority.High, 
        assigneeId: 'r3', 
        projectId: 'p1',
        description: 'Kurumsal site tasarımı, geliştirme ve SEO optimizasyonu. Mobil uyumlu ve hızlı yükleme hedefi.',
        tags: ['Frontend', 'Backend', 'UI/UX'],
        endDate: '2025-03-05',
        progress: 70,
        estimatedHours: 80,
        startDate: '2025-01-15',
    },
    
    // Project 2 Milestones
    { id: 't4', title: 'Proje Planlaması', status: TaskStatus.ToDo, priority: Priority.Medium, assigneeId: 'r2', projectId: 'p2', estimatedHours: 20, startDate: '2025-08-12', endDate: '2025-08-19' },
    { id: 't5', title: 'UI/UX Tasarım', status: TaskStatus.ToDo, priority: Priority.Medium, assigneeId: 'r5', projectId: 'p2', estimatedHours: 40, startDate: '2025-08-15', endDate: '2025-08-25' },

    // Project 3 Milestones
    { id: 't6', title: 'Analiz Tamamlandı', status: TaskStatus.Done, priority: Priority.Low, assigneeId: 'r1', projectId: 'p3' },
    { id: 't7', title: 'Geliştirme Bitti', status: TaskStatus.Done, priority: Priority.Low, assigneeId: 'r2', projectId: 'p3' },
    { id: 't8', title: 'Kullanıcı Testleri', status: TaskStatus.Done, priority: Priority.Low, assigneeId: 'r3', projectId: 'p3' },
];


export const mockEvents: Event[] = [
    { id: 'e1', title: 'Proje Başlangıç Toplantısı', date: '2025-08-04', type: EventType.Meeting, startTime: '10:00', endTime: '11:00', participants: ['r1', 'r2', 'r3'], projectId: 'p1', rsvp: { 'r1': RsvpStatus.Accepted, 'r2': RsvpStatus.Pending, 'r3': RsvpStatus.Declined } },
    { id: 'e2', title: 'Müşteri Sunumu', date: '2025-08-06', type: EventType.Appointment, location: 'Müşteri Ofisi', startTime: '14:00', priority: Priority.High },
    { id: 'e3', title: 'Sprint Planlama', date: '2025-08-11', type: EventType.Meeting, startTime: '09:30', endTime: '11:30', participants: ['r2', 'r4', 'r5'], projectId: 'p2', rsvp: { 'r2': RsvpStatus.Accepted, 'r4': RsvpStatus.Accepted, 'r5': RsvpStatus.Pending }},
    { id: 'e4', title: 'Tasarım Revizyonu', date: '2025-08-13', type: EventType.Task, priority: Priority.High, description: 'Ana sayfa tasarımını revize et', projectId: 'p1', status: TaskStatus.ToDo, assigneeId: 'r5' },
    { id: 'e5', title: 'Alışveriş Listesi', date: '2025-08-15', type: EventType.Note, content: 'Süt\nEkmek\nYumurta\nPeynir', tags: ['kişisel'], priority: Priority.Medium, files: ['market_listesi.pdf'] },
    { id: 'e6', title: 'Q3 Pazarlama Fikirleri', date: '2025-08-15', type: EventType.Note, content: 'Sosyal medya kampanyası\nInfluencer işbirliği\nBlog yazıları.', tags: ['iş', 'pazarlama'], priority: Priority.High, ideaId: 'i1' },
    { id: 'e7', title: 'Kitap Önerileri', date: '2025-08-18', type: EventType.Note, content: 'Dune\nYüzüklerin Efendisi\nVakıf Serisi', tags: ['kitap', 'kişisel'], priority: Priority.Low },
    { id: 'e8', title: 'Doktor Randevusu', date: '2025-08-20', type: EventType.Appointment, location: 'Hastane', startTime: '11:00', priority: Priority.Medium },
    { id: 'e9', title: 'Raporları tamamla', date: '2025-08-22', type: EventType.Task, priority: Priority.Low, description: 'Aylık satış raporlarını hazırla', projectId: 'p3', status: TaskStatus.InProgress, assigneeId: 'r6' },
    { id: 'e10', title: 'Doğum Günü', date: '2025-08-15', type: EventType.Event, description: "Ahmet'in doğum günü", content: "Ahmet'in 28. yaş günü kutlaması. Akşam yemeği planlandı.", startTime: '', endTime: '' },
    { id: 'e11', title: 'Yılbaşı Partisi', date: '2025-12-31', type: EventType.Event, description: "Şirket yılbaşı kutlaması", content: "Yılbaşı gecesi şirket partisi. Otel ballroom'da düzenlenecek.", startTime: '20:00', endTime: '02:00' },
    { id: 'e12', title: 'Maraton', date: '2026-01-05', type: EventType.Event, description: "İstanbul Maratonu", content: "42K maraton yarışıması. Başlangıç noktası: Boğaziçi Köprüsü", startTime: '08:00', endTime: '14:00' },
    { id: 'e13', title: 'Sevgililer Günü', date: '2026-02-14', type: EventType.Event, description: "Romantik akşam yemeği", content: "Sevgililer günü için özel restoran rezervasyonu yapıldı.", startTime: '19:30', endTime: '22:00' },
    { id: 'e14', title: 'Mezuniyet', date: '2026-06-20', type: EventType.Event, description: "Kardeşimin mezuniyet töreni", content: "Üniversite mezuniyet töreni. Aile fotoğrafları çekilecek.", startTime: '10:00', endTime: '16:00' },
    { id: 'e15', title: 'Konser', date: '2026-03-15', type: EventType.Event, description: "Favori sanatçı konseri", content: "Olimpiyat Stadyumu'nda konser. Biletler alındı, arkadaşlarla gidilecek.", startTime: '21:00', endTime: '24:00' },
];

export const mockNotifications: Notification[] = [
    { id: 'n1', message: 'Zeynep Demir, "Ana sayfa tasarımı" görevini tamamladı.', timestamp: '2 saat önce', read: false, authorId: 'r2', type: NotificationType.TaskCompleted },
    { id: 'n2', message: 'Mustafa Kurt\'un iş yükü %100\'ü aştı.', timestamp: 'Dün', read: false, authorId: 'r5', type: NotificationType.Overload },
    { id: 'n3', message: '"CRM Sistemi Entegrasyonu" projesi risk altında.', timestamp: 'Dün', read: false, authorId: 'r3', type: NotificationType.ProjectRisk },
    { id: 'n4', message: 'Selin Doğan size "Test senaryoları" görevini atadı.', timestamp: '2 gün önce', read: true, authorId: 'r6', type: NotificationType.TaskAssigned },
    { id: 'n5', message: 'Yeni bir proje oluşturuldu: "Veri Analizi Platformu".', timestamp: 'Geçen hafta', read: true, authorId: 'r1', type: NotificationType.NewProject },
    { id: 'n6', message: 'Sprint Planlama toplantısına davet edildiniz.', timestamp: '3 gün önce', read: false, authorId: 'r2', type: NotificationType.MeetingInvite, eventId: 'e3' },
];

export const mockPurchaseRequests: PurchaseRequest[] = [
    { id: 'pr1', projectId: 'p1', requesterId: 'r3', item: 'Premium Stock Fotoğraf Aboneliği (1 Yıl)', quantity: 1, unitPrice: 1500, status: PurchaseRequestStatus.Approved, requestDate: '2024-11-20' },
    { id: 'pr2', projectId: 'p1', requesterId: 'r1', item: 'Gelişmiş SEO Analiz Aracı Lisansı', quantity: 1, unitPrice: 2500, status: PurchaseRequestStatus.Pending, requestDate: '2024-11-28' },
];

export const mockInvoices: Invoice[] = [
    { id: 'inv1', projectId: 'p1', invoiceNumber: 'INV-2024-11-088', amount: 50000, status: InvoiceStatus.Paid, issueDate: '2024-11-15', dueDate: '2024-12-15' },
    { id: 'inv2', projectId: 'p1', invoiceNumber: 'INV-2024-12-003', amount: 75000, status: InvoiceStatus.Unpaid, issueDate: '2024-12-01', dueDate: '2025-01-01' },
];

export const mockComments: Comment[] = [
    // FIX: Replaced `itemId` with `ideaId` to match the updated `Comment` type definition.
    { id: 'c1', ideaId: 'i2', authorId: 'r1', text: 'Bu fikir harika görünüyor! Pazarlama ekibi olarak nasıl destek olabiliriz?', timestamp: '2 saat önce', votes: { 'r2': VoteStatus.Supports } },
    // FIX: Replaced `itemId` with `ideaId` to match the updated `Comment` type definition.
    { id: 'c2', ideaId: 'i2', authorId: 'r3', text: 'Teknik altyapı konusunda bazı endişelerim var. Gerekli sunucu kaynaklarını ve geliştirme süresini netleştirebilir miyiz?', timestamp: '1 saat önce', votes: { 'r1': VoteStatus.Neutral } },
    // FIX: Replaced `itemId` with `projectId` to match the updated `Comment` type definition.
    { id: 'c3', projectId: 'p1', authorId: 'r2', text: '@[Zeynep Aydın](r5), haklısın. Bir fizibilite toplantısı ayarlayalım. @[Elif Yılmaz](r1), senin de katılman iyi olur.', timestamp: '30 dakika önce', votes: {} },
    // FIX: Replaced `itemId` with `projectId` to match the updated `Comment` type definition.
    { id: 'c4', projectId: 'p1', authorId: 'r4', text: 'Harika bir ilerleme! Test senaryolarını hazırlamaya başlıyorum.', timestamp: '15 dakika önce', votes: { 'r1': VoteStatus.Supports, 'r2': VoteStatus.Supports, 'r3': VoteStatus.Supports } },
];

export const mockEvaluations: Evaluation[] = [
    { 
        id: 'ev1', 
        // FIX: Replaced `itemId` with `ideaId` to match the updated `Evaluation` type definition.
        ideaId: 'i2', 
        authorId: 'r1', 
        text: 'Fikir oldukça yenilikçi ve uygulanabilir. Özellikle maliyet-fayda oranı çok iyi görünüyor.', 
        vote: VoteStatus.Supports, 
        timestamp: '1 gün önce' 
    },
    { 
        id: 'ev2', 
        // FIX: Replaced `itemId` with `ideaId` to match the updated `Evaluation` type definition.
        ideaId: 'i2', 
        authorId: 'r6', 
        text: 'İnovasyon düzeyi yüksek ancak uygulanabilirlik konusunda bazı teknik zorluklar olabilir. UI/UX tarafında detaylı bir çalışma gerekecek.', 
        vote: VoteStatus.Neutral, 
        timestamp: '18 saat önce' 
    },
     { 
        id: 'ev3', 
        // FIX: Replaced `itemId` with `ideaId` to match the updated `Evaluation` type definition.
        ideaId: 'i1', 
        authorId: 'r2', 
        text: 'Bu pazarlama stratejisinin bütçesi çok yüksek. ROI beklentisi konusunda şüphelerim var.', 
        vote: VoteStatus.Opposed, 
        timestamp: '2 gün önce' 
    },
];

export const mockPerformanceEvaluations: PerformanceEvaluation[] = [
    {
        id: 'pe1',
        resourceId: 'r3', // Can Demir
        evaluatorId: 'r2', // Ahmet Kaya
        date: '2025-06-15',
        rating: 4,
        comment: 'Can, React konusundaki yetkinliğini projede kanıtladı. Ekip içi iletişimi ve problem çözme yeteneği çok iyi. Zaman yönetimi konusunda biraz daha dikkatli olabilir.',
        goals: [
            { goal: 'Yeni Web Sitesi projesinin frontend geliştirmesini %80 tamamlamak.', completed: true },
            { goal: 'Kod kalitesini artırmak için unit test yazımına başlamak.', completed: false },
        ]
    },
    {
        id: 'pe2',
        resourceId: 'r4', // Selin Öztürk
        evaluatorId: 'r2', // Ahmet Kaya
        date: '2025-07-01',
        rating: 5,
        comment: 'Selin, backend geliştirmelerinde beklentilerin üzerinde bir performans sergiledi. Node.js konusundaki derin bilgisiyle projenin kritik bir sorununu çözdü. Liderlik potansiyeli yüksek.',
        goals: [
            { goal: 'API response sürelerini %20 iyileştirmek.', completed: true },
            { goal: 'Veritabanı optimizasyonu üzerine bir sunum hazırlamak.', completed: true },
        ]
    },
     {
        id: 'pe3',
        resourceId: 'r3', // Can Demir
        evaluatorId: 'r2', // Ahmet Kaya
        date: '2024-12-20',
        rating: 5,
        comment: 'Önceki dönemdeki geri bildirimleri dikkate alarak zaman yönetimi konusunda büyük ilerleme kaydetti. Teknik olarak zaten çok güçlüydü, şimdi komple bir takım oyuncusu oldu.',
        goals: [
            { goal: 'Unit test coveragını %50\'ye çıkarmak.', completed: true },
        ]
    }
];

export const mockAnnouncements: Announcement[] = [
    {
        id: 'an1',
        title: '2025 Yılı Performans Değerlendirme Süreci Başladı',
        content: 'Değerli çalışma arkadaşlarımız, 2025 yılı performans değerlendirme dönemi bugün itibarıyla başlamıştır. Lütfen ilgili formları İK portalı üzerinden 15 Eylül tarihine kadar doldurunuz.',
        authorId: 'r1',
        timestamp: '2 gün önce',
        departmentId: 'all',
    },
    {
        id: 'an2',
        title: 'Yeni Web Sitesi Projesi Canlıya Alındı!',
        content: 'Büyük bir emekle üzerinde çalıştığımız yeni kurumsal web sitemiz başarıyla yayına alınmıştır. Projede emeği geçen tüm arkadaşlarımıza teşekkür ederiz!',
        authorId: 'r2',
        timestamp: '1 hafta önce',
        departmentId: 'd2'
    }
];

export const mockFeedback: Feedback[] = [
    { id: 'fb1', authorId: 'r3', category: FeedbackCategory.BugReport, rating: 3, subject: 'Takvimde Sürükle-Bırak Çalışmıyor', description: 'Takvim görünümündeyken bir etkinliği başka bir güne sürüklemeye çalıştığımda bazen etkinlik eski yerine geri dönüyor. Özellikle Firefox tarayıcısında oluyor.', files: [], contextUrl: '/calendar', userAgent: 'Firefox 125.0', timestamp: '2 gün önce', status: FeedbackStatus.InProgress, assigneeResourceId: 'r3' },
    { id: 'fb2', authorId: 'r5', category: FeedbackCategory.FeatureRequest, rating: 5, subject: 'Karanlık Mod', description: 'Proje panosuna ve genel arayüze bir karanlık mod özelliği eklenebilir mi? Özellikle akşam saatlerinde çalışırken göz yorgunluğunu azaltacaktır.', files: [], contextUrl: '/projects', userAgent: 'Chrome 126.0', timestamp: '5 gün önce', status: FeedbackStatus.Submitted },
    { id: 'fb3', authorId: null, category: FeedbackCategory.General, rating: 4, subject: 'Kullanışlı Bir Araç', description: 'Genel olarak uygulama çok kullanışlı, projeleri ve görevleri takip etmek oldukça kolaylaşmış. Emeği geçenlere teşekkürler!', files: [], contextUrl: '/', userAgent: 'Safari 17.0', timestamp: '1 hafta önce', status: FeedbackStatus.Resolved },
];

export const mockSystemMetrics: SystemMetric[] = [
    { id: 'sm1', name: 'API Çalışma Süresi', value: '99.98%', status: SystemStatus.Healthy },
    { id: 'sm2', name: 'Veritabanı Bağlantısı', value: 'Aktif', status: SystemStatus.Healthy },
    { id: 'sm3', name: 'Ortalama Yanıt Süresi', value: '120ms', status: SystemStatus.Healthy },
    { id: 'sm4', name: 'Arka Plan İşleri', value: '2 Beklemede', status: SystemStatus.Warning },
];

export const mockApiLogs: ApiLog[] = [
    { id: 'log1', timestamp: '2025-08-15 14:30:15', method: 'GET', endpoint: '/api/projects', statusCode: 200, responseTime: 85 },
    { id: 'log2', timestamp: '2025-08-15 14:30:10', method: 'GET', endpoint: '/api/tasks/p1', statusCode: 200, responseTime: 50 },
    { id: 'log3', timestamp: '2025-08-15 14:29:55', method: 'POST', endpoint: '/api/tasks', statusCode: 201, responseTime: 150 },
    { id: 'log4', timestamp: '2025-08-15 14:29:40', method: 'GET', endpoint: '/api/users/me', statusCode: 200, responseTime: 25 },
    { id: 'log5', timestamp: '2025-08-15 14:29:32', method: 'GET', endpoint: '/api/projects/p2', statusCode: 404, responseTime: 30 },
    { id: 'log6', timestamp: '2025-08-15 14:29:10', method: 'PUT', endpoint: '/api/tasks/t3', statusCode: 200, responseTime: 110 },
    { id: 'log7', timestamp: '2025-08-15 14:28:50', method: 'DELETE', endpoint: '/api/comments/c4', statusCode: 204, responseTime: 95 },
    { id: 'log8', timestamp: '2025-08-15 14:28:30', method: 'POST', endpoint: '/api/auth/login', statusCode: 200, responseTime: 200 },
    { id: 'log9', timestamp: '2025-08-15 14:28:05', method: 'GET', endpoint: '/api/reports/summary', statusCode: 500, responseTime: 2500 },
];

export const mockDatabaseStats: DatabaseStats[] = [
    { tableName: 'projects', rowCount: 3, size: '1.2 MB' },
    { tableName: 'tasks', rowCount: 8, size: '2.5 MB' },
    { tableName: 'resources', rowCount: 6, size: '0.8 MB' },
    { tableName: 'events', rowCount: 15, size: '1.5 MB' },
    { tableName: 'ideas', rowCount: 5, size: '0.9 MB' },
    { tableName: 'comments', rowCount: 4, size: '0.5 MB' },
];