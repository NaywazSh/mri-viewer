import React, { useState, useRef } from 'react';
import { 
  Menu, Settings, Database, Contrast, Sun, ZoomIn, 
  Share2, AlertCircle, CheckCircle
} from 'lucide-react';

// --- THE MOCK DATABASE ---
// In a real app, this data would come from a server API.
// --- THE MOCK DATABASE (Updated with working links) ---
const STUDY_DATABASE = [
  { 
    id: 1, 
    name: "Localizer", 
    count: 3, 
    modality: "MR",
    // Generic body scan (Unsplash)
    images: [
      "https://images.unsplash.com/photo-1559757175-9e351c95369d?q=80&w=800&auto=format&fit=crop"
    ]
  },
  { 
    id: 2, 
    name: "T2 Sagittal Spine", 
    count: 12, 
    modality: "MR",
    description: "Multi-level degenerative changes.",
    // Wikipedia Commons Spine MRI (Public Domain)
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Lumbar_spine_MRI.jpg/600px-Lumbar_spine_MRI.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Lumbar_spine_MRI.jpg/600px-Lumbar_spine_MRI.jpg" 
    ]
  },
  { 
    id: 3, 
    name: "Brain Axial T2", 
    count: 24, 
    modality: "MR",
    description: "Normal brain appearance.",
    // Wikipedia Commons Brain MRI
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/MRI_head_side.jpg/480px-MRI_head_side.jpg"
    ]
  },
  { 
    id: 4, 
    name: "Knee Coronal PD", 
    count: 15, 
    modality: "MR",
    description: "ACL intact. Mild effusion.",
    // Wikipedia Commons Knee MRI
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/a/a4/Knee_MR_sagittal_T1.jpg"
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

  // Get current data based on selection
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
          
          {/* Viewport Info Overlays */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none text-xs font-mono space-y-1">
            <div className="text-blue-400 font-bold text-sm">Se: {activeSeries.id}</div>
            <div className="text-slate-300">{activeSeries.description || 'No Description'}</div>
          </div>

          <div className="absolute top-4 right-4 z-10 pointer-events-none text-xs font-mono text-right space-y-1">
             <div className="text-slate-300">{PATIENT.name}</div>
             <div className="text-slate-500">Acc: 993821</div>
          </div>

          <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-xs font-mono space-y-1">
            <div className="text-slate-400">Zoom: {zoom}%</div>
          </div>

          <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-xs font-mono text-right space-y-1">
             <div className="text-slate-300">WL: {Math.round(wwwl.l * 20)} / WW: {Math.round(wwwl.w * 30)}</div>
          </div>

          {/* Orientation Markers */}
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600">A</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600">P</span>
          <span className="absolute top-1/2 left-2 -translate-y-1/2 text-xs font-bold text-slate-600">R</span>
          <span className="absolute top-1/2 right-2 -translate-y-1/2 text-xs font-bold text-slate-600">L</span>

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
                  // KEY CHANGE: Load image from the active series
                  src={activeSeries.images[0]} 
                  className="max-h-[90vh] object-contain opacity-90"
                  alt="MRI Scan"
                  draggable="false"
                />
             </div>
          </div>
        </main>

        {/* Right Sidebar (Tools) */}
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
                   ? "Possible disc herniation noted at L4-L5 level. Correlate with clinical symptoms."
                   : "No significant abnormalities detected in this series."
                 }
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
}