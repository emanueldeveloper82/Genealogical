from typing import Optional, List
from sqlmodel import Field, Relationship, SQLModel
from app.core.config import settings 


class Pessoa(SQLModel, table=True):
    # Define o schema do banco de dados
    __table_args__ = {"schema": settings.DB_SCHEMA}
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(index=True)
    genero: str = Field(max_length=1)
    
    pai_id: Optional[int] = Field(default=None, foreign_key=f"{settings.DB_SCHEMA}.pessoa.id")
    mae_id: Optional[int] = Field(default=None, foreign_key=f"{settings.DB_SCHEMA}.pessoa.id")

    filhos: List["Pessoa"] = Relationship(
        sa_relationship_kwargs={
            "primaryjoin": f"or_(Pessoa.id==Pessoa.pai_id, Pessoa.id==Pessoa.mae_id)",
            "viewonly": True, # Apenas para leitura
        }
    )

    # Relacionamentos para navegação orientada a objetos
    # Usamos back_populates para que o Python saiba quem é o "lado inverso"
    pai: Optional["Pessoa"] = Relationship(
        sa_relationship_kwargs={
            "remote_side": "Pessoa.id",
            "foreign_keys": "[Pessoa.pai_id]", 
        }
    )
    
    mae: Optional["Pessoa"] = Relationship(
        sa_relationship_kwargs={
            "remote_side": "Pessoa.id",
            "foreign_keys": "[Pessoa.mae_id]",
        }
    )

    @property
    def todos_filhos(self) -> List["Pessoa"]:
        """Helper para unir filhos de ambos os lados (pai/mãe)"""
        return (getattr(self, "filhos_do_pai", []) or []) + (getattr(self, "filhos_da_mae", []) or [])