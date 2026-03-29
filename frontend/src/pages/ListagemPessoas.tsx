
import { useEffect, useState } from 'react';
import api from '../api/apiService';
import { Users, Pencil, Trash2, TreePine } from 'lucide-react';
import type { Pessoa } from '../types';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ModalConfirmacao } from '../components/ModalConfirmacao';

export const ListagemPessoas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pessoaSelecionada, setPessoaSelecionada] = useState<{ id: number, nome: string } | null>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPessoas();
  }, []);

  const fetchPessoas = async () => {
    try {
      const response = await api.get('/pessoas');
      setPessoas(response.data);
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleExcluirClick = (id: number, nome: string) => {
    setPessoaSelecionada({ id, nome });
    setIsModalOpen(true); 
  };
  const confirmarExclusao = async () => {
    if (!pessoaSelecionada) return;

    try {
      await api.delete(`/pessoas/${pessoaSelecionada.id}`);
      toast.success(`${pessoaSelecionada.nome} removido(a)!`);
      setPessoas(prev => prev.filter(p => p.id !== pessoaSelecionada.id));
    } catch (error) {
      toast.error('Erro ao excluir.');
    }
  };

  if (loading)
    return <div className="text-white text-center mt-10">Carregando familiares...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-emerald-400">
          <Users size={28} />
          <h2 className="text-2xl font-bold text-white">Membros da Família</h2>
        </div>
        <span className="text-slate-400 text-sm">{pessoas.length} cadastrados</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-300">
          <thead className="text-xs uppercase bg-slate-900 text-slate-400">
            <tr>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3 text-center">Gênero</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {pessoas.map((p) => (
              <tr key={p.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{p.nome}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${p.genero === 'M' ? 'bg-blue-900 text-blue-200' : 'bg-pink-900 text-pink-200'}`}>
                    {p.genero}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">

                    <Link
                      to="/arvore"
                      state={{ rootId: p.id }}
                      title="Ver Árvore Completa"
                      className="text-emerald-400 hover:text-emerald-300 transition-transform hover:scale-110">
                      <TreePine size={18} />
                    </Link>

                    <Link
                      to={`/editar/${p.id}`}
                      title={`Editar ${p.nome}`}
                      className="text-blue-400 hover:text-blue-300 transition-transform hover:scale-110"
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      onClick={() => handleExcluirClick(p.id, p.nome)}
                      title={`Excluir ${p.nome}`}
                      className="text-red-400 hover:text-red-300 transition-transform hover:scale-110"
                    >
                    </button>

                    <button
                      onClick={() => handleExcluirClick(p.id, p.nome)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalConfirmacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmarExclusao}
        nome={pessoaSelecionada?.nome || ''}
      />

    </div>
  );
};