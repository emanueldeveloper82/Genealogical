import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../api/apiService';
import { UserPlus, Save } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';


const pessoaSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    genero: z.enum(['M', 'F']),
    data_nascimento: z.string().optional().nullable().or(z.literal('')),
    pai_id: z.any().optional(),
    mae_id: z.any().optional(),
});

export const CadastroPessoa = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [listaPessoas, setListaPessoas] = useState<any[]>([]);
    const location = useLocation();

    const origin = location.state?.from || 'listagem';
    const returnPath = origin === 'arvore' ? '/arvore' : '/listagem';

    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({
        resolver: zodResolver(pessoaSchema) as any,
    });

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const resPessoas = await api.get('/pessoas/');
                setListaPessoas(resPessoas.data);

                if (id) {
                    const resEdicao = await api.get(`/pessoas/${id}`);
                    const d = resEdicao.data;
                    reset({
                        ...d,
                        data_nascimento: d.data_nascimento || "",
                        pai_id: d.pai_id ?? "",
                        mae_id: d.mae_id ?? ""
                    });
                }
            } catch (error) {
                toast.error("Erro ao sincronizar dados");
            }
        };
        carregarDados();
    }, [id, reset]);

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                pai_id: data.pai_id === "" || data.pai_id === null ? null : Number(data.pai_id),
                mae_id: data.mae_id === "" || data.mae_id === null ? null : Number(data.mae_id),
                data_nascimento: data.data_nascimento || null
            };

            if (isEdit) {
                await api.patch(`/pessoas/${id}`, payload);
                toast.success('Familiar atualizado! 💾');
            } else {
                await api.post('/pessoas', payload);
                toast.success('Familiar cadastrado! 🌳');
            }
            navigate(returnPath);
        } catch (error) {
            toast.error('Erro ao salvar no servidor.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
            <div className="flex items-center gap-2 mb-8 text-blue-400 border-b border-slate-700 pb-4">
                {isEdit ? <Save size={28} /> : <UserPlus size={28} />}
                <h2 className="text-3xl font-bold text-white">
                    {isEdit ? 'Editar Familiar' : 'Novo Familiar'}
                </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Nome */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
                    <input
                        {...register('nome')}
                        className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    {errors.nome && (
                        <span className="text-red-400 text-xs mt-1 block">
                            {String(errors.nome.message)}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gênero */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Gênero</label>
                        <select
                            {...register('genero')}
                            className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                        </select>
                    </div>

                    {/* Data Nascimento */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Data de Nascimento</label>
                        <input
                            type="date"
                            {...register('data_nascimento')}
                            className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <hr className="border-slate-700 my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pai */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Pai</label>
                        <select
                            {...register('pai_id')}
                            className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Nenhum / Desconhecido</option>
                            {listaPessoas
                                .filter(p => p.id !== Number(id) && p.genero === 'M')
                                .map(p => (
                                    <option key={p.id} value={p.id}>{p.nome}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Mãe */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Mãe</label>
                        <select
                            {...register('mae_id')}
                            className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Nenhuma / Desconhecida</option>
                            {listaPessoas
                                .filter(p => p.id !== Number(id) && p.genero === 'F')
                                .map(p => (
                                    <option key={p.id} value={p.id}>{p.nome}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(returnPath)}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={`flex-1 font-bold py-3 px-4 rounded transition-all text-white ${isEdit ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isEdit ? 'Salvar Alterações' : 'Cadastrar Familiar'}
                    </button>
                </div>
            </form>
        </div>
    );
};