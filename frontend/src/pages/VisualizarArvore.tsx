import { useEffect, useCallback, useRef } from 'react';
import { ReactFlow, Background, Controls, Panel, useNodesState, useEdgesState, useReactFlow, useNodesInitialized } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';
import api from '../api/apiService';
import { GitBranch, LayoutTemplate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { FileDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

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

export const VisualizarArvore = () => {
        
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const navigate = useNavigate();
    const areaArvoreRef = useRef<HTMLDivElement>(null);

    const { setCenter } = useReactFlow();
    const nodesInitialized = useNodesInitialized();
    const location = useLocation();
    const targetId = location.state?.rootId;


    const carregarDados = useCallback(async () => {
        try {
            const res = await api.get('/pessoas/');
            const pessoas = res.data;

            if (!pessoas || pessoas.length === 0) return;

            const initialNodes: Node[] = pessoas.map((p: any) => ({
                id: String(p.id),
                data: { label: p.nome },
                position: { x: 0, y: 0 },
                style: {
                    background: p.genero === 'M' ? '#1e3a8a' : '#831843',
                    color: '#fff',
                    border: `2px solid ${p.genero === 'M' ? '#3b82f6' : '#ec4899'}`,
                    borderRadius: '8px',
                    padding: '10px',
                    width: 180,
                    fontWeight: 'bold',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
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

            // Aplica o Dagre
            const layouted = getLayoutedElements(initialNodes, initialEdges);
            setNodes(layouted);
            setEdges(initialEdges);
        } catch (error) {
            console.error("Erro ao carregar árvore:", error);
        }
    }, []);


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

    const onNodeClick = (_: any, node: any) => {
        navigate(`/editar/${node.id}`, { state: { from: 'arvore' } });
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
                        fitView
                    >
                        <Background color="#334155" />
                        <Controls />
                        {/* Adicionado flex e gap-2 para os botões não brigarem */}
                        <Panel position="top-right" className="flex gap-2 bg-slate-900/50 p-2 rounded-lg">
                            <button
                                onClick={carregarDados}
                                className="bg-slate-800 p-2 rounded border border-slate-600 text-white hover:bg-slate-700 flex items-center gap-2"
                            >
                                <LayoutTemplate size={16} /> Reorganizar
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
            </div>
        </div>
    );
};