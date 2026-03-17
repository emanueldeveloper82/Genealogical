from app.core.database import create_db_and_tables
from fastapi import FastAPI
from app.api.endpoints.pessoa_endpoint import router as pessoa_router

app = FastAPI(title="Genealogia API")

########## ROTAS ###########

app.include_router(pessoa_router, prefix="/pessoas", tags=["Pessoas"])

##############################

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/health")
def health_check():
    return {"status": "online"}