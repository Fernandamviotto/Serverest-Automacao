describe('Carrinho - Lista de Compras', () => {

  const ROTA_CARRINHO = '/minhaListaDeProdutos'
  let produto

  before(() => {
    cy.loginComoAdmin()
    cy.criarProduto().then((p) => { produto = p })
  })

  beforeEach(() => {
    cy.loginComoUsuario()
  })


  it('Deve exibir o produto adicionado com nome e quantidade', () => {
    cy.semearCarrinho(produto, 2)
    cy.visit(ROTA_CARRINHO)

    cy.get('[data-testid="shopping-cart-product-name"]').should('contain', produto.nome)
    cy.get('[data-testid="shopping-cart-product-quantity"]').should('contain', '2')
  })

  it('Deve exibir mensagem de carrinho vazio quando não há produtos', () => {
    cy.visit(ROTA_CARRINHO)

    cy.get('[data-testid="shopping-cart-empty-message"]')
      .should('be.visible')
      .and('contain', 'Seu carrinho está vazio')
  })


  it('Deve diminuir a quantidade do produto ao clicar em "-"', () => {
    cy.semearCarrinho(produto, 2)
    cy.visit(ROTA_CARRINHO)

    cy.get('[data-testid="product-decrease-quantity"]').first().click()

    cy.get('[data-testid="shopping-cart-product-quantity"]').should('contain', '1')
  })

  it('Deve aumentar a quantidade do produto ao clicar em "+"', () => {
    cy.semearCarrinho(produto, 1)
    cy.visit(ROTA_CARRINHO)

    cy.get('[data-testid="product-increase-quantity"]').first().click()

    cy.get('[data-testid="shopping-cart-product-quantity"]').should('contain', '2')
  })

  it('Deve atualizar o preço conforme a quantidade do produto', () => {
    cy.semearCarrinho(produto, 1)
    cy.visit(ROTA_CARRINHO)

    cy.contains(String(produto.preco)).should('be.visible')

    cy.get('[data-testid="product-increase-quantity"]').first().click()

    cy.contains(String(produto.preco * 2)).should('be.visible')
  })

  it('Deve esvaziar o carrinho ao clicar em "Limpar Lista"', () => {
    cy.semearCarrinho(produto, 2)
    cy.visit(ROTA_CARRINHO)

    cy.get('[data-testid="limparLista"]').click()

    cy.get('[data-testid="shopping-cart-empty-message"]').should('be.visible')
  })

})