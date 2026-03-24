import { useEffect, useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, Panel } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';
import api from '../api/apiService';
import { GitBranch, LayoutTemplate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const navigate = useNavigate(); 

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

    useEffect(() => { 
        carregarDados(); 
    }, [carregarDados]);

    const onNodeClick = (_: any, node: any) => {   
        navigate(`/editar/${node.id}`, { state: { from: 'arvore' } });
    };

    return (
        <div className="h-screen w-full bg-slate-950 flex flex-col">
            <div className="p-4 flex items-center gap-3 border-b border-slate-800">
                <GitBranch className="text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Linhagem Familiar (Modo Estruturado)</h2>
            </div>
            <div className="flex-1">
                {/* Garante que só renderiza se houver nós */}
                {nodes.length > 0 && (
                    <ReactFlow 
                        nodes={nodes} 
                        edges={edges} 
                        onNodeClick={onNodeClick}
                        fitView
                    >
                        <Background color="#334155" />
                        <Controls />
                        <Panel position="top-right">
                            <button
                                onClick={carregarDados}
                                className="bg-slate-800 p-2 rounded border border-slate-600 text-white hover:bg-slate-700 flex items-center gap-2"
                            >
                                <LayoutTemplate size={16} /> Reorganizar
                            </button>
                        </Panel>
                    </ReactFlow>
                )}
            </div>
        </div>
    );
};