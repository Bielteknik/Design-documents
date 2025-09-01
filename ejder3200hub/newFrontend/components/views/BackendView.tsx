import React from 'react';
import { ApiLog, SystemMetric, DatabaseStats, SystemStatus } from '../../types';
import { Server, CheckCircle, AlertTriangle, XCircle, Database, RefreshCw, ArrowRight } from 'lucide-react';

interface BackendViewProps {
    systemMetrics: SystemMetric[];
    apiLogs: ApiLog[];
    databaseStats: DatabaseStats[];
}

const MetricCard: React.FC<{ metric: SystemMetric }> = ({ metric }) => {
    const statusConfig = {
        [SystemStatus.Healthy]: { icon: CheckCircle, color: 'text-green-500' },
        [SystemStatus.Warning]: { icon: AlertTriangle, color: 'text-yellow-500' },
        [SystemStatus.Error]: { icon: XCircle, color: 'text-red-500' },
    };
    const Icon = statusConfig[metric.status].icon;
    const color = statusConfig[metric.status].color;

    return (
        <div className="bg-card-bg p-5 rounded-lg shadow-md-custom flex items-center justify-between">
            <div>
                <p className="font-semibold text-text-primary">{metric.name}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{metric.value}</p>
            </div>
            <Icon size={32} className={color} />
        </div>
    );
};

const LogEntry: React.FC<{ log: ApiLog }> = ({ log }) => {
    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-blue-100 text-blue-800';
            case 'POST': return 'bg-green-100 text-green-800';
            case 'PUT': return 'bg-yellow-100 text-yellow-800';
            case 'DELETE': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: number) => {
        if (status >= 500) return 'text-red-500';
        if (status >= 400) return 'text-yellow-500';
        if (status >= 200) return 'text-green-500';
        return 'text-text-secondary';
    };

    return (
        <div className="flex items-center gap-4 text-sm font-mono p-2 hover:bg-main-bg rounded-md">
            <span className="text-text-secondary w-36">{log.timestamp}</span>
            <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${getMethodColor(log.method)}`}>{log.method}</span>
            <span className="flex-1 text-text-primary truncate">{log.endpoint}</span>
            <span className={`font-semibold w-16 ${getStatusColor(log.statusCode)}`}>{log.statusCode}</span>
            <span className="text-text-secondary w-24 text-right">{log.responseTime}ms</span>
        </div>
    );
};


export const BackendView: React.FC<BackendViewProps> = ({ systemMetrics, apiLogs, databaseStats }) => {
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Backend Kontrol Paneli</h1>
                    <p className="text-text-secondary mt-1">Sistem sağlığını, API trafiğini ve veritabanı durumunu izleyin.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-card-bg text-text-primary border border-border-color rounded-lg hover:bg-main-bg transition-colors shadow-sm text-sm font-semibold">
                    <RefreshCw size={16} /> Verileri Yenile
                </button>
            </div>

            <div className="bg-card-bg p-6 rounded-lg shadow-md-custom">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"><Server /> Sistem Durumu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {systemMetrics.map(metric => <MetricCard key={metric.id} metric={metric} />)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card-bg p-6 rounded-lg shadow-md-custom flex flex-col">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"><ArrowRight /> API Kayıtları</h3>
                    <div className="flex-1 space-y-1 overflow-y-auto h-96 pr-2">
                        {apiLogs.map(log => <LogEntry key={log.id} log={log} />)}
                    </div>
                </div>
                <div className="bg-card-bg p-6 rounded-lg shadow-md-custom">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"><Database /> Veritabanı İstatistikleri</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-text-secondary uppercase bg-main-bg">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Tablo Adı</th>
                                    <th scope="col" className="px-4 py-3 text-right">Kayıt Sayısı</th>
                                    <th scope="col" className="px-4 py-3 text-right">Boyut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {databaseStats.map(stat => (
                                    <tr key={stat.tableName} className="border-b border-border-color hover:bg-main-bg">
                                        <th scope="row" className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">{stat.tableName}</th>
                                        <td className="px-4 py-3 text-right">{stat.rowCount.toLocaleString('tr-TR')}</td>
                                        <td className="px-4 py-3 text-right">{stat.size}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
