import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ListagemPessoas } from './pages/ListagemPessoas';
import { CadastroPessoa } from './pages/CadastroPessoa';
import { LayoutDashboard } from './components/LayoutDashboard'
import { Toaster } from 'react-hot-toast';
import { VisualizarArvore } from './pages/VisualizarArvore';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />    
      <Routes>
        {/* Usamos um Layout Pai para manter a Sidebar fixa em todas as telas */}
        <Route path="/" element={<LayoutDashboard />}>
          
          {/* Rota Inicial (Index) */}
          <Route index element={
            <div className="text-white p-10">
              <h2 className="text-3xl font-bold">Bem-vindo, Emanuel!</h2>
              <p className="text-slate-400 mt-2">Selecione uma opção no menu lateral para começar.</p>
            </div>
          } />

          {/* Rotas do CRUD */}
          <Route path="listagem" element={<ListagemPessoas />} />
          <Route path="cadastro" element={<CadastroPessoa />} />
          <Route path="editar/:id" element={<CadastroPessoa />} />
          <Route path="/arvore" element={<VisualizarArvore />} />
          
          {/* Futura rota da Árvore */}
          <Route path="arvore" element={<div className="text-white p-10">Em breve: Visualização Gráfica</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;