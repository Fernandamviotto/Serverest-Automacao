Cypress.Commands.add('Login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(password)
  cy.get('[data-testid="entrar"]').click()
})

Cypress.Commands.add('Login_Cookie', (user) => {
  cy.setCookie('session-username', user)
  cy.visit('/inventory.html', { failOnStatusCode: false })
})

Cypress.Commands.add('loginViaUI', (email, password) => {
  cy.Login(email, password)
})

Cypress.Commands.add('deveEstarNaHome', () => {
  cy.url().should('include', '/home')
  cy.get('nav').should('be.visible')
})

Cypress.Commands.add('deveVerMenuAdmin', () => {
  cy.contains('a', 'Cadastrar Usuários').should('be.visible')
})

Cypress.Commands.add('deveExibirErro', (mensagem) => {
  cy.contains(mensagem).should('be.visible')
})