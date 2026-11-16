# 🚀 AW TECHNOLOGY | Premium Hardware Store

<p align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

</p>

---

## 📖 Sobre o Projeto

O **AW TECHNOLOGY** é uma plataforma Full Stack demonstrativa de e-commerce, desenvolvida para apresentar uma experiência de loja virtual voltada para hardware, componentes e produtos de tecnologia.

O projeto utiliza uma arquitetura desacoplada, com Front-end independente e Back-end disponibilizado por meio de uma API REST.

A aplicação permite visualizar produtos, pesquisar itens, gerenciar um carrinho de compras e acessar um painel administrativo para gerenciamento do catálogo.

O sistema possui autenticação administrativa com **JWT (JSON Web Token)**, validação de senha com **bcryptjs** e proteção das operações de gerenciamento de produtos.

Os dados são armazenados em um banco de dados **Neon PostgreSQL**, com acesso realizado pelo **Prisma ORM**.

O objetivo é demonstrar conhecimentos em desenvolvimento Full Stack, integração entre serviços, segurança de APIs e publicação de aplicações em produção.

> **Observação:** este projeto possui finalidade demonstrativa e de portfólio. Não representa uma operação comercial real.

---

# 🌐 Demonstração

### 🛍 Loja Online

➡️ https://aw-technology.vercel.app

### 🔐 Login Administrativo

➡️ https://aw-technology.vercel.app/login.html

### ⚙️ API REST

➡️ https://aw-technology.onrender.com/api/products

---

# 📸 Screenshots

## 🖥️ Loja

<img width="1330" height="644" alt="Loja AW TECHNOLOGY" src="https://github.com/user-attachments/assets/9021e3d6-bd19-4bf8-8675-0c76dc9bb8d9" />

---

## 🛒 Carrinho

<img width="406" height="640" alt="Carrinho de compras" src="https://github.com/user-attachments/assets/85672695-1943-449b-bce5-d77ed44754c3" />

---

## 🔐 Login Administrativo

<img width="1177" height="629" alt="Login administrativo" src="https://github.com/user-attachments/assets/55ff5941-6293-4ac6-bfe6-8c8220df699c" />

---

## ⚙️ Painel Administrativo

<img width="1345" height="635" alt="Painel administrativo" src="https://github.com/user-attachments/assets/9dffa8b2-165e-4e7f-97d0-66f7546dac0d" />

---

# 🏗 Arquitetura

A aplicação utiliza uma arquitetura desacoplada, dividida em Front-end, Back-end, camada de persistência e banco de dados.

```text
                 CLIENTE
               (Navegador)
                    │
                    ▼
             FRONT-END
                Vercel
          HTML • CSS • JavaScript
                    │
                    │ HTTPS / REST API
                    ▼
              BACK-END
                Render
             Node.js + Express
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
    Autenticação          Rotas de Produtos
       JWT                    CRUD
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
                Prisma ORM
                    │
                    ▼
             Neon PostgreSQL
```

---

# ✨ Funcionalidades

## 🛍 Loja

- Catálogo de produtos integrado à API REST.
- Carregamento dinâmico dos produtos.
- Paginação.
- Pesquisa de produtos.
- Layout responsivo.
- Carrinho de compras.
- Persistência do carrinho utilizando LocalStorage.
- Atualização dinâmica dos valores.
- Finalização demonstrativa pelo WhatsApp.

## 🔐 Administração

- Login administrativo.
- Acesso demonstrativo para visitantes.
- Autenticação administrativa utilizando JWT.
- Validação de senha com bcryptjs.
- Geração de token com tempo de expiração.
- Cadastro de produtos.
- Edição de produtos.
- Exclusão de produtos.
- Comunicação autenticada com a API.
- Controle de acesso às operações administrativas.

## 🛡️ Segurança da API

- Autenticação baseada em JSON Web Token.
- Middleware para validação do token.
- Verificação do perfil administrativo.
- Rotas de gerenciamento protegidas.
- Senha administrativa armazenada em formato hash.
- Segredos configurados por variáveis de ambiente.
- Rejeição de requisições administrativas sem autenticação válida.

**Regras de acesso:**

| Operação | Acesso |
|---|---|
| Listar produtos (GET) | Público |
| Consultar produtos | Público |
| Login administrativo | Público, com validação de senha |
| Cadastrar produtos (POST) | Administrador autenticado |
| Editar produtos (PUT) | Administrador autenticado |
| Excluir produtos (DELETE) | Administrador autenticado |

## ⚙️ Back-end

- API REST.
- Node.js.
- Express.js.
- Prisma ORM.
- Integração com PostgreSQL.
- Middleware de autenticação.
- Rotas organizadas por responsabilidade.
- Comunicação entre Front-end e Back-end.

---

# 🔐 Autenticação Administrativa

A autenticação utiliza **JWT (JSON Web Token)** para controlar o acesso às operações administrativas.

### Fluxo de autenticação

1. O administrador informa sua senha na tela de login.
2. O Front-end envia a credencial para a API.
3. O Back-end valida a senha utilizando bcryptjs.
4. Se a autenticação for válida, a API gera um token JWT.
5. O Front-end armazena o token na sessão do navegador.
6. As operações administrativas enviam o token no cabeçalho Authorization.
7. O middleware verifica o token e autoriza ou rejeita a operação.

### Exemplo de cabeçalho autenticado

```http
Authorization: Bearer SEU_TOKEN_JWT
```

### Configuração de segurança

As credenciais e os segredos são configurados por variáveis de ambiente no ambiente do Back-end.

- `ADMIN_PASSWORD_HASH`: hash da senha administrativa.
- `JWT_SECRET`: chave utilizada para assinar os tokens.
- `DATABASE_URL`: conexão com o banco de dados.
- `PORT`: porta do servidor, fornecida pelo ambiente de hospedagem quando aplicável.

