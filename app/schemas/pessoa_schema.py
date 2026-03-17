from typing import Optional, List
from pydantic import BaseModel

# DTO de inserção de uma Pessoa
class PessoaCreate(BaseModel):
    nome: str
    genero: str 
    pai_id: Optional[int] = None
    mae_id: Optional[int] = None

# DTO de atualização de uma Pessoa
class PessoaUpdate(BaseModel):
    nome: Optional[str] = None
    genero: Optional[str] = None
    pai_id: Optional[int] = None
    mae_id: Optional[int] = None

# DTO de leitura de uma Pessoa
class PessoaRead(BaseModel):
    id: int
    nome: str
    genero: Optional[str] = None
    pai_id: Optional[int]
    mae_id: Optional[int]

    class Config:
        from_attributes = True


## DTO que representa a árvore de ancestralidade ascendente e recursivamente que contém objetos do seu próprio tipo dentro dele.
class ArvoreAncestral(BaseModel):
    id: int
    nome: str
    genero: str    
    pai: Optional["ArvoreAncestral"] = None
    mae: Optional["ArvoreAncestral"] = None

    class Config:
        from_attributes = True

## DTO que representa a árvore de ancestralidade descendente e recursivamente que contém objetos do seu próprio tipo dentro dele.
class ArvoreDescendente(BaseModel):
    id: int
    nome: str
    genero: str
    filhos: List["ArvoreDescendente"] = []

    class Config:
        from_attributes = True