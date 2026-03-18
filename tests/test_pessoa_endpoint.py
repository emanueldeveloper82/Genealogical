import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from datetime import date
from app.main import app  
from app.core.database import get_session
from app.models.pessoa_model import Pessoa

# --- CONFIGURAÇÃO DO BANCO DE TESTES (In-Memory) ---
# Criamos um banco SQLite em memória para não sujar seu banco de dev
@pytest.fixture(name="session")
def session_fixture():
    # Adicionamos o execution_options para ignorar schemas no SQLite
    engine = create_engine(
        "sqlite://", 
        connect_args={"check_same_thread": False}, 
        poolclass=StaticPool,
        
        execution_options={"schema_translate_map": {"genealogia_db": None}}
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

# Sobrescrevemos a dependência de sessão do FastAPI para usar o banco de teste
@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session
    
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

# --- OS TESTES ---

def test_criar_pessoa(client: TestClient):
    # Arrange (Preparar)
    payload = {
        "nome": "Emanuel Teste",
        "data_nascimento": "1990-05-20",
        "genero": "M"
    }

    # Act (Agir)
    response = client.post("/pessoas/", json=payload)

    # Assert (Afirmar)
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "Emanuel Teste"
    assert "id" in data

def test_listar_aniversariantes_do_mes(client: TestClient, session: Session):
    # Arrange: Criar alguém que faz aniversário HOJE
    from datetime import date
    hoje = date.today()
    
    p1 = Pessoa(nome="Aniversariante", data_nascimento=hoje, genero="M")
    session.add(p1)
    session.commit()

    # Act
    response = client.get("/pessoas/aniversariantes/mes")

    # Assert
    assert response.status_code == 200
    lista = response.json()
    assert len(lista) > 0
    assert lista[0]["nome"] == "Aniversariante"

def test_obter_arvore_ancestral_completa(client: TestClient, session: Session):
    # --- ARRANGE (Preparar a linhagem) ---
    
    # 1. Criar o Avô
    avo = Pessoa(
        nome="João (Avô)", 
        genero="M", 
        data_nascimento=date(1950, 1, 1)
    )

    session.add(avo)
    session.commit()
    session.refresh(avo)

    # 2. Criar o Pai (Filho do João)
    pai = Pessoa(
        nome="Carlos (Pai)", 
        genero="M", 
        data_nascimento=date(1975, 5, 10), 
        pai_id=avo.id
    )
    session.add(pai)
    session.commit()
    session.refresh(pai)

    # 3. Criar o Filho (Neto do João)
    filho = Pessoa(
        nome="Emanuel (Filho)", 
        genero="M", 
        data_nascimento=date(2000, 10, 20),
        pai_id=pai.id
    )
    session.add(filho)
    session.commit()
    session.refresh(filho)

    # --- ACT (Agir) ---
    # Buscamos os ancestrais a partir do neto (filho)
    response = client.get(f"/pessoas/{filho.id}/ancestrais")

    # --- ASSERT (Validar) ---
    assert response.status_code == 200
    data = response.json()

    # Validando a estrutura recursiva
    assert data["nome"] == "Emanuel (Filho)"
    assert data["pai"]["nome"] == "Carlos (Pai)"
    assert data["pai"]["pai"]["nome"] == "João (Avô)"
    assert data["pai"]["pai"]["pai"] is None 



def test_obter_descendentes_recursivos(client: TestClient, session: Session):
    # Arrange
    avo = Pessoa(nome="Avo", genero="M", data_nascimento=date(1940,1,1))
    session.add(avo)
    session.commit()
    
    pai = Pessoa(nome="Pai", genero="M", data_nascimento=date(1970,1,1), pai_id=avo.id)
    session.add(pai)
    session.commit()
    
    # Act
    response = client.get(f"/pessoas/{avo.id}/descendentes")
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "Avo"
    assert data["filhos"][0]["nome"] == "Pai"


def test_obter_ancestrais_id_inexistente(client: TestClient):
    # Isso vai forçar o código a entrar no "if not pessoa"
    response = client.get("/pessoas/9999/ancestrais")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Pessoa não encontrada"



# Teste de aniversariantes (Adicionando o /mes)
def test_listar_aniversariantes_vazio(client: TestClient, session: Session):
    mes_atual = date.today().month
    mes_diferente = 1 if mes_atual == 12 else mes_atual + 1

    p = Pessoa(nome="Fora do Mes", genero="F", data_nascimento=date(1990, mes_diferente, 1))
    session.add(p)
    session.commit()
    
    response = client.get("/pessoas/aniversariantes/mes") 
    assert response.status_code == 200
    assert len(response.json()) == 0

# Teste para atualizar uma pessoa
def test_atualizar_pessoa_sucesso(client: TestClient, session: Session):
    # Criar uma pessoa inicial
    pessoa = Pessoa(nome="Nome Antigo", genero="M", data_nascimento=date(1980, 1, 1))
    session.add(pessoa)
    session.commit()
    session.refresh(pessoa)

    # Payload de atualização
    payload = {"nome": "Nome Novo"}
    
    response = client.patch(f"/pessoas/{pessoa.id}", json=payload)
    
    assert response.status_code == 200
    assert response.json()["nome"] == "Nome Novo"

def test_obter_descendentes_inexistente(client: TestClient):
    response = client.get("/pessoas/999999/descendentes")
    assert response.status_code == 404    

def test_atualizar_pessoa_inexistente(client: TestClient):
    # Tentando dar um PATCH em um ID fantasma
    payload = {"nome": "Ninguém"}
    response = client.patch("/pessoas/999999", json=payload)
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Pessoa não encontrada"