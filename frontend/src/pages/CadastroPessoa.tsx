import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../api/apiService';
import { UserPlus } from 'lucide-react';

// 1. Definição do Schema de Validação (Igual ao seu Pydantic no Back)
const pessoaSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  genero: z.enum(['M', 'F']),
  data_nascimento: z.string().optional().or(z.literal('')),
  pai_id: z.number().nullable().optional(),
  mae_id: z.number().nullable().optional(),
});

type PessoaFormData = z.infer<typeof pessoaSchema>;

export const CadastroPessoa = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PessoaFormData>({
    resolver: zodResolver(pessoaSchema),
    defaultValues: { genero: 'M' }
  });

  const onSubmit = async (data: PessoaFormData) => {
    try {
      // Ajuste para enviar null se o ID estiver vazio (caso seu back espere Int ou None)
      const payload = {
        ...data,
        pai_id: data.pai_id || null,
        mae_id: data.mae_id || null,
        data_nascimento: data.data_nascimento || null
      };

      await api.post('/pessoas', payload);
      alert('Familiar cadastrado com sucesso!');
      reset(); // Limpa o formulário
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert('Erro ao conectar com o servidor. Verifique o console.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
      <div className="flex items-center gap-2 mb-6 text-blue-400">
        <UserPlus size={24} />
        <h2 className="text-2xl font-bold text-white">Novo Familiar</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-slate-300">Nome Completo</label>
          <input
            {...register('nome')}
            className="w-full mt-1 p-2 bg-slate-900 border border-slate-600 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.nome && <span className="text-red-400 text-xs">{errors.nome.message}</span>}
        </div>

        {/* Gênero */}
        <div>
          <label className="block text-sm font-medium text-slate-300">Gênero</label>
          <select
            {...register('genero')}
            className="w-full mt-1 p-2 bg-slate-900 border border-slate-600 rounded text-white outline-none"
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        {/* Data Nascimento */}
        <div>
          <label className="block text-sm font-medium text-slate-300">Data de Nascimento</label>
          <input
            type="date"
            {...register('data_nascimento')}
            className="w-full mt-1 p-2 bg-slate-900 border border-slate-600 rounded text-white outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 mt-4"
        >
          Cadastrar Familiar
        </button>
      </form>
    </div>
  );
};