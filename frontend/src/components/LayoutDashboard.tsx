import { Link, Outlet } from 'react-router-dom';
import { Users, UserPlus, TreePine, LayoutDashboard as DashIcon } from 'lucide-react';

export const LayoutDashboard = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 space-y-8">
        <h1 className="text-xl font-black text-blue-400 tracking-wider">GENEALOGICAL</h1>
        
        <nav className="space-y-2">
          <Link to="/" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <DashIcon size={18} /> Dashboard
          </Link>
          <Link to="/listagem" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <Users size={18} /> Ver Família
          </Link>
          <Link to="/cadastro" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <UserPlus size={18} /> Novo Membro
          </Link>
          <Link to="/arvore" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <TreePine size={18} /> Visualizar Árvore
          </Link>
        </nav>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto">
        {}
        <Outlet />
      </main>
    </div>
  );
};