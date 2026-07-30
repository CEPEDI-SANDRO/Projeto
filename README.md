<div align="center">

# ⏱️ Sistema de Controle de Ponto

### Sistema web para gerenciamento de ponto eletrônico de funcionários

Desenvolvido utilizando **Next.js**, **Node.js**, **Express.js** e **SQLite**.

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss)

</div>

---

# 📑 Índice

- Sobre o projeto
- Objetivos
- Funcionalidades
- Tecnologias
- Arquitetura
- Estrutura do projeto
- Telas do sistema
- Como executar
- Deploy
- Testes
- Melhorias futuras
- Equipe

---

# 📖 Sobre o projeto

O Sistema de Controle de Ponto foi desenvolvido para auxiliar empresas no gerenciamento da jornada de trabalho de seus colaboradores, oferecendo uma plataforma web moderna para administração de funcionários, registros de ponto e acompanhamento das informações operacionais.

O projeto foi construído seguindo a arquitetura cliente-servidor, separando frontend e backend, permitindo maior organização, escalabilidade e facilidade de manutenção.

---

# 🎯 Objetivos

- Centralizar o gerenciamento de funcionários;
- Registrar e consultar marcações de ponto;
- Facilitar o acompanhamento das jornadas de trabalho;
- Disponibilizar indicadores administrativos em uma interface intuitiva;
- Possibilitar futuras expansões do sistema.

---

# ✨ Funcionalidades

- Login de usuários
- Dashboard administrativo
- Cadastro de funcionários
- Edição e exclusão de funcionários
- Registro de ponto
- Consulta de registros
- Relatórios administrativos
- Configurações do sistema
- Interface responsiva

---

# 🛠 Tecnologias Utilizadas

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Context API

## Backend

- Node.js
- Express.js

## Banco de Dados

- SQLite

## Deploy

- Vercel
- Render

## Versionamento

- Git
- GitHub

---

# 🏗 Arquitetura

```text
                Usuário
                   │
                   ▼
        Frontend (Next.js)
                   │
            Requisições REST
                   │
                   ▼
      Backend (Node.js + Express)
                   │
                   ▼
               SQLite
```

---

# 📂 Estrutura do Projeto

```text
Projeto/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── providers/
│   ├── services/
│   ├── styles/
│   └── types/
│
└── Backend/
    ├── controllers/
    ├── database/
    ├── middleware/
    ├── routes/
    ├── services/
    └── server.js
```

---

# 📸 Telas do Sistema

## Login

<img width="1761" height="1019" alt="image" src="https://github.com/user-attachments/assets/39ce3ee6-4239-4d23-817c-0c310d4c2627" />

## Dashboard

<img width="1758" height="1021" alt="image" src="https://github.com/user-attachments/assets/205e18d8-00a8-4b07-8de3-4abfda5cd20d" />

## Funcionários

<img width="1759" height="1020" alt="image" src="https://github.com/user-attachments/assets/6291693a-cca4-433f-ac17-5694d527436d" />

<img width="1760" height="1020" alt="image" src="https://github.com/user-attachments/assets/570e1fe2-c9d2-4834-a4cb-940aecefde22" />

<img width="1759" height="1018" alt="image" src="https://github.com/user-attachments/assets/ef196a1e-c0c8-4d0f-95ff-e59c1442e586" />

## Registros

<img width="1758" height="1016" alt="image" src="https://github.com/user-attachments/assets/d10b1885-d247-4ade-ad97-31590e5c148c" />

<img width="1759" height="1020" alt="image" src="https://github.com/user-attachments/assets/b62a5f37-e18b-4cbd-a32d-c9cf03685a07" />

<img width="1759" height="1023" alt="image" src="https://github.com/user-attachments/assets/cbb31204-ac9a-4952-bd4e-788853537a7b" />

<img width="1757" height="1018" alt="image" src="https://github.com/user-attachments/assets/c26a7d04-5c7e-4a05-a207-e735fb5caa14" />

## Relatórios

<img width="1758" height="1023" alt="image" src="https://github.com/user-attachments/assets/16735e09-e522-4aef-b042-14cd4eac397e" />

<img width="1756" height="1016" alt="image" src="https://github.com/user-attachments/assets/3fff1fa4-c342-411e-abd9-515c133ab2ec" />

<img width="1758" height="1026" alt="image" src="https://github.com/user-attachments/assets/47cec341-979b-4192-a9b4-68bb191de9fa" />

## Configurações

<img width="1758" height="1016" alt="image" src="https://github.com/user-attachments/assets/ec82ab54-290b-4005-91c1-48d3dd61edf1" />

<img width="1759" height="1019" alt="image" src="https://github.com/user-attachments/assets/c4deb97e-0958-4cc4-9e55-1cc37eb11348" />

## Exportar

<img width="1760" height="1021" alt="image" src="https://github.com/user-attachments/assets/c52bbd1e-9242-469f-9e77-f12b7a653ccc" />

---

# 🚀 Como executar o projeto

## Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
```

---

## Backend

```bash
cd Backend

npm install

npm start
```

Servidor:

```
http://localhost:3001
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Aplicação:

```
http://localhost:3000
```

---

# ⚙️ Variáveis de Ambiente

Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

# ☁️ Deploy

O sistema encontra-se dividido em dois serviços independentes.

| Serviço | Plataforma |
|----------|------------|
| Frontend | Vercel |
| Backend | Render |

---

# 🧪 Testes

Foram desenvolvidos testes End-to-End utilizando **Playwright** para validação da interface do sistema.

Como trabalho futuro, os testes podem ser ampliados para contemplar toda a integração entre frontend e backend.

---

# 🚀 Melhorias Futuras

- Containerização utilizando Docker;
- Ampliação da cobertura dos testes automatizados;
- Dashboard com novos indicadores administrativos;
- Evolução da arquitetura para suportar múltiplas empresas;
- Melhorias de desempenho e escalabilidade.

---

# 👨‍💻 Equipe

### Desenvolvimento

- Andressa Caroline Lopes de Assis
- Henrique Araújo
- Glaucio Brandão

### Orientação

- Prof. Mauro
- Prof. Silas
  
---

# 📄 Licença

Este projeto foi desenvolvido no contexto de atividades acadêmicas do programa **CEPEDI**.
