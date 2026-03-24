import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nome: string;
}

export const ModalConfirmacao = ({ isOpen, onClose, onConfirm, nome }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 text-red-400 mb-4">
          <AlertTriangle size={28} />
          <h3 className="text-xl font-bold text-white">Excluir Membro</h3>
        </div>
        
        <p className="text-slate-300 mb-6">
          Tem certeza que deseja remover <span className="font-bold text-white">{nome}</span>? 
          Esta ação não pode ser desfeita.
        </p>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
};