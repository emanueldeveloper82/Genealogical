import os
from urllib.parse import quote_plus
from sqlmodel import create_engine, Session, SQLModel, text
from app.core.config import settings
from dotenv import load_dotenv



load_dotenv()

## database_url = os.getenv("DATABASE_URL")

user = "emanuel"
password = quote_plus("Emanuel12#") 
host = "localhost"
port = "5432"
database = "arvore"

database_url = f"postgresql://{user}:{password}@{host}:{port}/{database}"



# O engine é o gerenciador de conexões
engine = create_engine(database_url, echo=True) # echo=True loga o SQL no console

def get_session():
    """Generator para prover sessões do banco para as rotas da API"""
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    with Session(engine) as session:        
        # Garante que o schema existe antes de criar as tabelas
        session.execute(text(f"CREATE SCHEMA IF NOT EXISTS {settings.DB_SCHEMA}"))
        session.commit()    
    SQLModel.metadata.create_all(engine)