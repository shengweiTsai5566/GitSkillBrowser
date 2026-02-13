"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/ui/tag-input";
import { X, Tag } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tags: string[]) => void;
  repoName: string;
  defaultTags?: string[];
  isProcessing: boolean;
}

export function SkillRegisterDialog({ isOpen, onClose, onConfirm, repoName, defaultTags = [], isProcessing }: Props) {
  const [tags, setTags] = useState<string[]>([]);

  // Sync state when dialog opens or defaults change
  useEffect(() => {
    if (isOpen) {
      setTags(defaultTags);
    }
  }, [isOpen, defaultTags]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    console.log("[DEBUG] SkillRegisterDialog handleConfirm - Tags to send:", tags);
    onConfirm(tags);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-100 p-6 border-b-4 border-black flex justify-between items-center">
          <h3 className="font-black text-xl uppercase italic">Sync Settings</h3>
          <button onClick={onClose} disabled={isProcessing} className="hover:bg-slate-200 p-2 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div>
            <label className="block font-black text-xs uppercase tracking-widest mb-2 text-slate-500">Repository</label>
            <div className="font-bold text-lg truncate">{repoName}</div>
          </div>

          <div>
            <label className="block font-black text-xs uppercase tracking-widest mb-2 text-slate-500 flex items-center gap-2">
              <Tag className="h-4 w-4" /> Additional Tags
            </label>
            
            <TagInput 
              value={tags}
              onChange={setTags}
              placeholder="Type tag and press Enter..."
              disabled={isProcessing}
            />
            
            <p className="text-[10px] font-bold text-slate-400 mt-2">
              Press Enter, Space, or Comma to add tags.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t-4 border-black flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isProcessing} className="font-black uppercase">
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isProcessing} className="bg-yellow-400 text-black border-2 border-black font-black uppercase hover:bg-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
            {isProcessing ? "Syncing..." : "Confirm & Sync"}
          </Button>
        </div>
      </div>
    </div>
  );
}