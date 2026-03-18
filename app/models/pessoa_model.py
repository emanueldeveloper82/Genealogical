from typing import Optional, List
from datetime import date
from sqlmodel import Field, Relationship, SQLModel
from app.core.config import settings 


class Pessoa(SQLModel, table=True):
    # Define o schema do banco de dados
    # __table_args__ = {"schema": settings.DB_SCHEMA}
    __tablename__ = "pessoa"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(index=True)
    genero: str = Field(max_length=1)
    data_nascimento: Optional[date] = Field(default=None)
    
    # FKs
    pai_id: Optional[int] = Field(default=None, foreign_key="pessoa.id")
    mae_id: Optional[int] = Field(default=None, foreign_key="pessoa.id")
           
    # Relacionamento para subir (Ancestrais)
    pai: Optional["Pessoa"] = Relationship(
        sa_relationship_kwargs={"remote_side": "Pessoa.id", "foreign_keys": "[Pessoa.pai_id]"}
    )
    mae: Optional["Pessoa"] = Relationship(
        sa_relationship_kwargs={"remote_side": "Pessoa.id", "foreign_keys": "[Pessoa.mae_id]"}
    )

    # Relacionamento para descer (Descendentes)    
    filhos: List["Pessoa"] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[Pessoa.pai_id]", "overlaps": "pai"}
    )

    @property
    def todos_filhos(self) -> List["Pessoa"]:
        """Helper para unir filhos de ambos os lados (pai/mãe)"""
        return (getattr(self, "filhos_do_pai", []) or []) + (getattr(self, "filhos_da_mae", []) or [])