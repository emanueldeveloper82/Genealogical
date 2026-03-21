import { CadastroPessoa } from './pages/CadastroPessoa';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Genealogical System
        </h1>
      </header>
      
      <main>
        <CadastroPessoa />
      </main>
    </div>
  )
}

export default App;