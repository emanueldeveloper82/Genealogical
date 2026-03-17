# 🌳 Genealogia API (v1.0.0)

API desenvolvida em **Python** com **FastAPI** e **SQLModel** para mapeamento de árvores genealógicas.

## 🚀 Tecnologias
- Python 3.12+
- FastAPI (Framework Web)
- SQLModel (ORM - SQLAlchemy + Pydantic)
- PostgreSQL (Banco de Dados)
- Uvicorn (Servidor ASGI)

## 🛠️ Como rodar o projeto
1. Criar ambiente virtual: `python -m venv myvenv`
2. Ativar ambiente: `.\myvenv\Scripts\activate`
3. Instalar dependências: `pip install -r requirements.txt`
4. Rodar aplicação: `uvicorn app.main:app --reload`

## 📖 Documentação Automática
Após rodar, acesse:
- Swagger UI: `http://127.0.0.1:8000/docs`
- Redoc: `http://127.0.0.1:8000/redoc`

## 🌲 Funcionalidades Atuais
- CRUD de Pessoas
- Relacionamento autorreferenciado (Pai/Mãe)
- Endpoint de Ancestralidade Recursiva