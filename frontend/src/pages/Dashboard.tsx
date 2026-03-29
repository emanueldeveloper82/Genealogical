import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiService';
import { Search, TreePine, Users } from 'lucide-react';

export const Dashboard = () => {
    const [options, setOptions] = useState([]);
    const [selectedPessoa, setSelectedPessoa] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/pessoas/').then(res => {
            const map = res.data.map((p: any) => ({ 
                value: p.id, 
                label: p.nome 
            }));
            setOptions(map);
        });
    }, []);

    // Estilização Dark Mode para o Select (Slate-800/900)
    const customStyles = {
        control: (base: any) => ({
            ...base,
            background: '#0f172a', // slate-950
            borderColor: '#334155', // slate-700
            color: 'white',
            padding: '5px'
        }),
        menu: (base: any) => ({
            ...base,
            background: '#1e293b', // slate-800
            border: '1px solid #334155'
        }),
        option: (base: any, state: any) => ({
            ...base,
            background: state.isFocused ? '#334155' : 'transparent',
            color: 'white',
            cursor: 'pointer'
        }),
        singleValue: (base: any) => ({ ...base, color: 'white' }),
        input: (base: any) => ({ ...base, color: 'white' }),
    };

    return (
        <div className="max-w-4xl mx-auto mt-16 p-10 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">
                    BEM-VINDO AO <span className="text-blue-500">GENEALOGICAL</span>
                </h1>
                <p className="text-slate-400">Explore sua linhagem e conecte sua história.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card de Busca */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Search size={20} className="text-blue-400" /> Localizar Familiar
                    </h3>
                    <Select 
                        options={options} 
                        styles={customStyles}
                        onChange={(opt) => setSelectedPessoa(opt)}
                        placeholder="Digite um nome..."
                        noOptionsMessage={() => "Nenhum familiar encontrado"}
                    />
                    <button
                        disabled={!selectedPessoa}
                        onClick={() => navigate('/arvore', { state: { rootId: selectedPessoa.value } })}
                        className={`w-full mt-4 p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                            selectedPessoa 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                        <TreePine size={18} /> Ver Árvore de {selectedPessoa?.label.split(' ')[0]}
                    </button>
                </div>

                {/* Card de Atalhos Rápidos */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between">
                    <div>
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Users size={20} className="text-emerald-400" /> Atalhos
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">Gerencie sua base de dados ou visualize a árvore completa.</p>
                    </div>
                    <div className="space-y-3">
                        <button 
                            onClick={() => navigate('/listagem')}
                            className="w-full p-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors text-sm"
                        >
                            Lista de Membros
                        </button>
                        <button 
                            onClick={() => navigate('/arvore')}
                            className="w-full p-2 border border-slate-600 hover:bg-slate-700 text-white rounded transition-colors text-sm"
                        >
                            Ver Árvore Completa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};