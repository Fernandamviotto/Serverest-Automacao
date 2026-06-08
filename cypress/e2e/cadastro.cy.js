describe('Cadastro de Usuário', () => {


  it('Cadastro de usuário regular com sucesso', () => {
    const nome  = 'Super Poderosas'
    const email = `regular${Date.now()}@qa.com`

    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type(nome)
    cy.get('[data-testid="email"]').type(email)
    cy.get('[data-testid="password"]').type('teste@123')
    cy.get('[data-testid="checkbox"]').uncheck()
    cy.get('[data-testid="cadastrar"]').click()

    cy.contains('Cadastro realizado com sucesso').should('be.visible')
    cy.ehAdm(nome, email, 'nao')
    cy.deleteUsuario(email)
  })

  it('Cadastro de usuário administrador com sucesso', () => {
    const nome  = 'Admin Teste'
    const email = `admin${Date.now()}@qa.com`

    cy.intercept('POST', '**/usuarios').as('cadastroUsuario')

    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type(nome)
    cy.get('[data-testid="email"]').type(email)
    cy.get('[data-testid="password"]').type('teste@123')
    cy.get('[data-testid="checkbox"]').check()
    cy.get('[data-testid="cadastrar"]').click()

    cy.wait('@cadastroUsuario').its('response.statusCode').should('eq', 201)
    cy.contains('Cadastro realizado com sucesso').should('be.visible')
    cy.ehAdm(nome, email, 'sim')
    cy.deleteUsuario(email)
  })


  it('Cadastro sem sucesso - sem credenciais fornecidas', () => {
    cy.intercept('POST', '**/usuarios').as('cadastroUsuario')

    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="cadastrar"]').click()

    cy.wait('@cadastroUsuario').its('response.statusCode').should('eq', 400)
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