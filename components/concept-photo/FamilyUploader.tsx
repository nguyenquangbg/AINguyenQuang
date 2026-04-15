import React, { useRef, useState } from 'react';
import { FamilyMember, MemberRole } from './types';
import { MaleIcon } from '../icons/MaleIcon';
import { FemaleIcon } from '../icons/FemaleIcon';
import { ChildIcon } from '../icons/ChildIcon';
import { XIcon } from '../icons/XIcon';

interface FamilyUploaderProps {
  familyMembers: FamilyMember[];
  onFamilyChange: (members: FamilyMember[]) => void;
  maxMembers?: number;
}

const roleInfo = {
    'adult_male': { icon: MaleIcon, label: 'Người Lớn (Nam)' },
    'adult_female': { icon: FemaleIcon, label: 'Người Lớn (Nữ)' },
    'child': { icon: ChildIcon, label: 'Trẻ Em' },
};

export const FamilyUploader: React.FC<FamilyUploaderProps> = ({ familyMembers, onFamilyChange, maxMembers }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [roleToAdd, setRoleToAdd] = useState<MemberRole | null>(null);

  const handleAddClick = (role: MemberRole) => {
    setRoleToAdd(role);
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && roleToAdd) {
      const files: File[] = Array.from(event.target.files);
      const newMembers: FamilyMember[] = files.map(file => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        status: 'compressing',
        previewUrl: URL.createObjectURL(file),
        role: roleToAdd,
      }));

      if (maxMembers && (familyMembers.length + newMembers.length) > maxMembers) {
          alert(`Bạn chỉ có thể thêm tối đa ${maxMembers} thành viên cho concept này.`);
          setRoleToAdd(null);
          return;
      }

      onFamilyChange([...familyMembers, ...newMembers]);
      // Reset file input to allow selecting the same file again
      event.target.value = '';
    }
    setRoleToAdd(null);
  };
  
  const handleRemoveMember = (id: string) => {
    onFamilyChange(familyMembers.filter(member => member.id !== id));
  };

  const getStatusIndicator = (status: FamilyMember['status']) => {
    switch(status) {
      case 'compressing':
        return <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>;
      case 'done':
         return <div className="w-4 h-4 text-green-400">✓</div>;
      case 'error':
        return <div className="w-4 h-4 text-red-400">!</div>;
      default:
        return null;
    }
  }

  const isAddDisabled = maxMembers ? familyMembers.length >= maxMembers : false;
  const addButtonTooltip = isAddDisabled ? `Concept này chỉ hỗ trợ tối đa ${maxMembers} người.` : '';

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        multiple
      />
      <div className="grid grid-cols-3 gap-2">
        <button 
            onClick={() => handleAddClick('adult_male')} 
            disabled={isAddDisabled}
            title={addButtonTooltip}
            className="p-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-600"
        >
          <MaleIcon className="w-6 h-6 text-slate-500 dark:text-slate-400 mb-1" />
          <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Thêm Nam</span>
        </button>
        <button 
            onClick={() => handleAddClick('adult_female')} 
            disabled={isAddDisabled}
            title={addButtonTooltip}
            className="p-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-600"
        >
          <FemaleIcon className="w-6 h-6 text-slate-500 dark:text-slate-400 mb-1" />
          <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Thêm Nữ</span>
        </button>
        <button 
            onClick={() => handleAddClick('child')} 
            disabled={isAddDisabled}
            title={addButtonTooltip}
            className="p-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-600"
        >
          <ChildIcon className="w-6 h-6 text-slate-500 dark:text-slate-400 mb-1" />
          <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Thêm Trẻ Em</span>
        </button>
      </div>

       {isAddDisabled && (
        <p className="text-xs text-center text-amber-500 dark:text-amber-400">{addButtonTooltip}</p>
      )}

      {familyMembers.length > 0 && (
        <div className="space-y-3">
          {familyMembers.map(member => {
            const RoleIcon = roleInfo[member.role].icon;
            return (
              <div key={member.id} className="flex items-center bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg">
                <img src={member.previewUrl} alt="portrait" className="w-12 h-12 object-cover rounded-md mr-3" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <RoleIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{roleInfo[member.role].label}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate w-40">{member.file.name}</p>
                </div>
                <div className="mr-3">
                    {getStatusIndicator(member.status)}
                </div>
                <button onClick={() => handleRemoveMember(member.id)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
                  <XIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
