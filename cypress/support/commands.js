const API = 'https://serverest.onrender.com'

// ─── Verifica se o usuário é admin após cadastro ──────────────────────────────
// Padrão do professor: cy.ehAdm(nome, email, 'sim'/'nao')
Cypress.Commands.add('ehAdm', (nome, email, ehAdmin) => {
  cy.request(`${API}/usuarios?email=${email}`).then(({ body }) => {
    const usuario = body.usuarios[0]
    expect(usuario.nome).to.eq(nome)
    expect(usuario.administrador).to.eq(ehAdmin === 'sim' ? 'true' : 'false')
  })
})

// ─── Login pela UI (para testes da tela de login) ─────────────────────────────
Cypress.Commands.add('loginViaUI', (email, senha) => {
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="password"]').type(senha)
  cy.get('[data-testid="entrar"]').click()
})

// ─── Login via API (para beforeEach dos demais testes) ────────────────────────
Cypress.Commands.add('loginViaApi', (email, password) => {
  cy.request('POST', `${API}/login`, { email, password }).then(({ body }) => {
    localStorage.setItem('serverest/userEmail', email)
    localStorage.setItem('serverest/userToken', body.authorization)
  })
  cy.visit('/home')
})

// ─── Cria usuário via API (setup dinâmico) ────────────────────────────────────
Cypress.Commands.add('cadastrarUsuarioViaApi', (overrides = {}) => {
  const dados = {
    nome: `Usuario Teste ${Date.now()}`,
    email: `teste${Date.now()}@qa.com`,
    password: 'teste@123',
    administrador: 'false',
    ...overrides,
  }
  return cy.request('POST', `${API}/usuarios`, dados).then(() => dados)
})

// ─── Assertions reutilizáveis ─────────────────────────────────────────────────
Cypress.Commands.add('deveEstarNaHome', () => {
  cy.url().should('include', '/home')
  cy.get('[data-testid="navbar"]').should('be.visible')
})

Cypress.Commands.add('deveExibirErro', (mensagem) => {
  cy.contains(mensagem).should('be.visible')
})