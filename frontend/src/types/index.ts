export interface Pessoa {
  id: number;
  nome: string;
  genero: 'M' | 'F';
  data_nascimento?: string;
  pai_id?: number | null;
  mae_id?: number | null;
}

export interface PessoaCreate extends Omit<Pessoa, 'id'> {}