Nenhuma senha administrativa ou chave secreta deve ser armazenada diretamente no código-fonte.

---

# 🛠 Tecnologias

## Front-end

- HTML5
- CSS3
- Tailwind CSS
- JavaScript ES6
- LocalStorage
- SessionStorage

## Back-end

- Node.js
- Express.js
- bcryptjs
- JSON Web Token (JWT)
- CORS

## Banco de Dados

- Neon PostgreSQL

## ORM

- Prisma ORM

## Hospedagem e Deploy

- Vercel — Front-end
- Render — Back-end
- Neon — Banco de dados

## Integrações

- API REST
- WhatsApp
- LocalStorage

---

# 📂 Estrutura do Projeto

```text
AW-TECHNOLOGY/
│
├── backend/
│   │
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── productRoutes.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   │
│   ├── index.html
│   ├── login.html
│   ├── admin.html
│   ├── script.js
│   └── style.css
│
└── README.md
```

---

# 🗄 Banco de Dados

O projeto utiliza **Neon PostgreSQL** como banco de dados relacional.

A comunicação entre a aplicação e o banco é realizada por meio do Prisma ORM.

### Modelo principal: Product

| Campo | Descrição |
|---|---|
| id | Identificador do produto |
| name | Nome do produto |
| description | Descrição |
| price | Preço |
| image | URL da imagem |
| createdAt | Data de criação |

O Prisma ORM centraliza as operações de consulta, cadastro, atualização e exclusão dos produtos.

---

# 🚀 API REST

A API disponibiliza rotas públicas para consulta de produtos e rotas protegidas para gerenciamento administrativo.

## Autenticação

### Login administrativo

```http
POST /api/auth/login
```

Exemplo de corpo da requisição:

```json
{
  "password": "SUA_SENHA_ADMINISTRATIVA"
}
```

Em caso de autenticação válida, a API retorna um token JWT.

## Produtos

### Listar produtos

```http
GET /api/products
```

Rota pública.

### Criar produto

```http
POST /api/products
```

Requer autenticação administrativa.

Exemplo de corpo:

```json
{
  "name": "RTX 5090",
  "description": "GPU de alta performance",
  "price": 15999,
  "image": "https://exemplo.com/imagem.jpg"
}
```

### Atualizar produto

```http
PUT /api/products?id=1
```

Requer autenticação administrativa.

### Excluir produto

```http
DELETE /api/products?id=1
```

Requer autenticação administrativa.

**Observação:** as operações POST, PUT e DELETE devem enviar um token JWT válido no cabeçalho `Authorization`.

---

# 💻 Como executar localmente

## 1. Clonar o repositório

```bash
git clone https://github.com/awaldige/aw-technology.git
```

## 2. Acessar o Back-end

```bash
cd aw-technology/backend
```

## 3. Instalar dependências

```bash
npm install
```

## 4. Configurar variáveis de ambiente

Criar um arquivo `.env` dentro da pasta `backend`, utilizando as variáveis:

```env
DATABASE_URL="SUA_URL_DO_NEON"
JWT_SECRET="SUA_CHAVE_SECRETA"
ADMIN_PASSWORD_HASH="SEU_HASH_BCRYPT"
PORT=3001
```

Utilize valores próprios para seu ambiente. Não publique o arquivo `.env` no GitHub.

## 5. Gerar o Prisma Client

```bash
npx prisma generate
```

## 6. Iniciar o Back-end

```bash
npm start
```

O servidor ficará disponível localmente na porta configurada, por padrão `3001`.

## 7. Executar o Front-end

Abra a pasta `frontend` no VS Code e utilize a extensão **Live Server** para executar o arquivo:

```text
index.html
```

O Front-end local poderá ser acessado pela URL disponibilizada pelo Live Server.

---

# 🧪 Validações realizadas

Os seguintes testes foram realizados no ambiente de produção:

- Login administrativo com autenticação JWT.
- Rejeição de senha inválida.
- Carregamento público da lista de produtos.
- Edição autenticada de produtos.
- Rejeição de tentativa de cadastro sem token JWT.

Os demais testes de segurança e comportamento serão realizados progressivamente.

---

# 📈 Destaques Técnicos

- Arquitetura Full Stack desacoplada.
- API REST.
- CRUD de produtos.
- Autenticação com JWT.
- Hash de senha com bcryptjs.
- Middleware de autorização.
- Proteção de rotas administrativas.
- Prisma ORM.
- Neon PostgreSQL.
- Carrinho persistente.
- Integração com WhatsApp.
- Interface responsiva.
- Deploy em produção com Vercel e Render.

---

# 🎯 Objetivo do Projeto

O AW TECHNOLOGY foi desenvolvido como parte do meu portfólio profissional para demonstrar conhecimentos práticos em:

- Desenvolvimento Full Stack.
- HTML, CSS e JavaScript.
- Node.js e Express.
- Construção e integração de APIs REST.
- Autenticação e autorização com JWT.
- Segurança de aplicações Web.
- Prisma ORM.
- PostgreSQL.
- Arquitetura desacoplada.
- Deploy e integração entre serviços.

---

# 👨‍💻 Autor

**André Waldige**

Desenvolvedor Full Stack | AW TECHNOLOGY

- 🌐 Portfólio: https://andre-waldige.vercel.app
- 💻 GitHub: https://github.com/awaldige
- 🔗 LinkedIn: https://linkedin.com/in/andre-waldige-dev

---

# 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins de estudo, demonstração técnica e composição de portfólio.

---

<p align="center">

**⭐ Se este projeto foi interessante, considere deixar uma estrela no repositório!**

Desenvolvido por **André Waldige | AW TECHNOLOGY**

</p>
