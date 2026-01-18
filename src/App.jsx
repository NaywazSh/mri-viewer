import React, { useState, useRef } from 'react';
import { 
  Menu, Database, AlertCircle, Share2, Settings, 
  MoreHorizontal, Activity, Lock, CheckCircle2, X, CreditCard, GraduationCap
} from 'lucide-react';

// --- MOCK DATABASE (Unchanged) ---
const STUDY_DATABASE = [
  { 
    id: 1, 
    name: "Localizer", 
    count: 3, 
    modality: "MR",
    description: "Scout / 3-Plane Loc",
    techParams: { tr: "450", te: "10", slice: "5.0", matrix: "256x128", fov: "350mm" },
    images: ["https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1000"]
  },
  { 
    id: 2, 
    name: "T2 Sagittal Spine", 
    count: 12, 
    modality: "MR",
    description: "FSE T2 Sagittal",
    techParams: { tr: "2500", te: "102", slice: "3.0", matrix: "512x512", fov: "280mm" },
    images: ["https://images.pexels.com/photos/5723877/pexels-photo-5723877.jpeg?auto=format&fit=crop&q=80&w=800"]
  },
  { 
    id: 3, 
    name: "Brain Axial FLAIR", 
    count: 24, 
    modality: "MR",
    description: "Axial Brain Obl",
    techParams: { tr: "9000", te: "120", slice: "5.0", matrix: "320x224", fov: "220mm" },
    images: ["https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
  },
  { 
    id: 4, 
    name: "Knee Coronal PD", 
    count: 15, 
    modality: "MR",
    description: "Coronal PD Fat Sat",
    techParams: { tr: "2800", te: "35", slice: "3.5", matrix: "384x256", fov: "160mm" },
    images: ["https://images.pexels.com/photos/7089298/pexels-photo-7089298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
  },
];

const PATIENT = { name: "Adrian Lunea", id: "MR-8492-X", dob: "1982-11-14", sex: "M" };

export default function MRIViewerPro() {
  // --- STATE ---
  const [activeSeriesId, setActiveSeriesId] = useState(2);
  const [slice, setSlice] = useState(1);
  const [wwwl, setWwwl] = useState({ w: 80, l: 60 });
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // NEW: State for Menu and Upgrade Modal
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const activeSeries = STUDY_DATABASE.find(s => s.id === activeSeriesId) || STUDY_DATABASE[0];

  // Drag Logic
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
    <div className="flex flex-col h-screen w-full bg-[#050505] text-slate-300 font-sans overflow-hidden select-none relative">
      
      {/* --- UPGRADE MODAL OVERLAY --- */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-900/50">
                <GraduationCap size={32} className="text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Med-View <span className="text-yellow-500">PRO</span></h2>
              <p className="text-slate-400 text-sm mb-6">
                Unlock the complete medical learning database designed for students and residents.
              </p>

              <div className="space-y-3 text-left bg-slate-900/50 p-4 rounded-lg border border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <span className="text-sm text-slate-200">Access 500+ MRI Case Studies</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <span className="text-sm text-slate-200">Pathology Annotations & Quizzes</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <span className="text-sm text-slate-200">High-Res DICOM Downloads</span>
                </div>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                <CreditCard size={18} /> Upgrade Now - $9.99/mo
              </button>
            </div>
            
            <div className="bg-slate-900 py-3 text-center text-xs text-slate-500 border-t border-slate-800">
              Trusted by students from top medical universities
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="h-14 bg-[#0a0a0a] border-b border-slate-800 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4 relative">
          
          {/* MENU BUTTON */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded hover:bg-slate-800 transition-colors ${isMenuOpen ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              <Menu size={20} />
            </button>

            {/* DROPDOWN MENU */}
            {isMenuOpen && (
              <div className="absolute top-12 left-0 w-64 bg-[#151515] border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-slate-800 bg-slate-900/50">
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Plan</div>
                   <div className="text-sm text-white font-medium">Student (Free)</div>
                </div>
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white bg-slate-800 rounded"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Free Access
                  </button>
                  <button 
                    onClick={() => { setIsMenuOpen(false); setShowUpgradeModal(true); }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-yellow-400 rounded group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Lock size={14} className="text-slate-500 group-hover:text-yellow-500"/>
                      PAID Access
                    </div>
                    <span className="text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded">PRO</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col leading-none">
             <span className="text-white text-sm font-bold tracking-wider">MED-VIEW <span className="text-blue-500">EDU</span></span>
             <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Student Edition</span>
          </div>

          <div className="h-6 w-px bg-slate-800 mx-2"/>
          <div className="flex flex-col text-xs">
            <span className="text-white font-medium tracking-wide">{PATIENT.name}</span>
            <div className="flex gap-2 text-slate-500">
               <span>{PATIENT.id}</span>
               <span>•</span>
               <span>{PATIENT.sex}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => setShowUpgradeModal(true)}
             className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white px-4 py-1.5 rounded text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-yellow-900/20"
           >
             Upgrade to Pro
           </button>
           <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded text-xs font-medium transition flex items-center gap-2">
             <Share2 size={14}/> Share
           </button>
        </div>
      </header>

      {/* --- MAIN LAYOUT (Identical to previous version) --- */}
      <div className="flex flex-1 overflow-hidden" onClick={() => setIsMenuOpen(false)}>
        
        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-[#080808] border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-3 bg-[#0a0a0a] border-b border-slate-800 flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Series Explorer</span>
            <Database size={12} className="text-slate-500" />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {STUDY_DATABASE.map((s) => (
              <div 
                key={s.id}
                onClick={() => { setActiveSeriesId(s.id); setSlice(1); }}
                className={`
                  relative p-3 border-b border-slate-800/50 cursor-pointer transition-all group
                  ${activeSeriesId === s.id ? 'bg-slate-900/80 border-l-2 border-l-blue-500' : 'hover:bg-slate-900/30 border-l-2 border-l-transparent'}
                `}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-bold ${activeSeriesId === s.id ? 'text-blue-400' : 'text-slate-300 group-hover:text-white'}`}>
                    {s.name}
                  </span>
                  {activeSeriesId === s.id && <Activity size={12} className="text-blue-500" />}
                </div>
                <div className="flex justify-between items-center mt-2">
                   <div className="text-[10px] text-slate-500 font-mono">SE: {s.id}</div>
                   <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">{s.count} IMG</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER VIEWPORT */}
        <main className="flex-1 flex flex-col bg-black relative">
          
          <div className="absolute top-4 left-4 z-10 pointer-events-none text-xs font-mono space-y-1 drop-shadow-md">
            <div className="text-blue-400 font-bold text-sm">Ex: 4892</div>
            <div className="text-slate-200">Se: {activeSeries.id}</div>
            <div className="text-slate-200">Im: {slice} / {activeSeries.count}</div>
            <div className="text-slate-400 mt-1">{activeSeries.description}</div>
          </div>

          <div className="absolute top-4 right-4 z-10 pointer-events-none text-xs font-mono text-right space-y-1 drop-shadow-md">
             <div className="text-white font-bold">{PATIENT.name}</div>
             <div className="text-slate-300">{PATIENT.id}</div>
             <div className="text-slate-400 mt-2">Acc: 993821</div>
             <div className="text-yellow-500 font-bold">FS: 1.5T</div>
          </div>

          <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-[11px] font-mono space-y-1 drop-shadow-md">
            <div className="text-slate-300">TR: <span className="text-white">{activeSeries.techParams.tr}</span></div>
            <div className="text-slate-300">TE: <span className="text-white">{activeSeries.techParams.te}</span></div>
            <div className="text-blue-400 mt-1">Zoom: {zoom}%</div>
          </div>

          <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-[11px] font-mono text-right space-y-1 drop-shadow-md">
             <div className="text-slate-300">WL: <span className="text-white">{Math.round(wwwl.l * 20)}</span></div>
             <div className="text-slate-300">WW: <span className="text-white">{Math.round(wwwl.w * 30)}</span></div>
             <div className="text-slate-500">Thk: {activeSeries.techParams.slice}mm</div>
          </div>

          <div className="absolute inset-4 pointer-events-none">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">A</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">P</span>
            <span className="absolute top-1/2 left-0 -translate-y-1/2 text-xs font-bold text-slate-500">R</span>
            <span className="absolute top-1/2 right-0 -translate-y-1/2 text-xs font-bold text-slate-500">L</span>
          </div>

          <div 
            className="flex-1 flex items-center justify-center overflow-hidden cursor-crosshair relative bg-black"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
             <div 
               className="relative transition-transform duration-200 ease-out"
               style={{ 
                 transform: `scale(${zoom / 100})`,
                 filter: `contrast(${wwwl.w + 40}%) brightness(${wwwl.l + 30}%) grayscale(100%)`
               }}
             >
                <img 
                  src={activeSeries.images[0]} 
                  className="max-h-[90vh] object-contain opacity-90"
                  alt="MRI Scan"
                  draggable="false"
                />
             </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-80 bg-[#080808] border-l border-slate-800 flex flex-col shrink-0">
           
           <div className="p-5 border-b border-slate-800">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                 <Settings size={10} /> Image Adjustments
              </h3>
              
              <div className="space-y-5">
                 <div className="group">
                    <div className="flex justify-between text-[11px] mb-2 text-slate-400"><span>Window Width</span><span className="font-mono text-white">{Math.round(wwwl.w)}</span></div>
                    <input type="range" className="w-full h-1 bg-slate-700 rounded-lg accent-blue-500 appearance-none cursor-pointer" value={wwwl.w} onChange={(e) => setWwwl({...wwwl, w: Number(e.target.value)})} />
                 </div>
                 <div className="group">
                    <div className="flex justify-between text-[11px] mb-2 text-slate-400"><span>Window Level</span><span className="font-mono text-white">{Math.round(wwwl.l)}</span></div>
                    <input type="range" className="w-full h-1 bg-slate-700 rounded-lg accent-blue-500 appearance-none cursor-pointer" value={wwwl.l} onChange={(e) => setWwwl({...wwwl, l: Number(e.target.value)})} />
                 </div>
                 <div className="group">
                    <div className="flex justify-between text-[11px] mb-2 text-slate-400"><span>Zoom Factor</span><span className="font-mono text-white">{zoom}%</span></div>
                    <input type="range" min="50" max="200" className="w-full h-1 bg-slate-700 rounded-lg accent-blue-500 appearance-none cursor-pointer" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
                 </div>
              </div>
           </div>

           <div className="flex-1 p-5 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DICOM Metadata</h3>
                 <MoreHorizontal size={14} className="text-slate-600 hover:text-white cursor-pointer"/>
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-[11px] border-t border-slate-800 pt-3">
                 <span className="text-slate-500">Patient ID</span>
                 <span className="text-slate-200 font-mono text-right">{PATIENT.id}</span>
                 <span className="text-slate-500">Modality</span>
                 <span className="text-slate-200 font-mono text-right">{activeSeries.modality}</span>
                 <span className="text-slate-500">Manufacturer</span>
                 <span className="text-slate-200 font-mono text-right">GE Medical</span>
                 <span className="text-slate-500">Matrix</span>
                 <span className="text-slate-200 font-mono text-right">{activeSeries.techParams.matrix}</span>
                 <span className="text-slate-500">FOV</span>
                 <span className="text-slate-200 font-mono text-right">{activeSeries.techParams.fov}</span>
                 <span className="text-slate-500">Slice Thick.</span>
                 <span className="text-slate-200 font-mono text-right">{activeSeries.techParams.slice}mm</span>
                 <span className="text-slate-500">Repetition (TR)</span>
                 <span className="text-slate-200 font-mono text-right">{activeSeries.techParams.tr} ms</span>
                 <span className="text-slate-500">Echo (TE)</span>
                 <span className="text-slate-200 font-mono text-right">{activeSeries.techParams.te} ms</span>
              </div>
           </div>

           <div className="p-4 bg-[#0a0a0a] border-t border-slate-800">
              <div className="bg-slate-900/50 p-3 rounded border border-slate-800/50">
                 <div className="flex items-center gap-2 mb-2 text-blue-400 text-[11px] font-bold uppercase tracking-wider">
                    <AlertCircle size={12} /> 
                    <span>AI Findings</span>
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed">
                   {activeSeriesId === 2 
                     ? "L4-L5: Mild diffuse disc bulge indenting the thecal sac. Neural foramina are patent."
                     : "No acute intracranial hemorrhage, mass effect, or territorial infarction."
                   }
                 </p>
              </div>
           </div>

        </aside>
      </div>
    </div>
  );
}