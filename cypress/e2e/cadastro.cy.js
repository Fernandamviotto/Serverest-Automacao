describe('Cadastro de usuário', () => {
    it('Cadastro de usuário regular com sucesso', () => {
        cy.visit('/cadastrarusuarios')
        cy.get('[data-testid="nome"]').type('Murilo Vinicius Silva')
        cy.get('[data-testid="email"]').type('murilo@gmail.com.br')
        cy.get('[data-testid="password"]').type('teste123')
        cy.get('[data-testid="checkbox"]').uncheck()
        cy.get('[data-testid="cadastrar"]').click()

        cy.contains('a', 'Cadastro realizado com sucesso', {timeout: 6000}).should('be.visible')
        cy.ehAdm('Murilo Vinicius Silva' , 'murilo@gmail.com.br', 'nao')
    })

    it('Cadastro de usuário adm com sucesso', () => {
        cy.intercept('POST', '**/usuarios').as('Cadastro_Usuario')
        cy.visit('/cadastrarusuarios')
        cy.get('[data-testid="nome"]').type('Murilo Vinicius Silva')
        cy.get('[data-testid="email"]').type('murilo123@gmail.com.br')
        cy.get('[data-testid="password"]').type('teste123')
        cy.get('[data-testid="checkbox"]').check()
        cy.get('[data-testid="cadastrar"]').click()

        cy.wait('@Cadastro_Usuario').its('response.statusCode').should('eq', 201)
        cy.contains('a', 'Cadastro realizado com sucesso').should('be.visible')
        cy.ehAdm('Murilo Vinicius Silva', 'murilo123@gmail.com.br', 'sim')
    })

    it('Cadastro sem sucesso - sem credenciais fornecidas', () => {
      cy.visit('/cadastrarusuarios')
      cy.get('[data-testid="cadastrar"]').click()
      
      cy.deveExibirErro('Nome é obrigatório')
      cy.deveExibirErro('Email é obrigatório')
      cy.deveExibirErro('Password é obrigatório')
    })
    
    it('Cadastro sem sucesso - usuário já cadastrado', () => {
      cy.cadastrarUsuarioViaApi({ email: 'jaexiste@qa.com' })
      
      cy.visit('/cadastrarusuarios')
      cy.get('[data-testid="nome"]').type('Qualquer Nome')
      cy.get('[data-testid="email"]').type('jaexiste@qa.com')
      cy.get('[data-testid="password"]').type('teste123')
      cy.get('[data-testid="cadastrar"]').click()
      
      cy.deveExibirErro('Este email já está sendo usado')
    })
})