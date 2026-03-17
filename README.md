<h1 align="center">
  🌳 Genealogical API - Sistema de Mapeamento de Árvore Genealógica com Python & FastAPI
</h1>

<h4 align="center">
  API RESTful de alta performance para gestão de linhagens familiares e relações de parentesco, desenvolvida com SQLModel e foco em recursividade.
</h4>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger">
</p>

---

## 📚 Sobre o Projeto (Contexto e Objetivos)

A **Genealogical API** é um motor de backend especializado em processar e armazenar estruturas complexas de árvores genealógicas. O projeto utiliza o **SQLModel** (que une a validação do Pydantic com a robustez do SQLAlchemy), permitindo consultas recursivas para mapear ancestrais e descendentes de forma eficiente.

### 💡 Fases Concluídas (MVP Core)

* **Fase 1: Persistência e Relacionamentos:** Modelagem de tabelas autorreferenciadas para suporte a múltiplos vínculos (Pai/Mãe) em banco de dados PostgreSQL.
* **Fase 2: Arquitetura e Padronização:** Separação clara entre `Models` (Banco), `Schemas` (DTOs) e `Endpoints`, utilizando injeção de dependência para sessões de banco.
* **Fase 3: Inteligência de Dados:** Implementação de lógica recursiva para entrega de árvores completas em formato JSON aninhado (Ancestralidade).

### 🎯 Conhecimentos Apresentados

* **Python Moderno:** Uso de `Type Hints`, `Enums` e `Literal` para garantir segurança de tipos em tempo de execução.
* **FastAPI:** Configuração de rotas assíncronas, tags de documentação e tratamento de ciclo de vida da aplicação (`startup`).
* **SQLModel / ORM:** Implementação de relacionamentos complexos com `Relationship` e tratamento de ambiguidades em chaves estrangeiras.
* **Recursividade em APIs:** Desenvolvimento de endpoints que processam grafos familiares, transformando registros de banco em estruturas de árvore aninhadas.

---

## 💼 Tecnologias e Dependências

| Categoria | Tecnologia | Uso no Projeto |
| :--- | :--- | :--- |
| **Linguagem** | **Python 3.12+** | Linguagem principal, versátil e com tipagem estática opcional. |
| **Framework** | **FastAPI** | Framework web moderno de alto desempenho para Python. |
| **ORM / DTO** | **SQLModel** | Combinação de Pydantic e SQLAlchemy para modelos de dados unificados. |
| **Banco de Dados** | **PostgreSQL** | Banco relacional robusto para armazenamento das relações familiares. |
| **Servidor** | **Uvicorn** | Implementação de servidor ASGI para execução da API. |
| **Documentação** | **OpenAPI / Swagger** | Interface interativa nativa para exploração e teste dos endpoints. |

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
* [Python 3.12+](https://www.python.org/downloads/)
* [PostgreSQL](https://www.postgresql.org/) (ou Docker para subir a instância)

### 2. Configuração e Execução

1. Clone o repositório:
    ```bash
    git clone [Link do seu Repositório]
    cd Genealogical
    ```

2. Crie e ative o ambiente virtual:
    ```bash
    python -m venv myvenv
    # No Windows:
    .\myvenv\Scripts\activate
    ```

3. Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```

4. Execute a aplicação:
    ```bash
    uvicorn app.main:app --reload
    ```

5. Acesse a documentação da API:
    - Swagger UI: `http://127.0.0.1:8000/docs`

---