import React, { useEffect, useState } from 'react';
import api from '../api/apiService';
import { Users, Pencil, Trash2, TreePine } from 'lucide-react';
import type { Pessoa } from '../types';

export const ListagemPessoas = () => {
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

  if (loading) return <div className="text-white text-center mt-10">Carregando familiares...</div>;

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
                    <button title="Ver Árvore" className="text-emerald-400 hover:text-emerald-300">
                      <TreePine size={18} />
                    </button>
                    <button title="Editar" className="text-blue-400 hover:text-blue-300">
                      <Pencil size={18} />
                    </button>
                    <button title="Excluir" className="text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};