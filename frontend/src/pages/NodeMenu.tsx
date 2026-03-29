interface NodeMenuProps {
  id: string;
  x: number;
  y: number;
  onClose: () => void;
  onAction: (type: 'editar' | 'ascendentes' | 'descendentes', id: string) => void;
}

export const NodeMenu = ({ id, x, y, onClose, onAction }: any) => (
  <div 
    className="fixed z-[9999] bg-slate-900 border border-slate-700 rounded-md shadow-2xl p-1 w-48"
    style={{ top: y, left: x }}
  >
    <div className="text-[10px] text-slate-500 px-3 py-1 uppercase font-bold border-b border-slate-800 mb-1">
      Opções do Membro
    </div>
    <button onClick={() => onAction('editar', id)} className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-blue-600 rounded flex items-center gap-2 transition-colors">
      <span>✏️</span> Editar Cadastro
    </button>
    <button onClick={() => onAction('ascendentes', id)} className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-blue-600 rounded flex items-center gap-2 transition-colors">
      <span>⬆️</span> Ver Ascendentes
    </button>
    <button onClick={() => onAction('descendentes', id)} className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-blue-600 rounded flex items-center gap-2 transition-colors">
      <span>⬇️</span> Ver Descendentes
    </button>
  </div>
);