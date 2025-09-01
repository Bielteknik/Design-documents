import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const faqData = [
    {
        q: 'Yeni bir proje nasıl oluşturulur?',
        a: 'İnovasyon Merkezi sayfasına gidin ve sağ üst köşedeki "Yeni Fikir Oluştur" butonuna tıklayın. Fikrinizi detaylandırdıktan sonra onaylandığında projeye dönüştürebilirsiniz.',
        tags: ['proje', 'fikir']
    },
    {
        q: 'Takvimime nasıl yeni bir görev eklerim?',
        a: 'Ajanda sayfasında, ilgili günün üzerine çift tıklayarak hızlı ekleme menüsünü açabilir ve "Görev" seçeneğini seçebilirsiniz. Alternatif olarak, üst menüdeki "Yeni Oluştur" butonunu kullanabilirsiniz.',
        tags: ['görev', 'takvim', 'ajanda']
    },
    {
        q: 'Bir projeye yeni ekip üyesi nasıl eklenir?',
        a: 'İlgili projenin detay sayfasına gidin. "Ekip Üyeleri" bölümündeki "Yönet" butonuna tıklayarak açılan pencereden yeni üyeler ekleyebilirsiniz. Bu işlemi yalnızca proje yöneticileri veya adminler yapabilir.',
        tags: ['proje', 'ekip', 'üye']
    },
    {
        q: 'Şifremi nasıl değiştirebilirim?',
        a: 'Sağ üst köşedeki profil resminize tıklayarak "Profil Ayarları" sayfasına gidin. "Güvenlik" sekmesi altında şifre değiştirme seçeneğini bulabilirsiniz.',
        tags: ['şifre', 'hesap', 'güvenlik']
    },
    {
        q: 'Raporlar sayfasında hangi verileri görebilirim?',
        a: 'Raporlar sayfasında projelerin genel ilerleme durumu, kaynakların haftalık kullanım ısı haritası, proje durum dağılımı ve son aktivite akışı gibi önemli metrikleri ve görselleştirmeleri bulabilirsiniz.',
        tags: ['rapor', 'analitik', 'veri']
    }
];

const FaqItem: React.FC<{ question: string; answer: string; }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 px-2 hover:bg-gray-50"
            >
                <span className="font-semibold text-text-primary">{question}</span>
                <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                }`}
            >
                <div className="p-4 pt-0 text-text-secondary">
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
};

export const FaqTab: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFaqs = useMemo(() => {
        if (!searchTerm) return faqData;
        return faqData.filter(faq =>
            faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.tags.some(tag => tag.includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-text-primary mb-2">Sıkça Sorulan Sorular</h2>
            <p className="text-text-secondary mb-6">Aradığınız soruyu bulamıyorsanız, Geri Bildirim & Destek sekmesinden bize ulaşabilirsiniz.</p>
            
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Sorular arasında ara..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-project focus:border-project"
                />
            </div>

            <div className="space-y-2">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                        <FaqItem key={index} question={faq.q} answer={faq.a} />
                    ))
                ) : (
                     <div className="text-center py-12 text-text-secondary">
                        <p>Aramanızla eşleşen bir sonuç bulunamadı.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
