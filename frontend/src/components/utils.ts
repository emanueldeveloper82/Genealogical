// Busca todos os IDs de pais e mães recursivamente
export const buscarAncestrais = (id: string, todasPessoas: any[]): Set<string> => {
  const ancestrais = new Set<string>();
  const pessoa = todasPessoas.find(p => String(p.id) === id);

  if (pessoa) {
    if (pessoa.pai_id) {
      ancestrais.add(String(pessoa.pai_id));
      buscarAncestrais(String(pessoa.pai_id), todasPessoas).forEach(id => ancestrais.add(id));
    }
    if (pessoa.mae_id) {
      ancestrais.add(String(pessoa.mae_id));
      buscarAncestrais(String(pessoa.mae_id), todasPessoas).forEach(id => ancestrais.add(id));
    }
  }
  return ancestrais;
};

// Busca todos os IDs de filhos recursivamente
export const buscarDescendentes = (id: string, todasPessoas: any[]): Set<string> => {
  const descendentes = new Set<string>();
  const filhos = todasPessoas.filter(p => String(p.pai_id) === id || String(p.mae_id) === id);

  filhos.forEach(filho => {
    descendentes.add(String(filho.id));
    buscarDescendentes(String(filho.id), todasPessoas).forEach(id => descendentes.add(id));
  });
  return descendentes;
};