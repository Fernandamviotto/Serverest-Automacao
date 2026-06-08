// cypress/e2e/compra.cy.js
//
// Fluxo real de compra no front da ServeRest:
//   - A home (/home) lista os produtos (GET /produtos) em cards.
//   - Pesquisa: input [data-testid="pesquisar"] + botão [data-testid="botaoPesquisar"].
//   - Adicionar ao carrinho: botão [data-testid="adicionarNaLista"] ("Adicionar a
//     lista"). Ele grava o item no localStorage E navega para /minhaListaDeProdutos.
//   - A Lista de Compras (carrinho real) fica em /minhaListaDeProdutos.
//   - Não há "Finalizar Compra" no front; a rota /carrinho é só "Em construção".

describe('Compra - Adicionar produto ao carrinho', () => {

  let produto

  before(() => {
    // Admin cria um produto único para toda a suite
    cy.loginComoAdmin()
    cy.criarProduto().then((p) => { produto = p })
  })

  beforeEach(() => {
    cy.loginComoUsuario()
  })

  // ── Home / listagem ───────────────────────────────────────────────────────────

  it('Deve exibir produtos e a barra de pesquisa na home', () => {
    cy.deveEstarNaHome()
    cy.get('[data-testid="pesquisar"]').should('be.visible')
    cy.get('[data-testid="adicionarNaLista"]').should('have.length.greaterThan', 0)
  })

  // ── Pesquisa ──────────────────────────────────────────────────────────────────

  it('Deve pesquisar e encontrar o produto criado', () => {
    cy.get('[data-testid="pesquisar"]').type(produto.nome)
    cy.get('[data-testid="botaoPesquisar"]').click()

    cy.contains(produto.nome).should('be.visible')
  })

  // ── Adicionar ao carrinho ─────────────────────────────────────────────────────

  it('Deve adicionar o produto ao carrinho pela home', () => {
    cy.get('[data-testid="pesquisar"]').type(produto.nome)
    cy.get('[data-testid="botaoPesquisar"]').click()

    // O botão grava no carrinho e já navega para a Lista de Compras
    cy.get('[data-testid="adicionarNaLista"]').first().click()

    cy.url().should('include', '/minhaListaDeProdutos')
    cy.get('[data-testid="shopping-cart-product-name"]').should('contain', produto.nome)
    cy.get('[data-testid="shopping-cart-product-quantity"]').should('contain', '1')
  })

  // ── Navegação ─────────────────────────────────────────────────────────────────

  it('Deve acessar a Lista de Compras pelo menu de navegação', () => {
    cy.get('[data-testid="lista-de-compras"]').click()

    cy.url().should('include', '/minhaListaDeProdutos')
    cy.get('[data-testid="shopping-cart-empty-message"]').should('be.visible')
  })

})
