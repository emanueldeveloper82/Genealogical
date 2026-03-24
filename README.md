<h1 align="center">
  🌳 Genealogical System - Mapeamento de Árvore Genealógica Full Stack
</h1>

<h4 align="center">  
  Solução completa para gestão de linhagens familiares, com Backend em Python/FastAPI e Frontend em React/TypeScript.
</h4>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.5.6-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Coverage-93%25-brightgreen?style=for-the-badge" alt="Coverage">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
</p>

---

## 📚 Sobre o Projeto (v1.5.6)

O **Genealogical System** é uma plataforma robusta para mapeamento de parentesco. O sistema permite cadastrar familiares, estabelecer vínculos de paternidade/maternidade e visualizar a estrutura completa da árvore.

### 🚀 Novidades da Versão 1.5.6
* **Frontend Reativo:** Interface moderna construída com React 18 e Vite, utilizando Tailwind CSS para um design dark mode elegante.
* **UX de Cadastro:** Implementação de selects dinâmicos para seleção de pais, com filtros inteligentes por gênero e validação de auto-referência.
* **Persistência Integrada:** Consumo da API FastAPI via Axios com tratamento de estados e notificações em tempo real (React Hot Toast).

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

## 💻 Tecnologias e Dependências

### **Backend (Python & FastAPI)**
| Tecnologia | Uso no Projeto |
| :--- | :--- |
| **FastAPI** | Framework assíncrono de alta performance. |
| **SQLModel** | ORM para persistência em PostgreSQL. |
| **Pytest** | Garantia de qualidade com 93% de cobertura. |

### **Frontend (React & TypeScript)**
| Tecnologia | Uso no Projeto |
| :--- | :--- |
| **React + Vite** | SPA (Single Page Application) veloz e tipada. |
| **Tailwind CSS** | Estilização utilitária e responsiva. |
| **React Hook Form** | Gestão de formulários e validações com Zod. |
| **Lucide React** | Conjunto de ícones minimalistas. |

---

## 🚀 Como Executar o Projeto

1. Clone e entre na pasta:
   ```bash
   git clone https://github.com/emanueldeveloper82/Genealogical.git
   cd Genealogical
   python -m venv venv
   pip install -r requirements.txt
   uvicorn app.main:app --reload

   cd frontend # ou a pasta do seu front
   npm install
   npm run dev
   ```


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