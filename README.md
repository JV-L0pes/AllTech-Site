# 🚀 AllTech Digital

> Site institucional com formulário de contato integrado a banco PostgreSQL e envio de emails via SendGrid.

## 📋 Sobre o Projeto

Aplicação Next.js (App Router) com foco em segurança: CSRF, rate limiting, detecção básica de ameaças e headers de segurança. O backend expõe endpoints para obtenção de token CSRF e envio do formulário de contato, persistindo dados no PostgreSQL e disparando emails via SendGrid.

## 🛠️ Tecnologias

- Next.js 15, React 18, TypeScript
- Tailwind CSS, PostCSS
- PostgreSQL (driver `pg`)
- SendGrid (`@sendgrid/mail`)
- Zod (validações)

## 🚀 Como rodar

### 1) Clonar e instalar

```bash
git clone https://github.com/JV-L0pes/AllTech-Site.git
cd AllTech-Site
npm install
```

### 2) Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz com, no mínimo:

```env
DATABASE_URL=postgresql://USUARIO:SENHA@localhost:5432/alltech_digital
SENDGRID_API_KEY=SEU_TOKEN_SENDGRID
SENDGRID_FROM_EMAIL=seu-email-verificado@dominio.com
CSRF_SECRET=uma_chave_aleatoria_segura
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

- Não versione `.env.local`.
- Para produção use uma URL de banco com SSL quando necessário.

### 3) Banco de dados

- Certifique-se de ter um PostgreSQL rodando e um banco chamado `alltech_digital`.
- Opcional: importe o dump fornecido no arquivo `alltech_digital_bd` (ajuste o comando conforme a extensão real):
  - Se for `.sql`: `psql -U postgres -d alltech_digital -f alltech_digital_bd`
  - Se for dump custom: `pg_restore -U postgres -d alltech_digital alltech_digital_bd`

### 4) Desenvolvimento

```bash
npm run dev
# abra http://localhost:3000
```

### 5) Produção

```bash
npm run build
npm run start
```

## 🔐 Segurança e Fluxo CSRF

O middleware aplica rate limit e validação CSRF básica. O endpoint `/api/csrf` gera um token e define cookies seguros. Para enviar o formulário:

1) Obtenha o token CSRF

```bash
curl -i -c cookies.txt -H "Origin: http://localhost:3000" http://localhost:3000/api/csrf
```

Anote `csrfToken` do JSON de resposta e mantenha os cookies salvos em `cookies.txt`.

2) Envie o formulário para `/api/contact` usando o header `x-csrf-token` e os cookies:

```bash
curl -i -b cookies.txt -H "Origin: http://localhost:3000" -H "Content-Type: application/json" \
  -H "x-csrf-token: COLoque_O_TOKEN_AQUI" \
  -X POST http://localhost:3000/api/contact \
  -d '{
    "name": "João da Silva",
    "email": "joao@exemplo.com",
    "serviceOfInterest": "Migração para Microsoft 365",
    "message": "Gostaria de um orçamento."
  }'
```

Observações:
- Origens permitidas na API: `http://localhost:3000`, `https://localhost:3000` e `NEXT_PUBLIC_DOMAIN`.
- Se testar via Postman/Insomnia, defina o header `Origin` como `http://localhost:3000` ou ajuste a whitelist no handler.

## 📡 Endpoints

- `GET /api/csrf`: gera token CSRF e define cookies (`__csrf_hash`, `__csrf_expires`).
- `POST /api/contact`: valida input (Zod), verifica CSRF, cria lead no banco e envia emails (se SendGrid configurado).
- `GET /api/contact`: health check (verifica conectividade com o banco).

Campos aceitos em `/api/contact` (principais):
- `name` (obrigatório)
- `email` (obrigatório)
- `serviceOfInterest` (obrigatório; um dentre: Migração para Microsoft 365, Treinamentos Microsoft, Consultoria em Cloud, Automação de Processos, Diagnóstico Gratuito, Outros)
- `message` (obrigatório)
- Opcionais: `company`, `phone` (formato (11) 99999-9999), `cnpj` (11.222.333/0001-81), `numberOfEmployees`, `state` (UF), `city`.

## 📦 Scripts NPM

```bash
npm run dev                 # desenvolvimento
npm run build               # build de produção
npm run start               # servidor de produção
npm run lint                # linter
npm run type-check          # checagem de tipos

# segurança e dependências
npm run security:audit      # audit nível moderate
npm run security:audit-fix  # tenta corrigir
npm run security:outdated   # pacotes desatualizados
npm run security:check-updates
npm run security:full-audit
npm run security:dependency-check
```

## 🌐 Deploy (Vercel recomendado)

1. Conecte o repositório `JV-L0pes/AllTech-Site`.
2. Configure as variáveis no painel (DATABASE_URL, SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, CSRF_SECRET, NEXT_PUBLIC_DOMAIN).
3. Deploy automático a cada push no branch selecionado.

## 📁 Estrutura resumida

```
src/
  app/
    api/
      csrf/route.ts     # gera token CSRF
      contact/route.ts  # valida/insere lead e envia emails
    layout.tsx, page.tsx, globals.css
  components/           # UI (Header, Hero, Services, ContactForm, etc.)
  lib/
    database.ts         # conexão PostgreSQL
    email-service.ts    # envio (SendGrid)
    validations.ts      # Zod schema do contato
  middleware.ts         # rate limit + segurança básica
```

## 🤝 Contribuição

```bash
git checkout -b feature/sua-feature
git commit -m "sua mensagem"
git push origin feature/sua-feature
# abra um PR
```

## 📞 Contato

- Email: joao.rosa@alltechbr.solutions
- LinkedIn: AllTech Digital

---

Desenvolvido com ❤️ pela equipe AllTech Digital
