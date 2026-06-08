const API = Cypress.env('apiUrl') || 'https://serverest.dev'

Cypress.Commands.add('cadastraUsuario', (nome, email, senha, administrador) => {
  cy.request({
    method: 'POST',
    url:    `${API}/usuarios`,
    body:   { nome, email, password: senha, administrador },
  })
})

Cypress.Commands.add('cadastrarUsuarioViaApi', (overrides = {}) => {
  const dados = {
    nome:          `Usuario Teste ${Date.now()}`,
    email:         `teste${Date.now()}@qa.com`,
    password:      'teste@123',
    administrador: 'false',
    ...overrides,
  }

  return cy.cadastraUsuario(dados.nome, dados.email, dados.password, dados.administrador)
    .then(({ body, status }) => {
      expect(status).to.eq(201)
      return { ...dados, _id: body._id }
    })
})

Cypress.Commands.add('deleteUsuario', (email) => {
  cy.request({
    method: 'GET',
    url:    `${API}/usuarios`,
    qs:     { email },
  }).then(({ body }) => {
    cy.request({
      method: 'DELETE',
      url:    `${API}/usuarios/${body.usuarios[0]._id}`,
    })
  })
})

Cypress.Commands.add('ehAdm', (nome, email, adm) => {
  cy.request({
    method: 'GET',
    url:    `${API}/usuarios`,
    qs:     { nome, email },
  }).then(({ body, status }) => {
    expect(status).to.eq(200)
    const esperado = adm === 'sim' ? 'true' : 'false'
    expect(body.usuarios[0].administrador).to.eq(esperado)
  })
})


Cypress.Commands.add('login_api', (email, senha, tela) => {
  cy.request({
    method: 'POST',
    url:    `${API}/login`,
    body:   { email, password: senha },
  }).then(({ body }) => {
    window.localStorage.setItem('serverest/userToken', body.authorization)
  })
  cy.visit(`/${tela}`)
})

Cypress.Commands.add('loginViaApi', (email, password) => {
  cy.login_api(email, password, 'home')
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
    nome:       `Produto Teste ${Date.now()}`,
    preco:      100,
    descricao:  'Produto criado por automação',
    quantidade: 50,
    ...overrides,
  }

  return cy.request({
    method:  'POST',
    url:     `${API}/produtos`,
    headers: { Authorization: token },
    body:    dados,
  }).then(({ body, status }) => {
    expect(status).to.eq(201)
    return { ...dados, _id: body._id }
  })
})


Cypress.Commands.add('adicionarAoCarrinhoApi', (produtos) => {
  const token = window.localStorage.getItem('serverest/userToken')
  return cy.request({
    method:  'POST',
    url:     `${API}/carrinhos`,
    headers: { Authorization: token },
    body:    { produtos },
  })
})

Cypress.Commands.add('concluirCompraApi', () => {
  const token = window.localStorage.getItem('serverest/userToken')
  return cy.request({
    method:  'DELETE',
    url:     `${API}/carrinhos/concluir-compra`,
    headers: { Authorization: token },
  })
})

Cypress.Commands.add('limparCarrinho', () => {
  const token = localStorage.getItem('serverest/userToken')
  cy.request({
    method:           'DELETE',
    url:              `${API}/carrinhos/cancelar-compra`,
    headers:          { Authorization: token },
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('semearCarrinho', (produto, amount = 1) => {
  const item = {
    _id:        produto._id,
    nome:       produto.nome,
    preco:      produto.preco,
    imagem:     produto.imagem,
    quantidade: produto.quantidade,
    descricao:  produto.descricao,
    amount,
  }
  cy.window().then((win) => {
    win.localStorage.setItem('products', JSON.stringify([item]))
  })
})