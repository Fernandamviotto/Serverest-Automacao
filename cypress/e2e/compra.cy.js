// cypress/e2e/compra.cy.js

describe('Compra - Adicionar produto ao carrinho', () => {

  let produto

  before(() => {
    // Cria admin + produto uma única vez para toda a suite
    cy.cadastrarUsuarioViaApi({ administrador: 'true' }).then((usuario) => {
      cy.loginViaApi(usuario.email, usuario.password)
      cy.criarProduto().then((p) => { produto = p })
    })
  })

  beforeEach(() => {
    cy.loginComoUsuario()
    cy.limparCarrinho()
  })

  // ── Adicionar ao carrinho ──────────────────────────────────────────────────

  it('Deve exibir produtos disponíveis na home', () => {
    cy.deveEstarNaHome()
    cy.get('[data-testid="produto"]').should('have.length.greaterThan', 0)
  })

  it('Deve adicionar um produto ao carrinho pela home', () => {
    cy.deveEstarNaHome()
    cy.get('[data-testid="produto"]').first().within(() => {
      cy.get('[data-testid="adicionarNaListaDeProdutos"]').click()
    })

    cy.contains('Adicionar ao carrinho').click()
    cy.deveExibirErro('Produto adicionado com sucesso')
  })

  it('Deve refletir o produto adicionado no ícone do carrinho', () => {
    cy.deveEstarNaHome()
    cy.get('[data-testid="produto"]').first().within(() => {
      cy.get('[data-testid="adicionarNaListaDeProdutos"]').click()
    })

    cy.get('[data-testid="quantidadeTotalItemsCarrinho"]').should('contain', '1')
  })

  // ── Carrinho ───────────────────────────────────────────────────────────────

  it('Deve exibir o produto correto dentro do carrinho', () => {
    const token = () => localStorage.getItem('serverest/userToken')

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl') || 'https://serverest.onrender.com'}/carrinhos`,
      headers: { Authorization: token() },
      body: { produtos: [{ idProduto: produto._id, quantidade: 1 }] },
    })

    cy.visit('/carrinho')
    cy.contains(produto.nome).should('be.visible')
  })

  it('Deve exibir o valor total correto no carrinho', () => {
    const token = () => localStorage.getItem('serverest/userToken')

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl') || 'https://serverest.onrender.com'}/carrinhos`,
      headers: { Authorization: token() },
      body: { produtos: [{ idProduto: produto._id, quantidade: 2 }] },
    })

    cy.visit('/carrinho')
    cy.contains(`R$ ${(produto.preco * 2).toFixed(2).replace('.', ',')}`).should('be.visible')
  })

  // ── Finalizar compra ───────────────────────────────────────────────────────

  it('Deve finalizar a compra com sucesso', () => {
    const token = () => localStorage.getItem('serverest/userToken')

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl') || 'https://serverest.onrender.com'}/carrinhos`,
      headers: { Authorization: token() },
      body: { produtos: [{ idProduto: produto._id, quantidade: 1 }] },
    })

    cy.intercept('DELETE', '**/carrinhos/concluir-compra').as('finalizarCompra')

    cy.visit('/carrinho')
    cy.contains('Finalizar Compra').click()

    cy.wait('@finalizarCompra').its('response.statusCode').should('eq', 200)
    cy.deveExibirErro('Compra finalizada com sucesso')
  })

})