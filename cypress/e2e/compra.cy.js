describe('Compra - Conclusão de compra via API', () => {

  let produto

  before(() => {
    cy.loginComoAdmin()
    cy.criarProduto({ quantidade: 50 }).then((p) => { produto = p })
  })

  beforeEach(() => {
    cy.cadastrarUsuarioViaApi({ administrador: 'false' }).then((usuario) => {
      cy.login_api(usuario.email, usuario.password, 'home')
    })
  })

  // ─── Fluxo de compra ───────────────────────────────────────────────────────

  it('Deve realizar a compra de um produto com sucesso', () => {
    cy.adicionarAoCarrinhoApi([{ idProduto: produto._id, quantidade: 2 }]).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.message).to.eq('Cadastro realizado com sucesso')
    })

    cy.concluirCompraApi().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Registro excluído com sucesso')
    })
  })

  // ─── Impacto no estoque ────────────────────────────────────────────────────

  it('Deve dar baixa no estoque após concluir a compra', () => {
    const quantidadeComprada = 3
    const urlProduto = `${Cypress.env('apiUrl')}/produtos/${produto._id}`

    cy.request(urlProduto).then(({ body }) => {
      const estoqueAntes = body.quantidade

      cy.adicionarAoCarrinhoApi([{ idProduto: produto._id, quantidade: quantidadeComprada }])
      cy.concluirCompraApi()

      cy.request(urlProduto).then(({ body: depois }) => {
        expect(depois.quantidade).to.eq(estoqueAntes - quantidadeComprada)
      })
    })
  })

})