// cypress/e2e/carrinho.cy.js
//
// O carrinho da ServeRest (Lista de Compras) é 100% localStorage.
//   - Rota real: /minhaListaDeProdutos  (ListCart)
//   - A rota /carrinho é só uma página "Em construção" (Checkout), por isso
//     os testes antigos que visitavam /carrinho nunca achavam os elementos.
//   - Não existe "Finalizar/Cancelar Compra" nem botão de excluir nessa tela;
//     remover zerando a quantidade é bug do próprio front (não remove).

describe('Carrinho - Lista de Compras', () => {

  const CARRINHO = '/minhaListaDeProdutos'
  let produto

  before(() => {
    // Admin cria um produto uma única vez para toda a suite
    cy.loginComoAdmin()
    cy.criarProduto().then((p) => { produto = p })
  })

  beforeEach(() => {
    cy.loginComoUsuario()
  })

  // ── Exibição ────────────────────────────────────────────────────────────────

  it('Deve exibir o produto adicionado com nome e quantidade', () => {
    cy.semearCarrinho(produto, 2)
    cy.visit(CARRINHO)

    cy.get('[data-testid="shopping-cart-product-name"]').should('contain', produto.nome)
    cy.get('[data-testid="shopping-cart-product-quantity"]').should('contain', '2')
  })

  // ── Diminuir / Aumentar unidade ──────────────────────────────────────────────

  it('Deve diminuir a quantidade do produto ao clicar em "-"', () => {
    cy.semearCarrinho(produto, 2)
    cy.visit(CARRINHO)

    cy.get('[data-testid="product-decrease-quantity"]').first().click()

    cy.get('[data-testid="shopping-cart-product-quantity"]').should('contain', '1')
  })

  it('Deve aumentar a quantidade do produto ao clicar em "+"', () => {
    cy.semearCarrinho(produto, 1)
    cy.visit(CARRINHO)

    cy.get('[data-testid="product-increase-quantity"]').first().click()

    cy.get('[data-testid="shopping-cart-product-quantity"]').should('contain', '2')
  })

  it('Deve atualizar o preço conforme a quantidade do produto', () => {
    cy.semearCarrinho(produto, 1)
    cy.visit(CARRINHO)

    cy.contains(String(produto.preco)).should('be.visible')

    cy.get('[data-testid="product-increase-quantity"]').first().click()

    cy.contains(String(produto.preco * 2)).should('be.visible')
  })

  // ── Limpar lista / estado vazio ──────────────────────────────────────────────

  it('Deve esvaziar o carrinho ao clicar em "Limpar Lista"', () => {
    cy.semearCarrinho(produto, 2)
    cy.visit(CARRINHO)

    cy.get('[data-testid="limparLista"]').click()

    cy.get('[data-testid="shopping-cart-empty-message"]').should('be.visible')
  })

  it('Deve exibir mensagem de carrinho vazio quando não há produtos', () => {
    cy.visit(CARRINHO)

    cy.get('[data-testid="shopping-cart-empty-message"]')
      .should('be.visible')
      .and('contain', 'Seu carrinho está vazio')
  })

})
