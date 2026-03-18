from typing import Optional, List
from datetime import date
from pydantic import BaseModel, ConfigDict, field_validator


class PessoaBase(BaseModel):
    nome: str
    genero: str
    data_nascimento: Optional[date] = None
    
    @field_validator('data_nascimento')
    @classmethod
    def data_nao_pode_ser_futura(cls, v: Optional[date]):
        if v and v > date.today():
            raise ValueError('A data de nascimento não pode estar no futuro')
        return v


# DTO de inserção de uma Pessoa
class PessoaCreate(PessoaBase):
    pass

# DTO de atualização de uma Pessoa
class PessoaUpdate(PessoaBase):    
    nome: Optional[str] = None
    genero: Optional[str] = None
    data_nascimento: Optional[date] = None

# DTO de leitura de uma Pessoa
class PessoaRead(PessoaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

## DTO que representa a árvore de ancestralidade ascendente e recursivamente que contém objetos do seu próprio tipo dentro dele.
class ArvoreAncestral(PessoaRead):    
    pai: Optional["ArvoreAncestral"] = None
    mae: Optional["ArvoreAncestral"] = None
    model_config = ConfigDict(from_attributes=True)

## DTO que representa a árvore de ancestralidade descendente e recursivamente que contém objetos do seu próprio tipo dentro dele.
class ArvoreDescendente(PessoaRead):    
    filhos: List["ArvoreDescendente"] = []
    model_config = ConfigDict(from_attributes=True)