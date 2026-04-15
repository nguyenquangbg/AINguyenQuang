
import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, ChatMessage, ChatResponse } from '../services/geminiService';
import { UploadIcon } from './icons/UploadIcon';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { GlobeIcon } from './icons/GlobeIcon';

type ModelMode = 'fast' | 'smart' | 'thinking';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<(ChatMessage & { groundingMetadata?: any })[]>([]);
  const [input, setInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<File | null>(null);
  const [attachedImagePreview, setAttachedImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings
  const [modelMode, setModelMode] = useState<ModelMode>('smart');
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedImage(file);
      setAttachedImagePreview(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const clearImage = () => {
    setAttachedImage(null);
    setAttachedImagePreview(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      image: attachedImagePreview || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const imageToSend = attachedImage;
    clearImage(); // Clear attached image after sending
    setIsLoading(true);

    try {
        // Filter out grounding metadata from history when sending to API as it's not a standard chat part
        const historyToSend = messages.map(({ groundingMetadata, ...msg }) => msg);
        
        const response = await sendChatMessage(historyToSend, userMsg.text, imageToSend, {
            modelMode,
            useSearch,
            useMaps
        });

        const aiMsg: ChatMessage & { groundingMetadata?: any } = {
            role: 'model',
            text: response.text,
            groundingMetadata: response.groundingMetadata
        };
        setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        console.error(error);
        const errorMsg: ChatMessage = {
            role: 'model',
            text: 'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.'
        };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render grounding sources
  const renderSources = (metadata: any) => {
    if (!metadata?.groundingChunks) return null;
    
    const chunks = metadata.groundingChunks;
    const sources: { title: string; url: string }[] = [];

    chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
            sources.push({ title: chunk.web.title || 'Web Source', url: chunk.web.uri });
        } else if (chunk.maps?.placeAnswerSources?.reviewSnippets?.[0]?.url) {
             sources.push({ title: 'Google Maps Place', url: chunk.maps.placeAnswerSources.reviewSnippets[0].url });
        } else if (chunk.maps?.uri) {
             sources.push({ title: 'Google Maps', url: chunk.maps.uri });
        }
    });

    if (sources.length === 0) return null;

    return (
        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nguồn tham khảo:</p>
            <div className="flex flex-wrap gap-2">
                {sources.map((source, idx) => (
                    <a 
                        key={idx} 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded hover:underline truncate max-w-[200px]"
                    >
                        {source.title}
                    </a>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto p-4">
      <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex-grow flex flex-col overflow-hidden">
        
        {/* Header / Controls */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <SparklesIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="font-bold text-slate-700 dark:text-slate-200">Trợ lý AI</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                 {/* Model Selector */}
                 <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                    <button onClick={() => setModelMode('fast')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${modelMode === 'fast' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>Tốc độ</button>
                    <button onClick={() => setModelMode('smart')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${modelMode === 'smart' ? 'bg-white dark:bg-slate-600 shadow text-purple-600 dark:text-purple-300' : 'text-slate-600 dark:text-slate-400'}`}>Thông minh</button>
                    <button onClick={() => setModelMode('thinking')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${modelMode === 'thinking' ? 'bg-white dark:bg-slate-600 shadow text-amber-600 dark:text-amber-300' : 'text-slate-600 dark:text-slate-400'}`}>Suy luận sâu</button>
                 </div>

                 {/* Tools */}
                 <div className="flex items-center gap-3 border-l border-slate-300 dark:border-slate-600 pl-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={useSearch} onChange={e => setUseSearch(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                        <GlobeIcon className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Google Search</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={useMaps} onChange={e => setUseMaps(e.target.checked)} className="rounded text-green-600 focus:ring-green-500" />
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-500">
                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Google Maps</span>
                    </label>
                 </div>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/30">
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-4 opacity-70">
                    <SparklesIcon className="w-16 h-16" />
                    <p className="text-lg font-medium">Tôi có thể giúp gì cho bạn hôm nay?</p>
                    <div className="flex gap-2 text-xs">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Phân tích ảnh</span>
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Tìm kiếm thông tin</span>
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Viết nội dung</span>
                    </div>
                </div>
            )}
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-600 shadow-sm'
                    }`}>
                        {msg.image && (
                            <img src={msg.image} alt="Attached" className="max-w-full h-auto max-h-60 rounded-lg mb-2" />
                        )}
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                        {msg.role === 'model' && renderSources(msg.groundingMetadata)}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-bl-none p-4 border border-slate-200 dark:border-slate-600 shadow-sm">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            {attachedImagePreview && (
                <div className="mb-2 flex items-center gap-2">
                    <div className="relative group">
                        <img src={attachedImagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-slate-300 dark:border-slate-600" />
                        <button onClick={clearImage} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                            <XIcon className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}
            <div className="flex items-end gap-2">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    title="Đính kèm ảnh"
                >
                    <UploadIcon className="w-5 h-5" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    className="flex-grow p-3 bg-slate-100 dark:bg-slate-700 border-transparent focus:border-blue-500 focus:ring-0 rounded-lg resize-none max-h-32 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    rows={1}
                    style={{ minHeight: '44px' }}
                />
                
                <button 
                    onClick={handleSend}
                    disabled={(!input.trim() && !attachedImage) || isLoading}
                    className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform -rotate-45 translate-x-0.5 -translate-y-0.5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
