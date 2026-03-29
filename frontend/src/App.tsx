
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ListagemPessoas } from './pages/ListagemPessoas';
import { CadastroPessoa } from './pages/CadastroPessoa';
import { LayoutDashboard } from './components/LayoutDashboard'
import { Toaster } from 'react-hot-toast';
import { VisualizarArvore } from './pages/VisualizarArvore';
import { Dashboard } from './pages/Dashboard';
import { ReactFlowProvider } from '@xyflow/react';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />    
      <Routes>
        <Route path="/" element={<LayoutDashboard />}>
          
          {/* Agora o Dashboard é a sua tela inicial real */}
          <Route index element={<Dashboard />} />

          {/* Rotas do CRUD */}
          <Route path="listagem" element={<ListagemPessoas />} />
          <Route path="cadastro" element={<CadastroPessoa />} />
          <Route path="editar/:id" element={<CadastroPessoa />} />
          
          {/* Rota da Árvore (Removido a duplicidade) */}
          <Route path="arvore" element={
            <ReactFlowProvider>
              <VisualizarArvore />
            </ReactFlowProvider>
          } />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;