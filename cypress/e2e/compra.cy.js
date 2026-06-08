describe('Compra - Conclusão de compra via API', () => {

  const API = Cypress.env('apiUrl')
  let produto

  // Setup: um admin cria, via API, o produto que será comprado nos testes.
  before(() => {
    cy.loginComoAdmin()
    cy.criarProduto({ quantidade: 50 }).then((p) => { produto = p })
  })

  // Cada compra é feita por um usuário regular novo, autenticado via API.
  beforeEach(() => {
    cy.cadastrarUsuarioViaApi({ administrador: 'false' }).then((usuario) => {
      cy.login_api(usuario.email, usuario.password, 'home')
    })
  })

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

  it('Deve dar baixa no estoque após concluir a compra', () => {
    const quantidadeComprada = 3

    cy.request(`${API}/produtos/${produto._id}`).then((res) => {
      const estoqueAntes = res.body.quantidade

      cy.adicionarAoCarrinhoApi([{ idProduto: produto._id, quantidade: quantidadeComprada }])
      cy.concluirCompraApi()

      cy.request(`${API}/produtos/${produto._id}`).then((depois) => {
        expect(depois.body.quantidade).to.eq(estoqueAntes - quantidadeComprada)
      })
    })
  })

})
