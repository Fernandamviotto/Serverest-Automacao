describe('Compra - Adicionar produto ao carrinho', () => {

  let produto

  before(() => {
    cy.loginComoAdmin()
    cy.criarProduto().then((p) => { produto = p })
  })

  beforeEach(() => {
    cy.loginComoUsuario()
  })

  it('Deve exibir produtos e a barra de pesquisa na home', () => {
    cy.deveEstarNaHome()
    cy.get('[data-testid="pesquisar"]').should('be.visible')
    cy.get('[data-testid="adicionarNaLista"]').should('have.length.greaterThan', 0)
  })

  it('Deve pesquisar e encontrar o produto criado', () => {
    cy.get('[data-testid="pesquisar"]').type(produto.nome)
    cy.get('[data-testid="botaoPesquisar"]').click()

    cy.contains(produto.nome).should('be.visible')
  })

  it('Deve adicionar o produto ao carrinho pela home', () => {
    cy.get('[data-testid="pesquisar"]').type(produto.nome)
    cy.get('[data-testid="botaoPesquisar"]').click()

    cy.get('[data-testid="adicionarNaLista"]').first().click()

    cy.url().should('include', '/minhaListaDeProdutos')
    cy.get('[data-testid="shopping-cart-product-name"]').should('contain', produto.nome)
    cy.get('[data-testid="shopping-cart-product-quantity"]').should('contain', '1')
  })

  it('Deve acessar a Lista de Compras pelo menu de navegação', () => {
    cy.get('[data-testid="lista-de-compras"]').click()

    cy.url().should('include', '/minhaListaDeProdutos')
    cy.get('[data-testid="shopping-cart-empty-message"]').should('be.visible')
  })

})
