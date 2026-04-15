import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

type LogEntry = { type: 'scan' | 'zip' | 'success' | 'error' | 'summary' | 'info'; message: string };

export const SmartPhotoSorter: React.FC = () => {
    const [sourceFiles, setSourceFiles] = useState<FileList | null>(null);
    const [sourceFolderName, setSourceFolderName] = useState('');
    
    const [fileTypes, setFileTypes] = useState('jpg, jpeg, png, nef, arw, cr2, raw');
    const [searchTerms, setSearchTerms] = useState('');

    const [log, setLog] = useState<LogEntry[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const directoryInputRef = useRef<HTMLInputElement>(null);
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [log]);

    const addLog = (type: LogEntry['type'], message: string) => {
        setLog(prev => [...prev, { type, message }]);
    };
    
    const handleSelectDirectory = () => {
        directoryInputRef.current?.click();
    };

    const handleDirectoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSourceFiles(files);
            // Infer folder name from the relative path of the first file
            const firstFile = files[0];
            const path = (firstFile as any).webkitRelativePath || '';
            const folderName = path.split('/')[0] || 'Selected Folder';
            setSourceFolderName(folderName);
            addLog('success', `Đã chọn thư mục nguồn: ${folderName} (${files.length} tệp)`);
        }
         // Reset input value to allow selecting the same folder again
        event.target.value = '';
    };

    const startProcess = async () => {
        if (!sourceFiles) {
            addLog('error', 'Vui lòng chọn một thư mục nguồn.');
            return;
        }

        setIsProcessing(true);
        setLog([]);
        let matchedFiles: File[] = [];

        try {
            const fileTypesArray = fileTypes.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
            const searchTermsArray = searchTerms.split('\n').map(s => s.trim().toLowerCase()).filter(Boolean);
            
            addLog('scan', `Bắt đầu quét thư mục '${sourceFolderName}'...`);

            for (let i = 0; i < sourceFiles.length; i++) {
                const file = sourceFiles[i];
                const lowerCaseName = file.name.toLowerCase();
                const extension = lowerCaseName.split('.').pop() || '';
                
                const typeMatch = fileTypesArray.length === 0 || fileTypesArray.includes(extension);
                const nameMatch = searchTermsArray.length === 0 || searchTermsArray.some(term => lowerCaseName.includes(term));

                if (typeMatch && nameMatch) {
                    matchedFiles.push(file);
                }
            }
            
            if (matchedFiles.length === 0) {
                addLog('summary', 'Hoàn tất! Không tìm thấy tệp nào phù hợp với điều kiện lọc.');
                setIsProcessing(false);
                return;
            }

            addLog('info', `Tìm thấy ${matchedFiles.length} tệp phù hợp. Bắt đầu tạo tệp ZIP...`);
            
            const zip = new JSZip();
            for (const file of matchedFiles) {
                // Use webkitRelativePath to maintain folder structure within the zip
                const relativePath = (file as any).webkitRelativePath || file.name;
                addLog('zip', `Đang thêm: ${relativePath}`);
                zip.file(relativePath, file);
            }

            addLog('info', 'Đang nén tệp ZIP, quá trình này có thể mất một lúc...');
            const zipBlob = await zip.generateAsync({ type: 'blob' });

            // Trigger download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = `${sourceFolderName}-filtered.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            addLog('summary', `Hoàn tất! Đã tạo và tải xuống tệp ZIP với ${matchedFiles.length} tệp.`);

        } catch (err) {
            if (err instanceof Error) {
                 console.error("Error during sorting process:", err);
                 addLog('error', `Đã xảy ra lỗi: ${err.message}.`);
            }
        } finally {
            setIsProcessing(false);
        }
    };
    
    const getIconForLog = (type: LogEntry['type']) => {
        switch(type) {
            case 'scan': return <DocumentTextIcon className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />;
            case 'info': return <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-sky-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            case 'zip': return <CopyIcon className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />;
            case 'success': return <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />;
            case 'summary': return <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />;
            case 'error': return <XIcon className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />;
            default: return null;
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
             <input
                type="file"
                ref={directoryInputRef}
                onChange={handleDirectoryChange}
                className="hidden"
                // @ts-ignore
                webkitdirectory="true"
                directory="true"
            />
            <main className="container mx-auto px-4 py-8 sm:py-12">
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">Trình Lọc & Sắp Xếp Ảnh Thông Minh</h2>
                    <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-3xl mx-auto">Chọn thư mục, đặt điều kiện lọc và tải về tệp ZIP chứa ảnh đã lọc. An toàn và riêng tư.</p>
                </div>

                <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                            <label className="sm:w-32 text-sm font-medium text-slate-700 dark:text-slate-300 sm:text-right flex-shrink-0">Thư Mục Cần Lọc:</label>
                            <input type="text" readOnly value={sourceFolderName} placeholder="Chưa chọn thư mục..." className="flex-grow w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700/50 cursor-default" />
                            <button onClick={handleSelectDirectory} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 w-full sm:w-auto">Chọn</button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                            <label htmlFor="fileTypes" className="sm:w-32 text-sm font-medium text-slate-700 dark:text-slate-300 sm:text-right flex-shrink-0">Lọc Theo Loại File:</label>
                            <input type="text" name="fileTypes" id="fileTypes" value={fileTypes} onChange={(e) => setFileTypes(e.target.value)} placeholder="JPG, NEF, RAW,..." className="flex-grow w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                            <label htmlFor="searchTerms" className="sm:w-32 text-sm font-medium text-slate-700 dark:text-slate-300 sm:text-right flex-shrink-0 mt-2">Mã Ảnh Cần Tìm:</label>
                            <textarea name="searchTerms" id="searchTerms" value={searchTerms} onChange={(e) => setSearchTerms(e.target.value)} placeholder="Nhập mỗi mã ảnh trên một dòng..." rows={3} className="flex-grow w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <a 
                            href="https://www.facebook.com/diepfoto" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-sm w-full sm:w-auto text-center"
                        >
                            Liên Hệ Facebook Hoàng Điệp
                        </a>
                        <button
                            onClick={startProcess}
                            disabled={isProcessing || !sourceFiles}
                            className="flex-grow w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center text-base shadow"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                                    Đang xử lý...
                                </>
                            ) : (
                                'LỌC & TẢI TỆP ZIP'
                            )}
                        </button>
                    </div>

                    {/* Log Panel */}
                     <div>
                         <div ref={logContainerRef} className="h-60 bg-slate-100 dark:bg-slate-900/50 rounded-md p-3 overflow-y-auto text-sm font-mono space-y-2 border border-slate-200 dark:border-slate-700">
                            {log.map((entry, index) => (
                                <div key={index} className={`flex items-start ${
                                    entry.type === 'summary' ? 'text-green-600 dark:text-green-400 font-bold' : 
                                    entry.type === 'error' ? 'text-red-600 dark:text-red-400' :
                                    entry.type === 'info' ? 'text-sky-600 dark:text-sky-400' :
                                    entry.type === 'success' ? 'text-green-600 dark:text-green-400' :
                                    'text-slate-600 dark:text-slate-300'
                                }`}>
                                    {getIconForLog(entry.type)}
                                    <span className="flex-1 break-all">{entry.message}</span>
                                </div>
                            ))}
                            {log.length === 0 && <p className="text-slate-400 italic">Nhật ký xử lý sẽ xuất hiện ở đây...</p>}
                         </div>
                     </div>
                </div>
            </main>
        </div>
    );
};