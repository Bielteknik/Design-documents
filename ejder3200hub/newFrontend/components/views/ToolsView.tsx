
import React from 'react';
import { Timer, Calculator, Cloud, Lock, Palette, QrCode, Replace, Globe } from 'lucide-react';

interface ToolCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    buttonText: string;
    color: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon: Icon, title, description, buttonText, color }) => {
    return (
        <div 
            className="bg-card-bg p-4 rounded-lg shadow-lg text-text-secondary flex flex-col gap-3 border-l-4 h-full"
            style={{ borderLeftColor: color }}
        >
            <h3 className="font-bold text-text-primary text-md">{title}</h3>

            <p className="text-sm flex-grow leading-snug">{description}</p>
            
            <button 
                className="w-full mt-auto px-4 py-2 text-white font-semibold rounded-lg transition-colors text-sm"
                style={{ backgroundColor: color }}
            >
                {buttonText}
            </button>
        </div>
    );
};

export const ToolsView: React.FC = () => {
    const tools: ToolCardProps[] = [
        { icon: Timer, title: 'Pomodoro Zamanlayıcı', description: 'Odaklanmanızı artırmak için 25 dakikalık çalışma seansları', buttonText: 'Başlat', color: '#EF4444' },
        { icon: Calculator, title: 'Hesap Makinesi', description: 'Hızlı hesaplamalar için basit hesap makinesi', buttonText: 'Aç', color: '#3B82F6' },
        { icon: Cloud, title: 'Hava Durumu', description: 'Güncel hava durumu bilgileri ve tahminler', buttonText: 'Görüntüle', color: '#22C55E' },
        { icon: Lock, title: 'Şifre Oluşturucu', description: 'Güvenli ve karmaşık şifreler oluşturun', buttonText: 'Oluştur', color: '#8B5CF6' },
        { icon: Palette, title: 'Renk Seçici', description: 'Renk kodları seçin ve kopyalayın', buttonText: 'Seç', color: '#F97316' },
        { icon: QrCode, title: 'QR Kod Oluşturucu', description: 'Metin ve URL\'ler için QR kod oluşturun', buttonText: 'Oluştur', color: '#14B8A6' },
        { icon: Replace, title: 'Birim Çevirici', description: 'Uzunluk, ağırlık ve sıcaklık çevirileri', buttonText: 'Çevir', color: '#EC4899' },
        { icon: Globe, title: 'Dünya Saatleri', description: 'Farklı şehirlerin saat dilimlerini görün', buttonText: 'Görüntüle', color: '#6366F1' },
    ];

    return (
        <div className="animate-fadeIn">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Araçlar</h2>
                <p className="text-text-secondary mt-1">Günlük işlerinizi kolaylaştıracak kullanışlı araçlar</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tools.map(tool => <ToolCard key={tool.title} {...tool} />)}
            </div>
        </div>
    );
};