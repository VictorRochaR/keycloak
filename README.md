# Projeto Full-Stack com NestJS, React e Keycloak

Este é um projeto full-stack completo que demonstra a integração de um front-end em React com um back-end em NestJS, utilizando Keycloak para autenticação e autorização (AuthN/AuthZ) baseada em papéis (roles) e um banco de dados PostgreSQL para persistência de dados.

Toda a infraestrutura (Keycloak e PostgreSQL) é gerenciada e orquestrada com Docker Compose.

## Funcionalidades

-   **API RESTful Segura**: Back-end com NestJS expondo endpoints de CRUD (`Create`, `Read`, `Update`, `Delete`).
-   **Autenticação Centralizada**: Fluxo de login e logout gerenciado pelo Keycloak (Single Sign-On).
-   **Autorização Baseada em Papéis (RBAC)**: O acesso aos endpoints da API e a visibilidade dos componentes na interface são controlados pelas `roles` do usuário (ex: `app-leitor`, `app-criador`).
-   **Interface Reativa**: Front-end com React e Vite, que reage dinamicamente às permissões do usuário logado.
-   **Banco de Dados Relacional**: Persistência de dados com PostgreSQL, gerenciado via TypeORM.
-   **Infraestrutura como Código**: Ambiente de desenvolvimento totalmente containerizado e reprodutível com Docker Compose.

## Tech Stack

-   **Back-end**: NestJS, TypeORM
-   **Front-end**: React, Vite
-   **Banco de Dados**: PostgreSQL
-   **Autenticação/Autorização**: Keycloak
-   **Containerização**: Docker, Docker Compose

## Estrutura do Projeto

```
.
├── backend/
│   ├── .env.example
│   └── ...
├── frontend/
├── keycloak-import/
├── .env.example
└── docker-compose.yml
```

## Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas:
-   [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
-   [Docker](https://www.docker.com/products/docker-desktop/)
-   Docker Compose

## Como Executar o Projeto

Siga estes passos para colocar toda a aplicação no ar.

### 1. Configure os Arquivos de Ambiente (`.env`)

Este projeto usa arquivos `.env.example` como templates. Você precisará copiá-los para criar seus próprios arquivos `.env` locais.

**a) Para o Docker Compose:**

Na pasta raiz do projeto, copie o arquivo `.env.example` para um novo arquivo chamado `.env`.

```bash
# Na pasta raiz do projeto
cp .env.example .env
```
Verifique se o conteúdo do novo `.env` está correto:
```dotenv
# /keycloak/.env

# Credenciais do usuário administrador do Keycloak
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=admin

# Credenciais do Banco de Dados PostgreSQL
POSTGRES_DB=meu_app_db
POSTGRES_USER=meu_app_user
POSTGRES_PASSWORD=senha_forte_123
```

**b) Para a API NestJS:**

Dentro da pasta `backend`, faça o mesmo.

```bash
# Navegue para a pasta do back-end
cd backend

# Copie o template
cp .env.example .env

# Volte para a pasta raiz
cd ..
```
Verifique se o conteúdo do novo `backend/.env` está correto:
```dotenv
# /keycloak/backend/.env

# Credenciais para a API se conectar ao PostgreSQL
POSTGRES_DB=meu_app_db
POSTGRES_USER=meu_app_user
POSTGRES_PASSWORD=senha_forte_123
```

### 2. Inicie a Infraestrutura (Docker)

Com os arquivos `.env` criados, inicie os containers do Keycloak e do PostgreSQL.

```bash
docker compose up -d
```

### 3. Instale as Dependências e Execute os Projetos

Você precisará de dois terminais separados, um para o back-end e outro para o front-end.

**a) Terminal 1 - Back-end:**

```bash
# Navegue até a pasta do back-end
cd backend

# Instale as dependências
npm install

# Inicie a API em modo de desenvolvimento
npm run start:dev
```

**b) Terminal 2 - Front-end:**

```bash
# Navegue até a pasta do front-end
cd frontend

# Instale as dependências
npm install

# Inicie a aplicação React
npm run dev
```

Ao final desses passos, toda a aplicação estará rodando!

## Como Usar e Usuários de Teste

1.  Acesse a aplicação no seu navegador: **[http://localhost:5173](http://localhost:5173)**
2.  Clique em "Login" para ser redirecionado à tela do Keycloak.
3.  Use um dos usuários de teste abaixo (eles foram criados automaticamente pelo arquivo `realm-config.json`).

| Usuário             | Senha | Permissões                                         |
| ------------------- | ----- | -------------------------------------------------- |
| `usuario-completo`  | `1234`  | Pode ver, criar, editar e excluir itens.           |
| `usuario-leitor`    | `1234`  | Pode apenas visualizar a lista de itens.           |

## URLs Importantes

-   **Aplicação Front-end**: `http://localhost:5173`
-   **API Back-end**: `http://localhost:3000`
-   **Console de Admin do Keycloak**: `http://localhost:8080` (Login: `admin`/`admin`)
-   **Porta do PostgreSQL**: `5432` (acessível em `localhost` com uma ferramenta de banco de dados)