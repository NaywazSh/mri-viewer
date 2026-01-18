import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Settings, ChevronDown, ChevronRight, Activity, Layers, 
  Maximize2, Sun, Monitor, Share2, Menu, FileText, Database,
  ArrowUp, ArrowDown, Move, ZoomIn, Contrast
} from 'lucide-react';

// --- Mock Data ---
const PATIENT = { name: "Adrian Lunea", id: "MR-8492-X", dob: "14 Nov 1982", gender: "M" };
const SERIES = [
  { id: 1, name: "Localizer", count: 3 },
  { id: 2, name: "T2 Sagittal Spine", count: 12, active: true },
  { id: 3, name: "T1 Sagittal Spine", count: 12 },
  { id: 4, name: "STIR Sagittal", count: 15 },
  { id: 5, name: "Axial T2", count: 24 },
];

export default function MRIViewerPro() {
  // State
  const [activeSeries, setActiveSeries] = useState(2);
  const [slice, setSlice] = useState(6);
  const [wwwl, setWwwl] = useState({ w: 80, l: 60 }); // Window/Level
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs for drag logic
  const dragStart = useRef({ x: 0, y: 0 });

  // Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = dragStart.current.y - e.clientY;
    
    setWwwl(prev => ({
      w: Math.max(0, Math.min(100, prev.w + dx * 0.2)),
      l: Math.max(0, Math.min(100, prev.l + dy * 0.2))
    }));
    
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleWheel = (e) => {
    const delta = e.deltaY > 0 ? 1 : -1;
    setSlice(prev => Math.min(12, Math.max(1, prev + delta)));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#050505] text-slate-300 font-sans overflow-hidden select-none">
      
      {/* Top Navigation Bar */}
      <header className="h-12 bg-[#0a0a0a] border-b border-slate-800 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
          <Menu className="text-slate-400 cursor-pointer hover:text-white" size={20} />
          <div className="flex flex-col">
            <span className="text-white text-sm font-bold tracking-wide">MED-VIEW <span className="text-blue-500">PRO</span></span>
          </div>
          <div className="h-5 w-px bg-slate-800 mx-2"/>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-white font-medium">{PATIENT.name}</span>
            <span className="text-slate-500">{PATIENT.id}</span>
            <span className="text-slate-500">{PATIENT.dob}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium transition">Report</button>
           <Settings className="text-slate-400 cursor-pointer hover:text-white ml-2" size={18} />
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Series List */}
        <aside className="w-64 bg-[#080808] border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-2 bg-[#0a0a0a] border-b border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-500 uppercase">
            <span>Series Explorer</span>
            <Database size={12} />
          </div>
          <div className="flex-1 overflow-y-auto">
            {SERIES.map((s) => (
              <div 
                key={s.id}
                onClick={() => setActiveSeries(s.id)}
                className={`
                  relative p-3 border-b border-slate-800/50 cursor-pointer group hover:bg-slate-900 transition-all
                  ${activeSeries === s.id ? 'bg-slate-900 border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'}
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-medium ${activeSeries === s.id ? 'text-blue-400' : 'text-slate-300'}`}>{s.name}</span>
                  <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-500">{s.count} img</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">SE: {s.id} • IM: {s.count}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center: Interactive Viewport */}
        <main className="flex-1 flex flex-col bg-black relative">
          
          {/* DICOM Overlays (The Text on the corners) */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none text-xs font-mono space-y-1">
            <div className="text-blue-400 font-bold text-sm">Ex: 4892</div>
            <div className="text-slate-300">Se: {activeSeries}</div>
            <div className="text-slate-300">Im: {slice} / 12</div>
          </div>

          <div className="absolute top-4 right-4 z-10 pointer-events-none text-xs font-mono text-right space-y-1">
            <div className="text-slate-300">{PATIENT.name}</div>
            <div className="text-slate-400">{PATIENT.id}</div>
            <div className="text-slate-500 mt-2">Acc: 993821</div>
            <div className="text-yellow-500/80">FS: 1.5T</div>
          </div>

          <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-xs font-mono space-y-1">
            <div className="text-slate-400">TR: 2500</div>
            <div className="text-slate-400">TE: 102</div>
            <div className="text-blue-500/80 mt-1">Zoom: {zoom}%</div>
          </div>

          <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-xs font-mono text-right space-y-1">
             <div className="text-slate-300">WL: {Math.round(wwwl.l * 20)} / WW: {Math.round(wwwl.w * 30)}</div>
             <div className="text-slate-500">Thickness: 3.0mm</div>
          </div>

          {/* Orientation Markers */}
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600">A</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600">P</span>
          <span className="absolute top-1/2 left-2 -translate-y-1/2 text-xs font-bold text-slate-600">R</span>
          <span className="absolute top-1/2 right-2 -translate-y-1/2 text-xs font-bold text-slate-600">L</span>

          {/* The Image Viewport */}
          <div 
            className="flex-1 flex items-center justify-center overflow-hidden cursor-crosshair relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onWheel={handleWheel}
          >
             {/* Simulated DICOM Image Layer */}
             <div 
               className="relative transition-transform duration-100 ease-out"
               style={{ 
                 transform: `scale(${zoom / 100})`,
                 filter: `contrast(${wwwl.w + 50}%) brightness(${wwwl.l + 30}%) grayscale(100%)`
               }}
             >
                <img 
                  src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800" 
                  className="max-h-[90vh] object-contain opacity-90"
                  alt="MRI"
                  draggable="false"
                />
                
                {/* Visual "Scan Line" effect to make it look active */}
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent pointer-events-none"
                  style={{ top: `${(slice / 12) * 100}%`, height: '2px' }}
                />
             </div>
          </div>

        </main>

        {/* Right Sidebar: Tools & Details */}
        <aside className="w-72 bg-[#080808] border-l border-slate-800 flex flex-col shrink-0">
          
          {/* Tools Panel */}
          <div className="p-4 border-b border-slate-800">
             <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4 tracking-wider">Adjustments</h3>
             
             <div className="space-y-4">
                {/* Window Level Slider */}
                <div>
                   <div className="flex justify-between text-xs mb-2">
                     <span className="flex items-center gap-2"><Contrast size={12}/> Window</span>
                     <span className="font-mono text-slate-400">{Math.round(wwwl.w)}</span>
                   </div>
                   <input 
                     type="range" 
                     className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                     value={wwwl.w}
                     onChange={(e) => setWwwl({...wwwl, w: Number(e.target.value)})} 
                   />
                </div>

                {/* Level Slider */}
                <div>
                   <div className="flex justify-between text-xs mb-2">
                     <span className="flex items-center gap-2"><Sun size={12}/> Level</span>
                     <span className="font-mono text-slate-400">{Math.round(wwwl.l)}</span>
                   </div>
                   <input 
                     type="range" 
                     className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                     value={wwwl.l}
                     onChange={(e) => setWwwl({...wwwl, l: Number(e.target.value)})} 
                   />
                </div>

                {/* Zoom Slider */}
                <div>
                   <div className="flex justify-between text-xs mb-2">
                     <span className="flex items-center gap-2"><ZoomIn size={12}/> Zoom</span>
                     <span className="font-mono text-slate-400">{zoom}%</span>
                   </div>
                   <input 
                     type="range" 
                     min="50" max="200"
                     className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                     value={zoom}
                     onChange={(e) => setZoom(Number(e.target.value))} 
                   />
                </div>
             </div>
          </div>

          {/* Quick DICOM Info Table */}
          <div className="flex-1 p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3 tracking-wider">DICOM Tags</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[11px] font-mono text-slate-400">
               <span>Modality</span><span className="text-slate-200">MR</span>
               <span>Manufacturer</span><span className="text-slate-200">GE Medical</span>
               <span>Matrix</span><span className="text-slate-200">512x512</span>
               <span>FOV</span><span className="text-slate-200">220mm</span>
               <span>Slice Thick.</span><span className="text-slate-200">3.0</span>
               <span>Gap</span><span className="text-slate-200">0.3</span>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="p-4 border-t border-slate-800">
             <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded flex items-center justify-center gap-2 transition">
               <Share2 size={14}/> Share Study
             </button>
          </div>

        </aside>
      </div>
    </div>
  );
}