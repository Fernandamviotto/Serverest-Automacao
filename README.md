# Serverest-Automacao 🚀

Projeto de automação de testes end-to-end (E2E) para a plataforma **Serverest** utilizando **Cypress**.

## 📋 Descrição

Este repositório contém um conjunto abrangente de testes automatizados para validar a funcionalidade e a confiabilidade da aplicação Serverest, uma API REST e plataforma web de treinamento em automação de testes.

## 🛠 Tecnologias

- **Cypress** - Framework de testes E2E JavaScript
- **Node.js** - Runtime JavaScript
- **JavaScript** - Linguagem de programação

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/Fernandamviotto/Serverest-Automacao.git
cd Serverest-Automacao
```

2. **Instale as dependências**
```bash
npm install
```

## 🎯 Uso

### Executar todos os testes
```bash
npm run cypress:run
```

### Abrir o Cypress Test Runner (modo interativo)
```bash
npm run cypress:open
```

### Executar testes em modo headless
```bash
npx cypress run
```

## 📁 Estrutura do Projeto

```
Serverest-Automacao/
├── cypress/
│   ├── e2e/                 # Testes end-to-end
│   ├── fixtures/            # Dados de teste
│   └── support/             # Comandos customizados e configurações
├── cypress.config.js        # Configuração principal do Cypress
├── package.json             # Dependências do projeto
├── .gitignore              # Arquivo de ignorância do Git
└── README.md               # Este arquivo
```

## ⚙️ Configuração

O arquivo `cypress.config.js` contém as principais configurações:

- **Base URL**: https://front.serverest.dev (aplicação web)
- **API URL**: https://serverest.dev (API REST)
- **Viewport**: 1280x720px
- **Timeout padrão**: 8 segundos
- **Screenshot on Failure**: Habilitado
- **Vídeo**: Desabilitado

### Variáveis de Ambiente

As seguintes variáveis podem ser configuradas no `cypress.config.js`:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `apiUrl` | https://serverest.dev | URL base da API |
| `baseUrl` | https://front.serverest.dev | URL base da aplicação web |

## ✍️ Escrevendo Testes

Os testes devem ser organizados em `cypress/e2e/` com a extensão `.cy.js`.

### Exemplo de teste básico:

```javascript
describe('Exemplo de Suite de Testes', () => {
  it('Deve validar a página inicial', () => {
    cy.visit('/')
    cy.get('h1').should('contain', 'Serverest')
  })
})
```

## 📦 Dependências

- **cypress**: ^15.16.0 - Framework de testes E2E

## 🔍 Boas Práticas

- Use seletores estáveis (data-testid, ids) ao invés de seletores frágeis
- Mantenha os testes independentes e isolados
- Use Page Object Model para melhor manutenibilidade
- Adicione comandos customizados em `cypress/support/commands.js`
- Documente o propósito de cada teste
- Evite hardcodes, use fixtures para dados

## 🐛 Troubleshooting

### Testes não encontram elementos
- Verifique o `baseUrl` em `cypress.config.js`
- Confirme se o servidor está rodando
- Aumente o timeout com `cy.get(..., { timeout: 10000 })`

### Falhas aleatórias
- Adicione `cy.wait()` se necessário sincronização
- Use `cy.intercept()` para mockar respostas de API
- Verifique se há race conditions

## 📞 Contato

**Autor**: Fernanda Mviotto  
**GitHub**: [@Fernandamviotto](https://github.com/Fernandamviotto)

## 📝 Licença

Este projeto está disponível sob a MIT License.

---

**Última atualização**: Junho de 2026
