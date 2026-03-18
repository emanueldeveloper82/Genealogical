from typing import Optional, List
from datetime import date
from sqlmodel import Field, Relationship, SQLModel
from app.core.config import settings 

def get_fk_target():
    if not settings.DB_SCHEMA:
        return "pessoa.id"
    return f"{settings.DB_SCHEMA}.pessoa.id"

class Pessoa(SQLModel, table=True):
    __tablename__ = "pessoa"    
    __table_args__ = {"schema": settings.DB_SCHEMA} if settings.DB_SCHEMA else {}
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(index=True)
    genero: str = Field(max_length=1)
    data_nascimento: Optional[date] = Field(default=None)
            
    pai_id: Optional[int] = Field(default=None, foreign_key="genealogia_db.pessoa.id" if settings.DB_SCHEMA else "pessoa.id")
    mae_id: Optional[int] = Field(default=None, foreign_key="genealogia_db.pessoa.id" if settings.DB_SCHEMA else "pessoa.id")

    # Ancestrais (Subindo a árvore)
    pai: Optional["Pessoa"] = Relationship(
        sa_relationship_kwargs={
            "remote_side": "Pessoa.id", 
            "foreign_keys": "[Pessoa.pai_id]"
        }
    )
    mae: Optional["Pessoa"] = Relationship(
        sa_relationship_kwargs={
            "remote_side": "Pessoa.id", 
            "foreign_keys": "[Pessoa.mae_id]"
        }
    )

    # Descendentes (Descendo a árvore)        
    filhos: List["Pessoa"] = Relationship(
        sa_relationship_kwargs={
            "primaryjoin": "or_(Pessoa.id==Pessoa.pai_id, Pessoa.id==Pessoa.mae_id)",
            "viewonly": True
        }
    )