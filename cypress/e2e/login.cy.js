describe('Tela de Login', () => {
  it('Login com sucesso - Usuário ADM', () => {
    cy.visit('/')
    cy.get('[data-testid="email"]').type('murilo@gmail.com.br')
    cy.get('[data-testid="senha"]').type('teste')
    cy.get('[data-testid="entrar"]').click()

    cy.url().should('eq', 'https://front.serverest.dev/admin/home')
    cy.contains('p', 'Este é seu sistema para administrar seu ecommerce.').should('be.visible')
  })

  it.only('Login com sucesso - Usuário Regular', () => {
    cy.Login('joaozinho@email.com', 'teste')

    cy.url().should('eq', 'https://front.serverest.dev/home')
  })
})