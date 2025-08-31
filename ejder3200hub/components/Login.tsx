import React, { useState } from 'react';
import { Lock } from 'lucide-react';
// FIX: Import 'Role' enum for type-safe role assignment.
import { User, Role } from '../types';

interface LoginProps {
    onLogin: (user: User) => void;
}

const mockUsers: { [key: string]: User & { password?: string } } = {
    // FIX: Replaced string 'admin' with Role.Admin enum member.
    'admin@firma.com': { id: 'r2', username: 'Ahmet Kaya', password: 'Admin123!', role: Role.Admin, departmentId: 'd2' },
    // FIX: Replaced string 'user' with Role.Member enum member.
    'user@firma.com': { id: 'r3', username: 'Can Demir', password: 'User123!', role: Role.Member, departmentId: 'd2' },
};

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const user = mockUsers[username];
        if (user && user.password === password) {
            onLogin({ id: user.id, username: user.username, role: user.role, departmentId: user.departmentId });
        } else {
            setError('Geçersiz kullanıcı adı veya şifre.');
        }
    };

    const particles = Array.from({ length: 15 }).map((_, i) => {
        const style = {
            width: `${Math.random() * 5 + 3}px`,
            height: `${Math.random() * 5 + 3}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 25}s`,
            animationDuration: `${Math.random() * 20 + 20}s`,
        };
        const colorClass = Math.random() > 0.5 
            ? 'bg-blue-400/80' 
            : 'bg-purple-400/80';

        return <div key={i} className={`particle absolute rounded-full ${colorClass} animate-float`} style={style}></div>;
    });

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center filter blur-sm brightness-50"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549721245-c5e3d06b7454?q=80&w=2070&auto=format&fit=crop')" }}
            ></div>
            
            {/* Particles */}
            <div className="absolute inset-0 z-10">
                {particles}
            </div>

            {/* Login Card */}
            <div className="relative z-20 w-full max-w-md bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-white border border-white/10">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl mb-4 shadow-lg">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-bold">ejder3200Hub</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-300">Kullanıcı Adı</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ornek@firma.com"
                            className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-300">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    
                    {error && <p className="text-red-400 text-sm text-center animate-fadeIn">{error}</p>}

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="h-4 w-4 bg-white/10 border-white/20 rounded text-blue-500 focus:ring-blue-500"/>
                            <label htmlFor="remember" className="text-gray-300">Beni hatırla</label>
                        </div>
                        <a href="#" className="text-blue-400 hover:underline">Şifremi unuttum?</a>
                    </div>
                    
                    <button type="submit" className="w-full py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500">
                        Giriş Yap
                    </button>
                    
                    <div className="text-center text-xs text-gray-400 space-y-1">
                        <p>2 Adımlı Doğrulama desteklenir.</p>
                        <p>Hesabın yok mu? <a href="#" className="text-blue-400 font-semibold hover:underline">Ücretsiz kaydol</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};