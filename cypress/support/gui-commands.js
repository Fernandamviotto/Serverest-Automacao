Cypress.Commands.add('Login', (email, password) => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type(email)
    cy.get('[data-testid="senha"]').type(password)
    cy.get('[data-testid="entrar"]').click()
})

Cypress.Commands.add('Login_Cookie', (user) => {
    cy.setCookie('session-username', user)
    cy.visit('/inventory.html', { failOnStatusCode: false })
});