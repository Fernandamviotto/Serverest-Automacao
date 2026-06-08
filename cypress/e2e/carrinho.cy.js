// cypress/e2e/carrinho.cy.js

describe('Carrinho - Remover produto', () => {

  let produto
  const API = () => Cypress.env('apiUrl') || 'https://serverest.dev'
  const token = () => localStorage.getItem('serverest/userToken')

  before(() => {
    cy.cadastrarUsuarioViaApi({ administrador: 'true' }).then((usuario) => {
      cy.loginViaApi(usuario.email, usuario.password)
      cy.criarProduto().then((p) => { produto = p })
    })
  })

  beforeEach(() => {
    cy.loginComoUsuario()
    cy.limparCarrinho()

    // Adiciona produto ao carrinho via API antes de cada teste
    cy.request({
      method: 'POST',
      url: `${API()}/carrinhos`,
      headers: { Authorization: token() },
      body: { produtos: [{ idProduto: produto._id, quantidade: 2 }] },
    })

    cy.visit('/carrinho')
  })

  // ── Remoção unitária ───────────────────────────────────────────────────────

  it('Deve diminuir a quantidade do produto ao clicar em remover uma unidade', () => {
    cy.get('[data-testid="diminuirProduto"]').first().click()

    cy.get('[data-testid="quantidadeProduto"]').first().should('contain', '1')
  })

  it('Deve remover o produto ao zerar a quantidade', () => {
    cy.get('[data-testid="diminuirProduto"]').first().click()
    cy.get('[data-testid="diminuirProduto"]').first().click()

    cy.contains(produto.nome).should('not.exist')
  })

  it('Deve remover o produto ao clicar no botão excluir', () => {
    cy.get('[data-testid="excluirProduto"]').first().click()

    cy.contains(produto.nome).should('not.exist')
  })

  // ── Cancelar compra ────────────────────────────────────────────────────────

  it('Deve cancelar a compra e limpar o carrinho via botão', () => {
    cy.intercept('DELETE', '**/carrinhos/cancelar-compra').as('cancelarCompra')

    cy.contains('Cancelar Compra').click()

    cy.wait('@cancelarCompra').its('response.statusCode').should('eq', 200)
    cy.deveExibirErro('Compra cancelada com sucesso')
  })

  it('Deve cancelar a compra via API e confirmar devolução do estoque', () => {
    cy.request({
      method: 'DELETE',
      url: `${API()}/carrinhos/cancelar-compra`,
      headers: { Authorization: token() },
    }).then(({ status, body }) => {
      expect(status).to.eq(200)
      expect(body.message).to.include('Registro excluído com sucesso')
    })

    // Valida que o estoque foi devolvido
    cy.request(`${API()}/produtos/${produto._id}`).then(({ body }) => {
      expect(body.quantidade).to.be.greaterThan(0)
    })
  })

  // ── Estado vazio ───────────────────────────────────────────────────────────

  it('Deve exibir carrinho vazio após remover todos os produtos', () => {
    cy.get('[data-testid="excluirProduto"]').first().click()

    cy.get('[data-testid="produto"]').should('not.exist')
  })

  it('Deve atualizar o total ao remover um produto', () => {
    const totalEsperado = produto.preco * 2

    cy.contains(`R$ ${totalEsperado.toFixed(2).replace('.', ',')}`).should('be.visible')

    cy.get('[data-testid="diminuirProduto"]').first().click()

    cy.contains(`R$ ${produto.preco.toFixed(2).replace('.', ',')}`).should('be.visible')
  })

})