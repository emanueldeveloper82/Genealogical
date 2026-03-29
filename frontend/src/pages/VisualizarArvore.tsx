import { useEffect, useCallback, useRef, useState } from 'react';
import { ReactFlow, Background, Controls, Panel, useNodesState, useEdgesState, useReactFlow, useNodesInitialized } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';
import api from '../api/apiService';
import { GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { FileDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { NodeMenu } from './NodeMenu';


// Configurações do Layout
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const nodeWidth = 180;
    const nodeHeight = 60;

    dagreGraph.setGraph({ rankdir: 'TB', nodesep: 70, ranksep: 100 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });
};

//Funções de busca Ancestrais
const buscarAncestrais = (id: string, listaPessoas: any[]): Set<string> => {
    const ids = new Set<string>();
    const p = listaPessoas.find(x => String(x.id) === id);
    if (p?.pai_id) { ids.add(String(p.pai_id)); buscarAncestrais(String(p.pai_id), listaPessoas).forEach(i => ids.add(i)); }
    if (p?.mae_id) { ids.add(String(p.mae_id)); buscarAncestrais(String(p.mae_id), listaPessoas).forEach(i => ids.add(i)); }
    return ids;
};

//Funções de busca Descendentes
const buscarDescendentes = (id: string, listaPessoas: any[]): Set<string> => {
    const ids = new Set<string>();
    
    const filhos = listaPessoas.filter(p => 
        String(p.pai_id) === id || String(p.mae_id) === id
    );

    filhos.forEach(filho => {
        const filhoId = String(filho.id);
        ids.add(filhoId);
        const netos = buscarDescendentes(filhoId, listaPessoas);
        netos.forEach(netoId => ids.add(netoId));
    });

    return ids;
};

export const VisualizarArvore = () => {

    const [menu, setMenu] = useState<{ id: string, x: number, y: number } | null>(null);
    const [selectedNodeId] = useState<string | null>(null);
    const [listaCompleta, setListaCompleta] = useState([]);

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const navigate = useNavigate();
    const areaArvoreRef = useRef<HTMLDivElement>(null);

    const { setCenter } = useReactFlow();
    const nodesInitialized = useNodesInitialized();
    const location = useLocation();
    const targetId = location.state?.rootId;


    const carregarDados = useCallback(async (filtroIds?: Set<string>) => {
        try {

            const response = await api.get('/pessoas/');
            let dados = response.data;

            const res = await api.get('/pessoas/');
            const pessoas = res.data;

            setListaCompleta(pessoas);

            if (!pessoas || pessoas.length === 0) return;

            let dadosParaProcessar = pessoas;

            if (filtroIds && filtroIds.size > 0) {
                dadosParaProcessar = pessoas.filter((p: any) =>
                    filtroIds.has(String(p.id)) || String(p.id) === selectedNodeId
                );
            }

            const initialNodes: Node[] = dadosParaProcessar.map((p: any) => ({
                id: String(p.id),
                data: { label: p.nome },
                position: { x: 0, y: 0 },
                style: {
                    background: p.genero === 'M' ? '#1e3a8a' : '#831843',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '10px',
                    width: 180,
                },
            }));

            const initialEdges: Edge[] = [];

            pessoas.forEach((p: any) => {
                if (p.pai_id) {
                    initialEdges.push({
                        id: `e${p.pai_id}-${p.id}`,
                        source: String(p.pai_id),
                        target: String(p.id),
                        label: 'Pai',
                        animated: true,
                        style: { stroke: '#60a5fa' }
                    });
                }
                if (p.mae_id) {
                    initialEdges.push({
                        id: `e${p.mae_id}-${p.id}`,
                        source: String(p.mae_id),
                        target: String(p.id),
                        label: 'Mãe',
                        animated: true,
                        style: { stroke: '#f472b6' }
                    });
                }
            });

            const layouted = getLayoutedElements(initialNodes, initialEdges);
            setNodes(layouted);
            setEdges(initialEdges);
        } catch (error) {
            console.error("Erro ao carregar árvore:", error);
        }
    }, [selectedNodeId]);


    //Funcção para exportar para PDF
    const exportarPDF = async () => {
        if (!areaArvoreRef.current) return;

        try {
            // 1. Oculta controles para um PDF limpo
            const controles = document.querySelector('.react-flow__controls') as HTMLElement;
            if (controles) controles.style.display = 'none';

            // 2. Gera a imagem usando html-to-image (mais robusto com oklch)
            const dataUrl = await toPng(areaArvoreRef.current, {
                backgroundColor: '#020617',
                quality: 4,
                pixelRatio: 2.5, // Alta definição
                // Filtro para ignorar elementos que você não quer no print (opcional)
                filter: (node) => {
                    const exclusionClasses = ['react-flow__panel', 'react-flow__controls'];
                    return !exclusionClasses.some(cls => node.classList?.contains(cls));
                }
            });

            // 3. Monta o PDF
            const pdf = new jsPDF('l', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`arvore-genealogica-${new Date().getTime()}.pdf`);

            // 4. Devolve os controles à tela
            if (controles) controles.style.display = 'flex';
        } catch (error) {
            console.error("Erro ao gerar PDF com html-to-image:", error);
            alert("Houve um problema na geração. Tente usar um navegador baseado em Chromium.");
        }
    };

    useEffect(() => {
        carregarDados();


    }, [targetId]);

    useEffect(() => {
        if (nodesInitialized && targetId) {
            const node = nodes.find((n) => n.id === String(targetId));
            if (node) {
                const x = node.position.x + (node.measured?.width ?? 0) / 2;
                const y = node.position.y + (node.measured?.height ?? 0) / 2;

                // Faz o zoom suave até o nó selecionado
                setCenter(x, y, { zoom: 1.2, duration: 800 });
            }
        }
    }, [nodesInitialized, targetId, nodes, setCenter]);


    const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
        // Previne comportamento padrão e abre nosso menu na posição do clique
        event.preventDefault();
        setMenu({
            id: node.id,
            x: event.clientX,
            y: event.clientY,
        });
    }, []);


    // Função para disparar as ações
    const handleMenuAction = (type: string, nodeId: string) => {
        setMenu(null);
        if (type === 'editar') {
            navigate(`/editar/${nodeId}`);
        } else if (type === 'ascendentes') {
            const ids = buscarAncestrais(nodeId, listaCompleta);
            ids.add(nodeId);
            carregarDados(ids);
        } else if (type === 'descendentes') {
            const ids = buscarDescendentes(nodeId, listaCompleta);
            ids.add(nodeId); 
            carregarDados(ids);
        }
    };

    return (
        <div className="h-screen w-full bg-slate-950 flex flex-col">
            <div className="p-4 flex items-center gap-3 border-b border-slate-800">
                <GitBranch className="text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Linhagem Familiar</h2>
            </div>
            {/* Adicionamos a ref aqui e garantimos altura total */}
            <div className="flex-1 relative" ref={areaArvoreRef}>
                {nodes.length > 0 && (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={onNodeClick}
                        onPaneClick={() => setMenu(null)}
                        fitView
                    >
                        <Background color="#334155" />
                        <Controls />
                        {/* Adicionado flex e gap-2 para os botões não brigarem */}
                        <Panel position="top-right" className="flex gap-2 bg-slate-900/50 p-2 rounded-lg">
                            <button onClick={() => carregarDados()}>
                                Reorganizar
                            </button>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    exportarPDF();
                                }}
                                className="bg-emerald-600 p-2 rounded border border-emerald-500 text-white hover:bg-emerald-500 flex items-center gap-2 transition-colors shadow-lg"
                            >
                                <FileDown size={16} /> Exportar PDF
                            </button>
                        </Panel>
                    </ReactFlow>

                )}

                {menu && (
                    <NodeMenu
                        id={menu.id}
                        x={menu.x}
                        y={menu.y}
                        onClose={() => setMenu(null)}
                        onAction={handleMenuAction}
                    />
                )}
            </div>
        </div>
    );
};