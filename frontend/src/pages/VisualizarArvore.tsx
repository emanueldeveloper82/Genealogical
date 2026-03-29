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
const dagreGraph = new dagre.graphlib.Graph({ compound: true });
dagreGraph.setDefaultEdgeLabel(() => ({}));

const isConjuge = (p1Id: string, p2Id: string, lista: any[]) => {
    // Exemplo: se ambos são pais do mesmo filho na lista
    const temFilhoEmComum = lista.some(p =>
        (String(p.pai_id) === p1Id && String(p.mae_id) === p2Id) ||
        (String(p.pai_id) === p2Id && String(p.mae_id) === p1Id)
    );
    return temFilhoEmComum;
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], listaCompleta: any[]) => {
    const nodeWidth = 180;
    const nodeHeight = 60;

    // 1. Configurar o Grafo para aceitar subgrafos (Compound)
    dagreGraph.setGraph({
        rankdir: 'TB',
        nodesep: 40,   
        ranksep: 150,  
        edgesep: 10,
        marginx: 50,
        marginy: 50
    });

    // 2. Mapear clusters primeiro
    const clustersCriados = new Set<string>();

    nodes.forEach((node) => {
        const pessoa = listaCompleta.find(p => String(p.id) === node.id);

        // Se a pessoa tem pais, ela pertence a um cluster familiar
        if (pessoa?.pai_id && pessoa?.mae_id) {
            const clusterId = `cluster-${pessoa.pai_id}-${pessoa.mae_id}`;
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
            dagreGraph.setParent(node.id, clusterId);
        } else {
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        }
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    // 3. Gerar os nós finais incluindo os "Group Nodes" para as bordas
    const layoutedNodes: Node[] = [];

    // Adicionar os retângulos de borda (Clusters)
    clustersCriados.forEach(clusterId => {
        const clusterPos = dagreGraph.node(clusterId);
        layoutedNodes.push({
            id: clusterId,
            data: { label: '' },
            position: { x: clusterPos.x - 225, y: clusterPos.y - 125 },
            style: {
                width: 450,
                height: 250,
                backgroundColor: 'rgba(16, 185, 129, 0.05)', // Verde suave
                border: '2px dashed #10b981', // Borda tracejada esmeralda
                borderRadius: '12px',
                zIndex: -1,
            },
            selectable: false,
            draggable: false,
        });
    });

    // Adicionar as pessoas (Nodes)
    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        layoutedNodes.push({
            ...node,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        });
    });

    return layoutedNodes;
};

//Funções de busca Ancestrais
const buscarAncestrais = (id: string, listaPessoas: any[]): Set<string> => {
    const ids = new Set<string>();
    const p = listaPessoas.find(x => String(x.id) === id);
    if (!p) return ids;

    if (p.pai_id) {
        ids.add(String(p.pai_id));
        buscarAncestrais(String(p.pai_id), listaPessoas).forEach(i => ids.add(i));
    }
    if (p.mae_id) {
        ids.add(String(p.mae_id));
        buscarAncestrais(String(p.mae_id), listaPessoas).forEach(i => ids.add(i));
    }
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
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
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
            const res = await api.get('/pessoas/');
            const pessoas = res.data;

            setListaCompleta(pessoas);

            if (!pessoas || pessoas.length === 0) return;

            let dadosParaProcessar = pessoas;

            if (filtroIds && filtroIds.size > 0) {
                dadosParaProcessar = pessoas.filter((p: any) =>
                    filtroIds.has(String(p.id))
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

            const layouted = getLayoutedElements(initialNodes, initialEdges, pessoas);
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
        setSelectedNodeId(nodeId);

        if (type === 'editar') {
            navigate(`/editar/${nodeId}`, { state: { from: 'arvore' } });
            return;
        }

        let idsParaExibir = new Set<string>();
        idsParaExibir.add(nodeId);

        if (type === 'ascendentes') {
            const ancestrais = buscarAncestrais(nodeId, listaCompleta);
            ancestrais.forEach(id => idsParaExibir.add(id));
        } else if (type === 'descendentes') {
            const descendentes = buscarDescendentes(nodeId, listaCompleta);
            descendentes.forEach(id => idsParaExibir.add(id));
        }

        carregarDados(idsParaExibir);

        setTimeout(() => {
            const node = nodes.find((n) => n.id === nodeId);
            if (node) {
                const x = node.position.x + (node.measured?.width ?? 180) / 2;
                const y = node.position.y + (node.measured?.height ?? 60) / 2;
                setCenter(x, y, { zoom: 1.2, duration: 800 });
            }
        }, 300);
    };

    return (
        <div className="h-screen w-full bg-slate-950 flex flex-col">
            <div className="p-4 flex items-center gap-3 border-b border-slate-800">
                <GitBranch className="text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Linhagem Familiar</h2>
            </div>
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