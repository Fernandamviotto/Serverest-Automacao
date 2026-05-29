// cypress/support/commands.js

const API = Cypress.env('apiUrl') || 'https://serverest.onrender.com'

// ─────────────────────────────────────────────────────────────
// USUÁRIOS
// ─────────────────────────────────────────────────────────────

/**
 * Cria um usuário via API e salva os dados em Cypress.env('usuario')
 * @param {object} overrides - campos a sobrescrever (ex: { administrador: 'true' })
 * @returns dados do usuário criado (nome, email, password, _id)
 */
Cypress.Commands.add('cadastrarUsuarioViaApi', (overrides = {}) => {
  const dados = {
    nome: `Usuario Teste ${Date.now()}`,
    email: `teste${Date.now()}@qa.com`,
    password: 'teste@123',
    administrador: 'false',
    ...overrides,
  }

  return cy.request('POST', `${API}/usuarios`, dados).then(({ body, status }) => {
    expect(status).to.eq(201)
    const usuario = { ...dados, _id: body._id }
    Cypress.env('usuario', usuario)
    return usuario
  })
})

/**
 * Verifica via API se o usuário é ou não administrador
 * Padrão do professor: cy.ehAdm(nome, email, 'sim'/'nao')
 */
Cypress.Commands.add('ehAdm', (nome, email, ehAdmin) => {
  cy.request(`${API}/usuarios?email=${email}`).then(({ body }) => {
    const usuario = body.usuarios[0]
    expect(usuario).to.exist
    expect(usuario.nome).to.eq(nome)
    expect(usuario.administrador).to.eq(ehAdmin === 'sim' ? 'true' : 'false')
  })
})

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────

/**
 * Preenche o formulário de login pela UI e clica em Entrar.
 * Usar somente nos testes que validam a tela de login.
 */
Cypress.Commands.add('loginViaUI', (email, password) => {
  cy.get('[data-testid="email"]').clear().type(email)
  cy.get('[data-testid="password"]').clear().type(password)
  cy.get('[data-testid="entrar"]').click()
})

/**
 * Autentica via API (sem UI), salva token e visita /home.
 * Usar no beforeEach de todos os testes que não testam login.
 */
Cypress.Commands.add('loginViaApi', (email, password) => {
  cy.request('POST', `${API}/login`, { email, password }).then(({ body }) => {
    localStorage.setItem('serverest/userEmail', email)
    localStorage.setItem('serverest/userToken', body.authorization)
  })
  cy.visit('/home')
})

/**
 * Cria usuário admin via API + faz login via API.
 * Uma linha no beforeEach para contexto admin completo.
 */
Cypress.Commands.add('loginComoAdmin', () => {
  cy.cadastrarUsuarioViaApi({ administrador: 'true' }).then((usuario) => {
    cy.loginViaApi(usuario.email, usuario.password)
  })
})

/**
 * Cria usuário regular via API + faz login via API.
 */
Cypress.Commands.add('loginComoUsuario', () => {
  cy.cadastrarUsuarioViaApi({ administrador: 'false' }).then((usuario) => {
    cy.loginViaApi(usuario.email, usuario.password)
  })
})

// ─────────────────────────────────────────────────────────────
// PRODUTOS
// ─────────────────────────────────────────────────────────────

/**
 * Cria um produto via API (requer token de admin no localStorage).
 * @returns objeto com dados do produto + _id
 */
Cypress.Commands.add('criarProduto', (overrides = {}) => {
  const token = localStorage.getItem('serverest/userToken')
  const dados = {
    nome: `Produto Teste ${Date.now()}`,
    preco: 100,
    descricao: 'Produto criado por automação',
    quantidade: 50,
    ...overrides,
  }
  return cy.request({
    method: 'POST',
    url: `${API}/produtos`,
    headers: { Authorization: token },
    body: dados,
  }).then(({ body, status }) => {
    expect(status).to.eq(201)
    return { ...dados, _id: body._id }
  })
})

// ─────────────────────────────────────────────────────────────
// CARRINHO
// ─────────────────────────────────────────────────────────────

/**
 * Limpa o carrinho do usuário autenticado via API.
 * Chamar no beforeEach de testes de carrinho.
 */
Cypress.Commands.add('limparCarrinho', () => {
  const token = localStorage.getItem('serverest/userToken')
  cy.request({
    method: 'DELETE',
    url: `${API}/carrinhos/cancelar-compra`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
})

// ─────────────────────────────────────────────────────────────
// ASSERTIONS REUTILIZÁVEIS
// ─────────────────────────────────────────────────────────────

/** Valida que o usuário está na home com navbar visível */
Cypress.Commands.add('deveEstarNaHome', () => {
  cy.url().should('include', '/home')
  cy.get('nav').should('be.visible')
})

/** Valida elementos exclusivos de administrador */
Cypress.Commands.add('deveVerMenuAdmin', () => {
  cy.contains('a', 'Cadastrar Usuários').should('be.visible')
})

/** Valida mensagem de erro/feedback na tela */
Cypress.Commands.add('deveExibirErro', (mensagem) => {
  cy.contains(mensagem).should('be.visible')
})