from contextlib import asynccontextmanager
from app.api.endpoints import pessoa_endpoint
from app.core.database import create_db_and_tables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup: Executa quando o servidor sobe ---
    # Criar as tabelas se não existirem
    create_db_and_tables()
    yield
    # --- Shutdown: Executa quando o servidor desliga ---
    print("Desligando o sistema de Genealogia...")

app = FastAPI(
    title="Genealogical API",
    lifespan=lifespan 
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # URL do seu front Vite
    allow_credentials=True,
    allow_methods=["*"], # Permite GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],
)

# Incluindo as rotas
app.include_router(pessoa_endpoint.router, prefix="/pessoas")

@app.get("/")
def read_root():
    return {"message": "Bem-vindo ao Sistema de Genealogia!"}