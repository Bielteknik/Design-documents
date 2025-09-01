import React, { useState } from 'react';

interface InvoiceFormProps {
    projectId: string;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const toYYYYMMDD = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ projectId, onSubmit, onCancel }) => {
    const today = toYYYYMMDD(new Date());
    const [formData, setFormData] = useState({
        invoiceNumber: '',
        amount: 0,
        issueDate: today,
        dueDate: today,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, projectId });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                    <label htmlFor="invoiceNumber" className="block text-sm font-medium text-text-secondary mb-1">Fatura Numarası</label>
                    <input id="invoiceNumber" name="invoiceNumber" type="text" value={formData.invoiceNumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-1">Tutar (₺)</label>
                    <input id="amount" name="amount" type="number" value={formData.amount} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" min="0" step="0.01" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="issueDate" className="block text-sm font-medium text-text-secondary mb-1">Düzenleme Tarihi</label>
                        <input id="issueDate" name="issueDate" type="date" value={formData.issueDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-text-secondary mb-1">Son Ödeme Tarihi</label>
                        <input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t bg-gray-50">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">İptal</button>
                <button type="submit" className="px-4 py-2 bg-project text-white rounded-md hover:bg-project-focus">Fatura Ekle</button>
            </div>
        </form>
    );
};
