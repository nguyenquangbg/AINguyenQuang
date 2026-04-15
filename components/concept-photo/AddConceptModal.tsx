import React, { useState } from 'react';
import { Concept, Pose } from './types';
import { XIcon } from '../icons/XIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface AddConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (concept: Concept) => void;
}

type FormPose = {
    name: string;
    prompt: string;
}

export const AddConceptModal: React.FC<AddConceptModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [requiredPortraits, setRequiredPortraits] = useState(1);
    const [isFamilyPrompt, setIsFamilyPrompt] = useState(false);
    const [poses, setPoses] = useState<FormPose[]>([{ name: 'Dáng 1', prompt: '' }]);

    const resetForm = () => {
        setName('');
        setDescription('');
        setRequiredPortraits(1);
        setIsFamilyPrompt(false);
        setPoses([{ name: 'Dáng 1', prompt: '' }]);
    };

    const handlePoseChange = (index: number, field: keyof FormPose, value: string) => {
        const newPoses = [...poses];
        newPoses[index][field] = value;
        setPoses(newPoses);
    };

    const addPose = () => {
        setPoses([...poses, { name: `Dáng ${poses.length + 1}`, prompt: '' }]);
    };

    const removePose = (index: number) => {
        if (poses.length > 1) {
            setPoses(poses.filter((_, i) => i !== index));
        }
    };

    const handleSave = () => {
        const finalPoses: Pose[] = poses.map((p, index) => ({
            id: `user-${name.replace(/\s+/g, '-')}-${index}`,
            name: p.name,
            prompt: p.prompt,
        }));

        const newConcept: Concept = {
            id: `user-${name.replace(/\s+/g, '-')}-${Date.now()}`,
            name,
            category: 'Tạo bởi bạn',
            description,
            poses: finalPoses,
            prompts: finalPoses.map(p => p.prompt),
            requiredPortraits,
            isFamilyPrompt,
        };

        onSave(newConcept);
        resetForm();
    };

    const isSaveDisabled = !name.trim() || poses.some(p => !p.name.trim() || !p.prompt.trim());

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Thêm Concept Mới</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Đóng">
                        <XIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                </header>
                
                <main className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="concept-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên Concept (bắt buộc)</label>
                        <input id="concept-name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                    </div>
                    <div>
                        <label htmlFor="concept-desc" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mô tả (tùy chọn)</label>
                        <textarea id="concept-desc" value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="concept-portraits" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Số ảnh chân dung</label>
                            <input id="concept-portraits" type="number" min="1" value={requiredPortraits} onChange={e => setRequiredPortraits(Math.max(1, parseInt(e.target.value, 10) || 1))} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                        </div>
                        <div className="flex items-end pb-2">
                             <div className="flex items-center">
                                <input id="concept-family" type="checkbox" checked={isFamilyPrompt} onChange={e => setIsFamilyPrompt(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                                <label htmlFor="concept-family" className="ml-2 block text-sm text-slate-900 dark:text-slate-200">Concept gia đình?</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 mb-2">Các dáng chụp</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto p-1">
                            {poses.map((pose, index) => (
                                <div key={index} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 space-y-2 relative">
                                    <input type="text" placeholder="Tên dáng (ví dụ: Chụp cận mặt)" value={pose.name} onChange={e => handlePoseChange(index, 'name', e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-500 rounded-md bg-white dark:bg-slate-600 text-sm font-semibold" />
                                    <textarea placeholder="Câu lệnh AI cho dáng này... (dùng [face1], [face2]... để thay thế)" value={pose.prompt} onChange={e => handlePoseChange(index, 'prompt', e.target.value)} rows={3} className="w-full p-2 border border-slate-300 dark:border-slate-500 rounded-md bg-white dark:bg-slate-600 text-sm" />
                                    {poses.length > 1 && (
                                        <button onClick={() => removePose(index)} className="absolute top-2 right-2 p-1.5 rounded-full bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 text-red-600 dark:text-red-300" aria-label="Xóa dáng">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                         <button onClick={addPose} className="mt-3 w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            <PlusIcon className="w-4 h-4" /> Thêm dáng chụp
                        </button>
                    </div>

                </main>

                <footer className="flex justify-end items-center p-4 space-x-3 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors">Hủy</button>
                    <button onClick={handleSave} disabled={isSaveDisabled} className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300 dark:disabled:bg-purple-800/50 disabled:cursor-not-allowed">Lưu Concept</button>
                </footer>
            </div>
        </div>
    );
};
