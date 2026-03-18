<h1 align="center">
  🌳 Genealogical API - Sistema de Mapeamento de Árvore Genealógica com Python & FastAPI
</h1>

<h4 align="center">
  API RESTful de alta performance para gestão de linhagens familiares e relações de parentesco, desenvolvida com SQLModel e foco em recursividade.
</h4>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.2.2-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Coverage-93%25-brightgreen?style=for-the-badge" alt="Coverage">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

---

## 📚 Sobre o Projeto (v1.2.2)

A **Genealogical API** é um motor de backend especializado em processar e armazenar estruturas complexas de árvores genealógicas. O projeto utiliza o **SQLModel**, permitindo consultas recursivas para mapear ancestrais e descendentes de forma eficiente.

### 🚀 Novidades da Versão 1.2.2
* **Visualização de Grafos (DOT):** Novo endpoint que gera a estrutura da árvore em formato DOT (Graphviz) para visualização gráfica das linhagens.
* **Refatoração de Relacionamentos:** Implementação de auto-relacionamento (`self-referencing`) robusto com tratamento de `overlaps` e integridade referencial.
* **Blindagem de Testes:** Expansão da suíte de testes unitários e de integração, alcançando a marca de **93% de cobertura global**.

### 💡 Fases Concluídas
* **Fase 1: Persistência e Relacionamentos:** Modelagem de tabelas autorreferenciadas (Pai/Mãe) em PostgreSQL.
* **Fase 2: Arquitetura e Padronização:** Separação entre `Models`, `Schemas` (DTOs) e `Endpoints` com injeção de dependência.
* **Fase 3: Inteligência e Visualização:** Processamento de grafos familiares em JSON aninhado e exportação para formatos visuais.

---

## 🧪 Qualidade e Cobertura (TDD Mindset)

Seguindo padrões rigorosos de desenvolvimento, a API conta com uma suíte de testes automatizados utilizando `Pytest` e `Pytest-Cov`.

| Componente | Cobertura | Status |
| :--- | :--- | :--- |
| **Endpoints (API)** | **100%** | ✅ Protegido |
| **Database Core** | **100%** | ✅ Mockado |
| **Models / Schemas** | **~95%** | ✅ Validado |
| **TOTAL GLOBAL** | **93%** | 🚀 **Produção** |

---

## 💼 Tecnologias e Dependências

| Categoria | Tecnologia | Uso no Projeto |
| :--- | :--- | :--- |
| **Framework** | **FastAPI** | Framework web assíncrono de alto desempenho. |
| **ORM / DTO** | **SQLModel** | Unificação de Pydantic e SQLAlchemy para modelos de dados. |
| **Visualização** | **DOT / Graphviz** | Geração de estruturas de grafos para representação visual. |
| **Testes** | **Pytest / Coverage** | Garantia de qualidade e validação de regras de negócio. |

---

## 🚀 Como Executar o Projeto

1. Clone e entre na pasta:
   ```bash
   git clone [Link do seu Repositório]
   cd Genealogical


## 👨‍💻 Autor

O desenvolvedor por trás do projeto:

<table>
<tr>
<td align="center">
<a href="https://github.com/emanueldeveloper82">
<img src="https://avatars3.githubusercontent.com/u/31600150?v=4" width="120px;" alt="Emanuel Developer"/>
<br />
<sub><b>Emanuel Developer</b></sub>
</a>
</td>
<td>
<b>Software Developer | Java Specialist | Python Enthusiast</b><br />
Especialista em sistemas bancários e arquitetura de backend com mais de 15 anos de experiência. Transformando lógica complexa em código limpo e testável.
</td>
</tr>
</table>