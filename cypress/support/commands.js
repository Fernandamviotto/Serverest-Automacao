const API = Cypress.env('apiUrl') || 'https://serverest.dev'

Cypress.Commands.add('cadastrarUsuarioViaApi', (overrides = {}) => {
  const dados = {
    nome: `Usuario Teste ${Date.now()}`,
    email: `teste${Date.now()}@qa.com`,
    password: 'teste@123',
    administrador: 'false',
    ...overrides,
  }

  return cy.request('POST', `${API}/usuarios`, dados).then(({ body, status }) => {
    expect(status).to.eq(201)
    const usuario = { ...dados, _id: body._id }
    Cypress.env('usuario', usuario)
    return usuario
  })
})

Cypress.Commands.add('ehAdm', (nome, email, ehAdmin) => {
  cy.request(`${API}/usuarios?email=${email}`).then(({ body }) => {
    const usuario = body.usuarios[0]
    expect(usuario).to.exist
    expect(usuario.nome).to.eq(nome)
    expect(usuario.administrador).to.eq(ehAdmin === 'sim' ? 'true' : 'false')
  })
})

Cypress.Commands.add('loginViaUI', (email, password) => {
  cy.get('[data-testid="email"]').clear().type(email)
  // O campo de senha do front da ServeRest usa data-testid="senha" (não "password")
  cy.get('[data-testid="senha"]').clear().type(password)
  cy.get('[data-testid="entrar"]').click()
})

Cypress.Commands.add('loginViaApi', (email, password) => {
  cy.request('POST', `${API}/login`, { email, password }).then(({ body }) => {
    localStorage.setItem('serverest/userEmail', email)
    localStorage.setItem('serverest/userToken', body.authorization)
  })
  cy.visit('/home')
})

Cypress.Commands.add('loginComoAdmin', () => {
  cy.cadastrarUsuarioViaApi({ administrador: 'true' }).then((usuario) => {
    cy.loginViaApi(usuario.email, usuario.password)
  })
})

Cypress.Commands.add('loginComoUsuario', () => {
  cy.cadastrarUsuarioViaApi({ administrador: 'false' }).then((usuario) => {
    cy.loginViaApi(usuario.email, usuario.password)
  })
})

Cypress.Commands.add('criarProduto', (overrides = {}) => {
  const token = localStorage.getItem('serverest/userToken')
  const dados = {
    nome: `Produto Teste ${Date.now()}`,
    preco: 100,
    descricao: 'Produto criado por automação',
    quantidade: 50,
    ...overrides,
  }
  return cy.request({
    method: 'POST',
    url: `${API}/produtos`,
    headers: { Authorization: token },
    body: dados,
  }).then(({ body, status }) => {
    expect(status).to.eq(201)
    return { ...dados, _id: body._id }
  })
})

Cypress.Commands.add('limparCarrinho', () => {
  const token = localStorage.getItem('serverest/userToken')
  cy.request({
    method: 'DELETE',
    url: `${API}/carrinhos/cancelar-compra`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('semearCarrinho', (produto, amount = 1) => {
  const item = {
    _id: produto._id,
    nome: produto.nome,
    preco: produto.preco,
    imagem: produto.imagem,
    quantidade: produto.quantidade,
    descricao: produto.descricao,
    amount,
  }
  cy.window().then((win) => {
    win.localStorage.setItem('products', JSON.stringify([item]))
  })
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