from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from sqlalchemy import extract
from fastapi.responses import PlainTextResponse
from datetime import date
from app.core.database import get_session
from app.models.pessoa_model import Pessoa
from app.schemas.pessoa_schema import PessoaCreate, PessoaUpdate, PessoaRead, ArvoreAncestral, ArvoreDescendente 


router = APIRouter()

@router.post("/", response_model=PessoaRead, tags=["Pessoas"])
def criar_pessoa(pessoa_in: PessoaCreate, session: Session = Depends(get_session)):
    # Convertendo DTO para Model do Banco
    nova_pessoa = Pessoa.model_validate(pessoa_in)
    
    session.add(nova_pessoa)
    session.commit()
    session.refresh(nova_pessoa)
    
    return nova_pessoa


@router.patch("/{pessoa_id}", response_model=PessoaUpdate, tags=["Pessoas"])
def atualizar_pessoa(
    pessoa_id: int, 
    pessoa_in: PessoaUpdate, 
    session: Session = Depends(get_session)
):
    db_pessoa = session.get(Pessoa, pessoa_id)
    if not db_pessoa:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada")
        
    update_data = pessoa_in.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_pessoa, key, value)
    
    session.add(db_pessoa)
    session.commit()    
    session.refresh(db_pessoa)     
    return db_pessoa

@router.get("/{pessoa_id}/ancestrais", response_model=ArvoreAncestral, tags=["Pessoas"])
def obter_ancestrais(pessoa_id: int, session: Session = Depends(get_session)):
    """
    Retorna a árvore genealógica ascendente (pais, avós, etc.) 
    a partir de uma pessoa específica.
    """
    # Buscamos a pessoa pelo ID
    pessoa = session.get(Pessoa, pessoa_id)
    
    if not pessoa:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada")
    
    # Ao retornar o objeto 'pessoa', o Pydantic fará a validação recursiva
    # seguindo os relacionamentos 'pai' e 'mae' configurados no Model.
    return pessoa


@router.get("/{pessoa_id}/descendentes", response_model=ArvoreDescendente, tags=["Pessoas"])
def obter_descendentes(pessoa_id: int, session: Session = Depends(get_session)):
    """Retorna a árvore de descendentes (filhos, netos, etc.)"""
    pessoa = session.get(Pessoa, pessoa_id)
    if not pessoa:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada")
    return pessoa

# Listar todos
@router.get("/", response_model=list[PessoaRead], tags=["Pessoas"])
def listar_pessoas(session: Session = Depends(get_session)):    
    statement = select(Pessoa)
    return session.exec(statement).all()

# Listar aniversariantes do mês
@router.get("/aniversariantes/mes", response_model=list[PessoaRead], tags=["Pessoas"])
def listar_aniversariantes(session: Session = Depends(get_session)):    
    mes_atual = date.today().month    
    statement = (
        select(Pessoa)
        .where(extract('month', Pessoa.data_nascimento) == mes_atual)
        .order_by(extract('day', Pessoa.data_nascimento))
    )
    results = session.exec(statement).all()
    return results


@router.get("/{pessoa_id}/grafico", response_class=PlainTextResponse, tags=["Visualização"])
def gerar_grafico_dot(pessoa_id: int, session: Session = Depends(get_session)):
    """
    Gera uma representação da árvore genealógica no formato DOT (Graphviz).
    Este formato pode ser consumido por ferramentas de visualização no Front-end.
    """
    # Buscamos a pessoa foco
    pessoa_foco = session.get(Pessoa, pessoa_id)
    if not pessoa_foco:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada")

    # Cabeçalho do arquivo DOT
    dot_content = [
        "digraph Familia {",        
        '  node [shape=box, style=filled, fontname="Arial", fontsize=10];',
        '  edge [fontsize=8];'
    ]
    
    visitados = set()

    def r_gerar_dot(p_id: int):
        if p_id in visitados:
            return
        visitados.add(p_id)

        # Buscamos os dados da pessoa atual
        p = session.get(Pessoa, p_id)
        if not p:
            return

        # Lógica de cores (Rosa para Mulheres, Azul para Homens/Outros)
        cor = "pink" if p.genero == "F" else "lightblue"
        
        # Define o nó da pessoa
        dot_content.append(f'  "{p.id}" [label="{p.nome}", fillcolor={cor}];')

        # Se tiver pai, cria a seta e sobe na recursão
        if p.pai_id:
            dot_content.append(f'  "{p.pai_id}" -> "{p.id}" [label="pai"];')
            r_gerar_dot(p.pai_id)
        
        # Se tiver mãe, cria a seta e sobe na recursão
        if p.mae_id:
            dot_content.append(f'  "{p.mae_id}" -> "{p.id}" [label="mae"];')
            r_gerar_dot(p.mae_id)

    # Inicia a recursão a partir da pessoa escolhida
    r_gerar_dot(pessoa_foco.id)
    
    dot_content.append("}")
    
    return "\n".join(dot_content)