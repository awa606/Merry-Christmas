
import React from 'react';
import { TreeState } from '../types';

interface OverlayProps {
  treeState: TreeState;
  onToggle: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ treeState, onToggle }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12">
      {/* Header */}
      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#D4AF37] tracking-widest drop-shadow-2xl">
          GRAND LUXURY
        </h1>
        <div className="h-1 w-32 bg-[#D4AF37] mt-2"></div>
        <p className="text-[#D4AF37] text-sm tracking-[0.3em] mt-2 font-light opacity-80 uppercase">
          Interactive Christmas Edition
        </p>
      </div>

      {/* Main Interaction */}
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center space-y-2">
          <p className="text-emerald-100/60 text-xs tracking-widest uppercase">Currently In State</p>
          <p className="text-3xl font-serif italic text-white/90">{treeState}</p>
        </div>

        <button
          onClick={onToggle}
          className="pointer-events-auto group relative overflow-hidden px-12 py-4 bg-[#D4AF37] text-[#01160d] font-bold text-lg tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          <span className="relative z-10 uppercase">
            {treeState === TreeState.CHAOS ? 'Assemble The Tree' : 'Shatter Into Chaos'}
          </span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      </div>

      {/* Footer Branding */}
      <div className="flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.5em] text-[#D4AF37]/40 uppercase">
        <p>© 2024 LUXURY ATELIER</p>
        <p className="hidden md:block">Engineered for Perfection</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <span>Emerald</span>
          <span>•</span>
          <span>Gold</span>
          <span>•</span>
          <span>Light</span>
        </div>
      </div>

      {/* Golden Vignette Overlay */}
      <div className="absolute inset-0 border-[20px] md:border-[40px] border-[#D4AF37]/5 pointer-events-none"></div>
    </div>
  );
};

export default Overlay;
