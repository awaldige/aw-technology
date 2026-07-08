# 🚀 AW TECHNOLOGY | Premium Hardware Store

<p align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=postgresql&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

</p>

---

## 📖 Sobre o Projeto

O **AW TECHNOLOGY** é uma plataforma **Full Stack** de e-commerce voltada para hardware premium e componentes de alto desempenho.

O projeto foi desenvolvido utilizando uma arquitetura moderna baseada em **API REST**, separando completamente Front-end e Back-end.

O sistema permite visualizar produtos, realizar compras, administrar o estoque e manter todos os dados armazenados em um banco de dados **Neon PostgreSQL**, utilizando **Prisma ORM**.

Seu objetivo é demonstrar conhecimentos em desenvolvimento Full Stack, arquitetura desacoplada, integração entre serviços e boas práticas de desenvolvimento.

---

# 🌐 Demonstração

### Loja Online

➡️ **https://aw-technology.vercel.app**

### API REST

➡️ **https://aw-technology.onrender.com/api/products**

---

# 📸 Screenshots

## 🖥️ Loja

<img width="1330" height="644" alt="image" src="https://github.com/user-attachments/assets/9021e3d6-bd19-4bf8-8675-0c76dc9bb8d9" />


---

## 🛒 Carrinho


<img width="406" height="640" alt="image" src="https://github.com/user-attachments/assets/85672695-1943-449b-bce5-d77ed44754c3" />

---

## 🔐 Login Administrativo

<img width="1177" height="629" alt="image" src="https://github.com/user-attachments/assets/55ff5941-6293-4ac6-bfe6-8c8220df699c" />


---

## ⚙️ Painel Administrativo

<img width="1345" height="635" alt="image" src="https://github.com/user-attachments/assets/9dffa8b2-165e-4e7f-97d0-66f7546dac0d" />


---

# 🏗 Arquitetura

```
Cliente (Browser)

        │

        ▼

Frontend (Vercel)
HTML • CSS • JavaScript

        │
        │ REST API
        ▼

Backend (Render)
Node.js + Express

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

- Catálogo de produtos carregado em tempo real
- Paginação automática
- Layout responsivo
- Pesquisa rápida
- Carrinho de compras
- Persistência do carrinho via LocalStorage
- Atualização dinâmica dos valores
- Checkout integrado ao WhatsApp

---

## 🔐 Administração

- Login Administrativo
- Login Demonstrativo
- Cadastro de produtos
- Edição de produtos
- Exclusão de produtos
- Atualização em tempo real
- Integração completa com Neon PostgreSQL

---

## ⚙ Backend

- API REST
- CRUD completo
- Prisma ORM
- PostgreSQL
- Express.js
- Arquitetura desacoplada
- Integração Frontend + Backend

---

# 🛠 Tecnologias

## Front-end

- HTML5
- CSS3
- Tailwind CSS
- JavaScript (ES6)

---

## Back-end

- Node.js
- Express.js

---

## Banco de Dados

- Neon PostgreSQL

---

## ORM

- Prisma ORM

---

## Deploy

- Vercel (Frontend)
- Render (Backend)

---

## Integrações

- WhatsApp API
- LocalStorage

---

# 📂 Estrutura do Projeto

```
AW-TECHNOLOGY

│

├── frontend
│
├── index.html
├── login.html
├── admin.html
├── script.js
├── admin.js
├── style.css
│
├── backend
│
├── src
│   ├── config
│   ├── controllers
│   ├── routes
│   ├── app.js
│   └── server.js
│
├── prisma
│   └── schema.prisma
│
├── package.json
│
└── README.md
```

---

# 🗄 Banco de Dados

O projeto utiliza **Neon PostgreSQL**.

Modelo principal:

```
Product

id
name
description
price
image
created_at
```

O acesso ao banco é realizado através do **Prisma ORM**, permitindo operações CRUD de forma segura e tipada.

---

# 🚀 API

## Listar produtos

```
GET /api/products
```

---

## Criar produto

```
POST /api/products
```

Body

```json
{
  "name": "RTX 5090",
  "description": "GPU de alta performance",
  "price": 15999,
  "image": "https://..."
}
```

---

## Atualizar

```
PUT /api/products?id=1
```

---

## Excluir

```
DELETE /api/products?id=1
```

---

# 🚀 Como executar localmente

## Clonar

```bash
git clone https://github.com/awaldige/aw-technology.git
```

---

## Instalar dependências

```bash
npm install
```

---

## Gerar Prisma Client

```bash
npx prisma generate
```

---

## Executar Backend

```bash
node src/server.js
```

---

## Executar Frontend

Abra o arquivo:

```
index.html
```

ou utilize uma extensão como **Live Server**.

---

# 📈 Recursos

✔ Arquitetura desacoplada

✔ API REST

✔ CRUD Completo

✔ Prisma ORM

✔ Neon PostgreSQL

✔ Carrinho Persistente

✔ Checkout WhatsApp

✔ Layout Responsivo

✔ Deploy em Produção

✔ Painel Administrativo

✔ Login Demonstrativo

---

# 🎯 Objetivo

Este projeto foi desenvolvido como parte do meu portfólio para demonstrar conhecimentos em:

- Desenvolvimento Full Stack
- Arquitetura REST
- JavaScript Moderno
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Deploy em Produção
- Integração entre Front-end e Back-end

---

# 👨‍💻 Autor

**André Waldige**

💼 Desenvolvedor Full Stack

- 🌐 Portfólio: https://andre-waldige.vercel.app
- 💻 GitHub: https://github.com/awaldige
- 🔗 LinkedIn: https://linkedin.com/in/andre-waldige-dev

---

# 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins de estudo, demonstração técnica e composição de portfólio.

---

## ⭐ Se este projeto foi útil para você, deixe uma estrela no repositório!
