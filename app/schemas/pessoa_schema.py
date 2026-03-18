from typing import Optional, List
from datetime import date
from pydantic import BaseModel, field_validator

# DTO de inserção de uma Pessoa
class PessoaCreate(BaseModel):
    nome: str
    genero: str 
    data_nascimento: Optional[date] = None
    pai_id: Optional[int] = None
    mae_id: Optional[int] = None

    @field_validator('data_nascimento')
    @classmethod
    def data_nao_pode_ser_futura(cls, v: date):
        if v and v > date.today():
            raise ValueError('A data de nascimento não pode estar no futuro')
        return v

# DTO de atualização de uma Pessoa
class PessoaUpdate(BaseModel):
    nome: Optional[str] = None
    genero: Optional[str] = None
    data_nascimento: Optional[date] = None
    pai_id: Optional[int] = None
    mae_id: Optional[int] = None

# DTO de leitura de uma Pessoa
class PessoaRead(BaseModel):
    id: int
    nome: str
    genero: Optional[str]
    data_nascimento: Optional[date]
    pai_id: Optional[int]
    mae_id: Optional[int]

    class Config:
        from_attributes = True


## DTO que representa a árvore de ancestralidade ascendente e recursivamente que contém objetos do seu próprio tipo dentro dele.
class ArvoreAncestral(BaseModel):
    id: int
    nome: str
    genero: str
    data_nascimento: Optional[date]    
    pai: Optional["ArvoreAncestral"]
    mae: Optional["ArvoreAncestral"]

    class Config:
        from_attributes = True

## DTO que representa a árvore de ancestralidade descendente e recursivamente que contém objetos do seu próprio tipo dentro dele.
class ArvoreDescendente(BaseModel):
    id: int
    nome: str
    genero: str
    data_nascimento: Optional[date]
    filhos: List["ArvoreDescendente"] = []

    class Config:
        from_attributes = True