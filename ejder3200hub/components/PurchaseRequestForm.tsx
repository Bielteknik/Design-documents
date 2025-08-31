import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PurchaseRequestFormProps {
    projectId: string;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export const PurchaseRequestForm: React.FC<PurchaseRequestFormProps> = ({ projectId, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        item: '',
        quantity: 1,
        unitPrice: 0,
        link: '',
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(
                (newFile: File) => !selectedFiles.some(existingFile => existingFile.name === newFile.name)
            );
            setSelectedFiles(prev => [...prev, ...newFiles]);
            if(e.target) e.target.value = '';
        }
    };

    const handleRemoveFile = (fileNameToRemove: string) => {
        setSelectedFiles(prev => prev.filter(file => file.name !== fileNameToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ 
            ...formData, 
            projectId,
            files: selectedFiles.map(f => f.name),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                    <label htmlFor="item" className="block text-sm font-medium text-text-secondary mb-1">Ürün/Hizmet Adı</label>
                    <input id="item" name="item" type="text" value={formData.item} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-text-secondary mb-1">Miktar</label>
                        <input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" min="1" required />
                    </div>
                    <div>
                        <label htmlFor="unitPrice" className="block text-sm font-medium text-text-secondary mb-1">Birim Fiyat (₺)</label>
                        <input id="unitPrice" name="unitPrice" type="number" value={formData.unitPrice} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" min="0" step="0.01" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="link" className="block text-sm font-medium text-text-secondary mb-1">Referans Link</label>
                    <input id="link" name="link" type="url" value={formData.link} onChange={handleChange} placeholder="https://ornek.com/urun" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Belge/Görsel Ekle</label>
                    {selectedFiles.length > 0 && (
                        <ul className="space-y-2 mb-2 max-h-28 overflow-y-auto border p-2 rounded-md">
                            {selectedFiles.map(file => (
                                <li key={file.name} className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm">
                                    <span className="truncate pr-2">{file.name}</span>
                                    <button type="button" onClick={() => handleRemoveFile(file.name)} className="text-red-500 hover:text-red-700 flex-shrink-0">
                                        <X size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <label htmlFor="file-upload" className="relative cursor-pointer w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <span>Dosya Seç...</span>
                        <input id="file-upload" name="files" type="file" className="sr-only" multiple onChange={handleFileChange} />
                    </label>
                </div>
            </div>
            <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t bg-gray-50">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">İptal</button>
                <button type="submit" className="px-4 py-2 bg-project text-white rounded-md hover:bg-project-focus">Talep Oluştur</button>
            </div>
        </form>
    );
};