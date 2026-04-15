import React, { useState, useEffect } from 'react';
import type { ConceptCategory, Concept, Pose } from './types';

interface ConceptSelectorProps {
  concepts: ConceptCategory[];
  selectedConcept: Concept | null;
  setSelectedConcept: (concept: Concept | null) => void;
  selectedPoses: Pose[];
  setSelectedPoses: (poses: Pose[]) => void;
}

export const ConceptSelector: React.FC<ConceptSelectorProps> = ({
  concepts,
  selectedConcept,
  setSelectedConcept,
  selectedPoses,
  setSelectedPoses
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(concepts[0].id);

  const handleConceptSelect = (concept: Concept) => {
    setSelectedConcept(concept);
    // Auto-select all poses in the concept
    setSelectedPoses(concept.poses);
  };
  
  const handlePoseToggle = (pose: Pose) => {
      const isSelected = selectedPoses.some(p => p.id === pose.id);
      if (isSelected) {
          setSelectedPoses(selectedPoses.filter(p => p.id !== pose.id));
      } else {
          setSelectedPoses([...selectedPoses, pose]);
      }
  };
  
  const handleSelectAllPoses = () => {
    if (selectedConcept) {
        if (selectedPoses.length === selectedConcept.poses.length) {
            setSelectedPoses([]); // Deselect all
        } else {
            setSelectedPoses(selectedConcept.poses); // Select all
        }
    }
  };

  useEffect(() => {
    // if selected concept changes, reset poses
    if(selectedConcept) {
        setSelectedPoses(selectedConcept.poses)
    } else {
        setSelectedPoses([]);
    }
  }, [selectedConcept]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {concepts.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
              activeCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
        {concepts.find(c => c.id === activeCategory)?.concepts.map(concept => (
          <button
            key={concept.id}
            onClick={() => handleConceptSelect(concept)}
            className={`w-full p-3 text-left rounded-lg transition-colors text-sm ${
              selectedConcept?.id === concept.id
                ? 'bg-purple-100 dark:bg-purple-600/30 border border-purple-500'
                : 'bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <p className="font-semibold text-slate-800 dark:text-white">{concept.name}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{concept.description || `Yêu cầu ${concept.requiredPortraits} ảnh chân dung.`}</p>
          </button>
        ))}
      </div>
      
      {selectedConcept && (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chọn dáng chụp ({selectedPoses.length}/{selectedConcept.poses.length})</h4>
                <button
                    onClick={handleSelectAllPoses}
                    className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                    {selectedPoses.length === selectedConcept.poses.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {selectedConcept.poses.map(pose => {
                     const isSelected = selectedPoses.some(p => p.id === pose.id);
                     return (
                         <button
                            key={pose.id}
                            onClick={() => handlePoseToggle(pose)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                                 isSelected
                                    ? 'bg-green-500 text-white'
                                    : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
                            }`}
                        >
                            {pose.name}
                        </button>
                     )
                })}
            </div>
        </div>
      )}
    </div>
  );
};
