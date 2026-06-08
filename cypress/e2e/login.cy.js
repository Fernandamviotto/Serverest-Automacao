describe('Tela de Login', () => {

  let usuarioRegular
  let usuarioAdmin

  before(() => {
    cy.cadastrarUsuarioViaApi({ administrador: 'false' }).then((u) => { usuarioRegular = u })
    cy.cadastrarUsuarioViaApi({ administrador: 'true'  }).then((u) => { usuarioAdmin  = u })
  })

  beforeEach(() => {
    cy.visit('/')
  })

  it('Login com sucesso - usuário regular', () => {
    cy.loginViaUI(usuarioRegular.email, usuarioRegular.password)

    cy.url().should('include', '/home')
    cy.deveEstarNaHome()
  })

  it('Login com sucesso - usuário administrador', () => {
    cy.intercept('POST', '**/login').as('postLogin')
    cy.loginViaUI(usuarioAdmin.email, usuarioAdmin.password)

    cy.wait('@postLogin').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/home')
    cy.deveVerMenuAdmin()
  })

  it('Token salvo no localStorage após login bem-sucedido', () => {
    cy.loginViaUI(usuarioRegular.email, usuarioRegular.password)

    cy.url().should('include', '/home')

    cy.window()
      .its('localStorage')
      .invoke('getItem', 'serverest/userToken')
      .should('not.be.null')
  })

  it('Exibe erro ao submeter sem preencher nenhum campo', () => {
    cy.get('[data-testid="entrar"]').click()

    cy.deveExibirErro('Email é obrigatório')
    cy.deveExibirErro('Password é obrigatório')
  })

  it('Exibe erro ao submeter apenas com email preenchido', () => {
    cy.get('[data-testid="email"]').type(usuarioRegular.email)
    cy.get('[data-testid="entrar"]').click()

    cy.deveExibirErro('Password é obrigatório')
  })

  it('Exibe erro com senha incorreta', () => {
    cy.intercept('POST', '**/login').as('postLogin')
    cy.loginViaUI(usuarioRegular.email, 'senhaerrada')

    cy.wait('@postLogin').its('response.statusCode').should('eq', 401)
    cy.deveExibirErro('Email e/ou senha inválidos')
  })

  it('Exibe erro com e-mail inexistente', () => {
    cy.loginViaUI(`naoexiste${Date.now()}@qa.com`, 'qualquersenha')

    cy.deveExibirErro('Email e/ou senha inválidos')
  })

  it('Redireciona para login ao acessar /home sem autenticação', () => {
    cy.visit('/home')

    cy.url().should('include', '/login')
  })

})