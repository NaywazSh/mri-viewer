import React, { useState, useRef } from 'react';
import { 
  Menu, Database, AlertCircle
} from 'lucide-react';

// --- DATABASE WITH PEXELS & UNSPLASH IMAGES ---
const STUDY_DATABASE = [
  { 
    id: 1, 
    name: "Localizer", 
    count: 1, 
    modality: "MR",
    description: "Scout view / Localizer",
    // Pexels: Doctor holding a scan
    images: [
      "https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ]
  },
  { 
    id: 2, 
    name: "T2 Sagittal Spine", 
    count: 12, 
    modality: "MR",
    description: "Multi-level degenerative changes.",
    // Unsplash: Spine/Torso X-ray style image
    images: [
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1600" 
    ]
  },
  { 
    id: 3, 
    name: "Brain Axial T2", 
    count: 24, 
    modality: "MR",
    description: "Normal brain appearance.",
    // Pexels: Brain Scan (Blue tint)
    images: [
      "https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ]
  },
  { 
    id: 4, 
    name: "Knee Coronal PD", 
    count: 15, 
    modality: "MR",
    description: "ACL intact. Mild effusion.",
    // Pexels: Knee/Joint Scan
    images: [
      "https://images.pexels.com/photos/7298497/pexels-photo-7298497.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ]
  },
];

const PATIENT = { name: "Adrian Lunea", id: "MR-8492-X", dob: "14 Nov 1982" };

export default function MRIViewerPro() {
  const [activeSeriesId, setActiveSeriesId] = useState(2);
  const [slice, setSlice] = useState(1);
  const [wwwl, setWwwl] = useState({ w: 80, l: 60 });
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const activeSeries = STUDY_DATABASE.find(s => s.id === activeSeriesId) || STUDY_DATABASE[0];

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

  return (
    <div className="flex flex-col h-screen w-full bg-[#050505] text-slate-300 font-sans overflow-hidden select-none">
      
      {/* Header */}
      <header className="h-12 bg-[#0a0a0a] border-b border-slate-800 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
          <Menu className="text-slate-400 cursor-pointer hover:text-white" size={20} />
          <span className="text-white text-sm font-bold tracking-wide">MED-VIEW <span className="text-blue-500">PRO</span></span>
          <div className="h-5 w-px bg-slate-800 mx-2"/>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-white font-medium">{PATIENT.name}</span>
            <span className="text-slate-500">{PATIENT.id}</span>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium">Report</button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-[#080808] border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-2 bg-[#0a0a0a] border-b border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-500 uppercase">
            <span>Series Explorer</span>
            <Database size={12} />
          </div>
          <div className="flex-1 overflow-y-auto">
            {STUDY_DATABASE.map((s) => (
              <div 
                key={s.id}
                onClick={() => { setActiveSeriesId(s.id); setSlice(1); }}
                className={`relative p-3 border-b border-slate-800/50 cursor-pointer hover:bg-slate-900 transition-all ${activeSeriesId === s.id ? 'bg-slate-900 border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-medium ${activeSeriesId === s.id ? 'text-blue-400' : 'text-slate-300'}`}>{s.name}</span>
                  <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-500">{s.count} img</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Viewport */}
        <main className="flex-1 flex flex-col bg-black relative">
          
          <div className="absolute top-4 left-4 z-10 pointer-events-none text-xs font-mono space-y-1">
            <div className="text-blue-400 font-bold text-sm">Se: {activeSeries.id}</div>
            <div className="text-slate-300">{activeSeries.description}</div>
          </div>

          <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-xs font-mono text-right space-y-1">
             <div className="text-slate-300">WL: {Math.round(wwwl.l * 20)} / WW: {Math.round(wwwl.w * 30)}</div>
          </div>

          {/* The Image */}
          <div 
            className="flex-1 flex items-center justify-center overflow-hidden cursor-crosshair relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
             <div 
               className="relative transition-transform duration-100 ease-out"
               style={{ 
                 transform: `scale(${zoom / 100})`,
                 filter: `contrast(${wwwl.w + 50}%) brightness(${wwwl.l + 30}%) grayscale(100%)`
               }}
             >
                <img 
                  // Uses the first image in the array, or falls back if missing
                  src={activeSeries.images[0]} 
                  className="max-h-[90vh] object-contain opacity-90"
                  alt="MRI Scan"
                  draggable="false"
                />
             </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-72 bg-[#080808] border-l border-slate-800 flex flex-col shrink-0 p-4">
           <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4">Adjustments</h3>
           
           <div className="space-y-6">
              <div>
                 <div className="flex justify-between text-xs mb-2 text-slate-400"><span>Window</span><span>{Math.round(wwwl.w)}</span></div>
                 <input type="range" className="w-full h-1 bg-slate-700 rounded-lg accent-blue-500" value={wwwl.w} onChange={(e) => setWwwl({...wwwl, w: Number(e.target.value)})} />
              </div>
              <div>
                 <div className="flex justify-between text-xs mb-2 text-slate-400"><span>Level</span><span>{Math.round(wwwl.l)}</span></div>
                 <input type="range" className="w-full h-1 bg-slate-700 rounded-lg accent-blue-500" value={wwwl.l} onChange={(e) => setWwwl({...wwwl, l: Number(e.target.value)})} />
              </div>
              <div>
                 <div className="flex justify-between text-xs mb-2 text-slate-400"><span>Zoom</span><span>{zoom}%</span></div>
                 <input type="range" min="50" max="200" className="w-full h-1 bg-slate-700 rounded-lg accent-blue-500" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
              </div>
           </div>

           <div className="mt-8 pt-6 border-t border-slate-800">
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Diagnosis Helper</h3>
              <div className="bg-slate-900 p-3 rounded border border-slate-800 text-xs text-slate-400">
                 <div className="flex items-center gap-2 mb-2 text-yellow-500 font-bold">
                    <AlertCircle size={14} /> 
                    <span>AI Suggestion</span>
                 </div>
                 {activeSeriesId === 2 
                   ? "Degenerative changes observed in L4-L5 vertebrae."
                   : activeSeriesId === 3 
                     ? "Brain structures appear normal. No mass effect."
                     : "No significant abnormalities detected in this series."
                 }
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
}