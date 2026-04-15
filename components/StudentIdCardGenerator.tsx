
import React, { useState, useMemo, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { PhotoUploader } from './PhotoUploader';
import { UNIVERSITIES } from '../data/universityData';
import { MALE_LAST_NAMES, FEMALE_LAST_NAMES, MALE_MIDDLE_NAMES, FEMALE_MIDDLE_NAMES, MALE_FIRST_NAMES, FEMALE_FIRST_NAMES, FACULTIES, CITIES } from '../data/randomStudentData';
import type { University } from '../data/universityData';
import { Loader } from './Loader';
import { RefreshIcon } from './icons/RefreshIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { CheckIcon } from './icons/CheckIcon';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { GeneratedLogo } from './GeneratedLogo';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { dataUrlToFile } from '../utils/imageUtils';
import { CollapsibleSection } from './CollapsibleSection';
import { PencilIcon } from './icons/PencilIcon';
import { XIcon } from './icons/XIcon';


const STOCK_STUDENT_PHOTOS: { gender: 'male' | 'female'; url: string }[] = [
  { gender: 'male', url: 'https://i.imgur.com/KxS32pX.png' },
  { gender: 'male', url: 'https://i.imgur.com/j5kR3zF.png' },
  { gender: 'male', url: 'https://i.imgur.com/8Qp2Y7E.png' },
  { gender: 'female', url: 'https://i.imgur.com/1GvKmWw.png' },
  { gender: 'female', url: 'https://i.imgur.com/xT5sY4v.png' },
  { gender: 'female', url: 'https://i.imgur.com/9tZ0dLG.png' },
];

const TEMPLATES = [
    { id: 'template-bgt', name: 'Hiện đại Ngang', preview: 'https://i.imgur.com/r6YJqgW.png' },
    { id: 'template1', name: 'Cổ điển Xanh', preview: 'https://i.imgur.com/8xJdJgB.png' },
    { id: 'template3', name: 'Hiện đại Dọc', preview: 'https://i.imgur.com/b9iF0vH.png' },
    { id: 'template7', name: 'Chuẩn Bộ GD', preview: 'https://i.imgur.com/Oaj1cFP.png' },
    { id: 'phuong-dong-real', name: 'ĐH Phương Đông', preview: 'https://i.imgur.com/V32rR5r.png' },
    { id: 'aof-template', name: 'Học viện Tài chính', preview: 'https://i.imgur.com/pB3h3hC.png' },
];

const generateRandomNumericString = (length: number) => {
  let result = '';
  const characters = '0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateRandomStudentData = () => {
    const isMale = Math.random() > 0.5;
    const lastName = getRandomElement(isMale ? MALE_LAST_NAMES : FEMALE_LAST_NAMES);
    const middleName = getRandomElement(isMale ? MALE_MIDDLE_NAMES : FEMALE_MIDDLE_NAMES);
    const firstName = getRandomElement(isMale ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES);
    const fullName = `${lastName} ${middleName} ${firstName}`.toUpperCase();

    const birthYear = Math.floor(Math.random() * (2005 - 1998 + 1)) + 1998;
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = Math.floor(Math.random() * 28) + 1;
    const birthDate = new Date(birthYear, birthMonth, birthDay);

    const faculty = getRandomElement(FACULTIES);
    const startYear = birthYear + 18; // Assume starting college at 18
    const courseDuration = 4;
    const expiryYear = startYear + courseDuration;
    const issueDate = new Date(startYear, 8, 5); // Sep 5th
    const expiryDate = new Date(expiryYear, 8, 4);

    const studentId = `${startYear % 100}${generateRandomNumericString(6)}`;
    const className = `${faculty.substring(0, 3).toUpperCase()}${startYear % 100}A`;
    
    const city = getRandomElement(CITIES);
    
    const stockPhoto = getRandomElement(STOCK_STUDENT_PHOTOS.filter(p => p.gender === (isMale ? 'male' : 'female')));

    return {
        fullName,
        birthDate: formatDate(birthDate),
        studentId,
        faculty,
        className,
        course: `Khóa ${startYear}-${expiryYear}`,
        city,
        issueDate: formatDate(issueDate),
        expiryDate: formatDate(expiryDate),
        photoUrl: stockPhoto.url,
        gender: isMale ? 'Nam' : 'Nữ'
    };
};

// FIX: Add the missing StudentIdCardGenerator component and export it.
// The component was not defined, causing an import error in App.tsx.
// A new component has been created using the existing helpers and data.
export const StudentIdCardGenerator: React.FC = () => {
    const [studentData, setStudentData] = useState(() => generateRandomStudentData());
    const [selectedUniversity, setSelectedUniversity] = useState<University>(UNIVERSITIES[0]);
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [customLogo, setCustomLogo] = useState<File | null>(null);
    const [customSchoolName, setCustomSchoolName] = useState('Đại học Tùy chỉnh');
    const [isEditingSchoolName, setIsEditingSchoolName] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const customLogoInputRef = useRef<HTMLInputElement>(null);
    const studentPhotoUploaderRef = useRef<any>(null);

    const uploadedImagePreview = useMemo(() => {
        if (uploadedImage) return URL.createObjectURL(uploadedImage);
        return studentData.photoUrl;
    }, [uploadedImage, studentData.photoUrl]);

    const customLogoPreview = useMemo(() => {
        if (customLogo) return URL.createObjectURL(customLogo);
        return null;
    }, [customLogo]);

    const handleRandomize = () => {
        const newData = generateRandomStudentData();
        setStudentData(newData);
        setUploadedImage(null); // Reset uploaded image when randomizing
    };

    const handleDownload = () => {
        if (cardRef.current) {
            setIsLoading(true);
            html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null })
            .then(canvas => {
                const link = document.createElement('a');
                // Updated filename
                link.download = `${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                setIsLoading(false);
            }).catch(err => {
                console.error('Error generating canvas:', err);
                setIsLoading(false);
            });
        }
    };
    
    const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const uniId = e.target.value;
        const uni = UNIVERSITIES.find(u => u.id === uniId);
        if (uni) {
            setSelectedUniversity(uni);
            if (uni.id === 'custom') {
                setIsEditingSchoolName(true);
            } else {
                setIsEditingSchoolName(false);
            }
        }
    };

    const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCustomLogo(e.target.files[0]);
        }
    };

    const renderCardTemplate = () => {
        // For simplicity, only one template is fully implemented. Others will show a placeholder.
        const university = selectedUniversity.id === 'custom' ?
            { ...selectedUniversity, name: customSchoolName, logoUrl: customLogoPreview || '' } :
            selectedUniversity;

        switch (selectedTemplate) {
            case 'template3':
                return (
                     <div ref={cardRef} className="w-[240px] h-[380px] bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-gray-800 font-sans text-[8px] leading-tight">
                        <div className="flex items-center w-full mb-3">
                            <div className="w-10 h-10 mr-2">
                                {university.logoUrl ? <img src={university.logoUrl} alt="logo" className="w-full h-full object-contain" /> : <GeneratedLogo name={university.name} acronym={university.acronym} size="100%"/> }
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-[7px]">BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
                                <p className="font-bold text-[9px] uppercase" style={{ color: university.mainColor }}>{university.name}</p>
                            </div>
                        </div>
                        <h2 className="font-bold text-[12px] uppercase mb-2" style={{ color: university.mainColor }}>Thẻ Sinh Viên</h2>
                        <div className="w-[90px] h-[120px] mb-2 border-2" style={{ borderColor: university.mainColor }}>
                            <img src={uploadedImagePreview} alt="Student" className="w-full h-full object-cover" crossOrigin="anonymous" />
                        </div>
                        <p className="font-bold text-[12px] uppercase">{studentData.fullName}</p>
                        <div className="text-left w-full mt-2 space-y-1">
                            <p><strong className="w-12 inline-block">Mã SV:</strong> {studentData.studentId}</p>
                            <p><strong className="w-12 inline-block">Ngày sinh:</strong> {studentData.birthDate}</p>
                            <p><strong className="w-12 inline-block">Lớp:</strong> {studentData.className}</p>
                            <p><strong className="w-12 inline-block">Khoa:</strong> {studentData.faculty}</p>
                            <p><strong className="w-12 inline-block">Hệ:</strong> {studentData.course}</p>
                        </div>
                         <div className="flex items-center justify-between w-full mt-auto">
                            <QrCodeIcon className="w-12 h-12" />
                            <div className="text-center">
                                <p className="font-bold text-[9px] uppercase" style={{ color: university.mainColor }}>Hiệu trưởng</p>
                                <p className="text-[7px] italic mt-4">(Ký và ghi rõ họ tên)</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div ref={cardRef} className="w-[340px] h-[210px] bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-800">
                        <p>Template '{TEMPLATES.find(t => t.id === selectedTemplate)?.name}' is not implemented.</p>
                    </div>
                );
        }
    };
    
    return (
    <div className="bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
        <input type="file" ref={customLogoInputRef} onChange={handleCustomLogoUpload} className="hidden" accept="image/png, image/jpeg, image/webp" />
        <main className="container mx-auto px-4 py-8 sm:py-12">
            <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">Tạo Thẻ Sinh Viên AI</h2>
                <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Tạo thẻ sinh viên với thông tin ngẫu nhiên chỉ với vài cú nhấp chuột.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                {/* Left: Controls */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Mẫu Thẻ</h3>
                        <div className="grid grid-cols-3 gap-2">
                        {TEMPLATES.map(template => (
                            <button key={template.id} onClick={() => setSelectedTemplate(template.id)} className={`relative rounded-lg overflow-hidden border-2 transition-all ${selectedTemplate === template.id ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'}`}>
                                <img src={template.preview} alt={template.name} className="aspect-video object-cover" />
                                {selectedTemplate === template.id && <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><CheckIcon className="w-3 h-3 text-white"/></div>}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5">{template.name}</div>
                            </button>
                        ))}
                        </div>
                    </div>
                    
                    <CollapsibleSection title="Thông tin trường học">
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="university" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Chọn trường</label>
                                <select id="university" value={selectedUniversity.id} onChange={handleUniversityChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700">
                                    {UNIVERSITIES.map(uni => <option key={uni.id} value={uni.id}>{uni.name}</option>)}
                                </select>
                            </div>
                            {selectedUniversity.id === 'custom' && (
                                <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg space-y-3">
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="custom-school-name" className="text-sm font-medium whitespace-nowrap">Tên trường:</label>
                                        <input id="custom-school-name" type="text" value={customSchoolName} onChange={e => setCustomSchoolName(e.target.value)} className="w-full p-1 border border-slate-300 dark:border-slate-500 rounded-md bg-white dark:bg-slate-600 text-sm"/>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm font-medium">Logo:</p>
                                        <button onClick={() => customLogoInputRef.current?.click()} className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md text-sm hover:bg-slate-50 dark:hover:bg-slate-500">
                                            <UploadIcon className="w-4 h-4" /> Tải lên
                                        </button>
                                        {customLogo && <button onClick={() => setCustomLogo(null)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"><TrashIcon className="w-4 h-4 text-red-500"/></button>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CollapsibleSection>
                    
                    <CollapsibleSection title="Thông tin sinh viên">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ảnh thẻ sinh viên</label>
                                <PhotoUploader onImageUpload={setUploadedImage} previewUrl={uploadedImage ? URL.createObjectURL(uploadedImage) : null} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Họ và tên</label>
                                <input type="text" value={studentData.fullName} onChange={e => setStudentData(d => ({...d, fullName: e.target.value.toUpperCase()}))} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 mt-1"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Mã sinh viên</label>
                                <input type="text" value={studentData.studentId} onChange={e => setStudentData(d => ({...d, studentId: e.target.value}))} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 mt-1"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Ngày sinh</label>
                                <input type="text" value={studentData.birthDate} onChange={e => setStudentData(d => ({...d, birthDate: e.target.value}))} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 mt-1"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Lớp</label>
                                <input type="text" value={studentData.className} onChange={e => setStudentData(d => ({...d, className: e.target.value}))} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 mt-1"/>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium">Khoa</label>
                                <input type="text" value={studentData.faculty} onChange={e => setStudentData(d => ({...d, faculty: e.target.value}))} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 mt-1"/>
                            </div>
                        </div>
                    </CollapsibleSection>
                </div>

                {/* Right: Output */}
                 <div className="sticky top-24">
                    <div className="relative flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        {isLoading && <Loader />}
                        <h3 className="text-lg font-semibold mb-4">Xem trước thẻ</h3>
                        {renderCardTemplate()}
                        <div className="w-full mt-6 grid grid-cols-2 gap-3">
                            <button onClick={handleRandomize} className="flex items-center justify-center gap-2 w-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 border border-slate-300 dark:border-slate-600 font-bold py-3 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                                <RefreshIcon className="w-5 h-5"/>
                                Ngẫu nhiên
                            </button>
                             <button onClick={handleDownload} className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                <DownloadIcon className="w-5 h-5"/>
                                Tải xuống
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    );
};
