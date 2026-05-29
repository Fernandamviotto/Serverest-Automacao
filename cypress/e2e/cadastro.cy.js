// cypress/e2e/cadastro.cy.js

describe('Cadastro de Usuário', () => {

  it('Cadastro de usuário regular com sucesso', () => {
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Murilo Vinicius Silva')
    cy.get('[data-testid="email"]').type(`regular${Date.now()}@qa.com`)
    cy.get('[data-testid="password"]').type('teste@123')
    cy.get('[data-testid="checkbox"]').uncheck()
    cy.get('[data-testid="cadastrar"]').click()

    cy.contains('Cadastro realizado com sucesso').should('be.visible')
  })

  it('Cadastro de usuário administrador com sucesso', () => {
    cy.intercept('POST', '**/usuarios').as('cadastroUsuario')

    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Admin Teste Silva')
    cy.get('[data-testid="email"]').type(`admin${Date.now()}@qa.com`)
    cy.get('[data-testid="password"]').type('teste@123')
    cy.get('[data-testid="checkbox"]').check()
    cy.get('[data-testid="cadastrar"]').click()

    cy.wait('@cadastroUsuario').its('response.statusCode').should('eq', 201)
    cy.contains('Cadastro realizado com sucesso').should('be.visible')
  })

  it('Cadastro sem sucesso - sem credenciais fornecidas', () => {
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="cadastrar"]').click()

    cy.deveExibirErro('Nome é obrigatório')
    cy.deveExibirErro('Email é obrigatório')
    cy.deveExibirErro('Password é obrigatório')
  })

  it('Cadastro sem sucesso - e-mail já cadastrado', () => {
    cy.cadastrarUsuarioViaApi().then((usuario) => {
      cy.visit('/cadastrarusuarios')
      cy.get('[data-testid="nome"]').type(usuario.nome)
      cy.get('[data-testid="email"]').type(usuario.email)
      cy.get('[data-testid="password"]').type(usuario.password)
      cy.get('[data-testid="cadastrar"]').click()

      cy.deveExibirErro('Este email já está sendo usado')
    })
  })

})