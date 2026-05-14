const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
 
const produtos = [
  {
    id: 1,
    brand: "SEGA",
    name: "Hatsune Miku",
    desc: "Action figure articulada com 32 pontos de articulação. Inclui acessórios a parte.",
    price: 599.99,
    badge: "BESTSELLER",
    img: "../src/assets/img/miku.jpg"
  },
  {
    id: 2,
    brand: "Bandai Namco",
    name: "Chainsaw Man - Pochita",
    desc: "Figura premium, Acabamento pintado à mão.",
    price: 299.99,
    badge: "NOVO",
    img: "../src/assets/img/pochita.jpg"
  },
  {
    id: 3,
    brand: "Pokémon",
    name: "Piplup",
    desc: "Edição especial com efeitos de aura em acrílico.",
    price: 499.99,
    badge: "LIMITED",
    img: "../src/assets/img/piplup.jpg"
  },
  {
    id: 4,
    brand: "Bandai Banpresto",
    name: "Madoka Magica",
    desc: "Base inclusa, figura não articulada.",
    price: 799.99,
    badge: "IMPORTADO",
    img: "../src/assets/img/madoka.jpg"
  },
  {
    id: 5,
    brand: "BANDAI",
    name: "Tony Chopper",
    desc: "Versão colecionável. Capa plástica com 28cm de altura e base diorama.",
    price: 399.99,
    badge: "EXCLUSIVE",
    img: "../src/assets/img/chopper.jpg"
  }
];
 
const fallbackEmoji = { 1: "🥒", 2: "🪚", 3: "🐧", 4: "🧚", 5: "🦌" };
 
let carrinho = [];
 
// renderiza os cards na index
function renderizarProdutos() {
  const grid = document.getElementById('produtosGrid');
  if (!grid) return;
 
  grid.innerHTML = '';
 
  produtos.forEach((produto) => {
    const card = document.createElement('article');
    card.className = 'card fade-in';
    card.dataset.id = produto.id;
 
    card.innerHTML = `
      <div class="card-img-wrap">
        <div class="card-badge">${produto.badge}</div>
        <img
          src="${basePath}${produto.img}"
          alt="${produto.name}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
        />
        <div class="card-img-fallback" style="display:none">${fallbackEmoji[produto.id]}</div>
        <div class="card-select-overlay"><span class="select-icon">✓ SELECIONADO</span></div>
      </div>
      <div class="card-body">
        <p class="card-brand">${produto.brand}</p>
        <h3 class="card-name">${produto.name}</h3>
        <p class="card-desc">${produto.desc}</p>
        <div class="card-footer">
          <span class="card-price">R$ ${produto.price.toFixed(2).replace('.', ',')}</span>
          <button class="btn-add" data-id="${produto.id}">+ CARRINHO</button>
        </div>
      </div>
    `;
 
    card.querySelector('.btn-add').addEventListener('click', (e) => {
      e.stopPropagation();
      adicionarAoCarrinho(produto.id);
    });
 
    card.addEventListener('click', () => toggleSelecionarCard(card, produto.id));
 
    grid.appendChild(card);
  });
 
  observarFadeIn();
  atualizarBarraCarrinho();
}
 
// clica no card pra selecionar ou remover
function toggleSelecionarCard(card, id) {
  const jaSelecionado = carrinho.some(item => item.id === id);
 
  if (jaSelecionado) {
    carrinho = carrinho.filter(item => item.id !== id);
    card.classList.remove('selecionado');
  } else {
    const produto = produtos.find(p => p.id === id);
    carrinho.push({ ...produto });
    card.classList.add('selecionado');
  }
 
  atualizarBarraCarrinho();
}
 
// botao + carrinho
function adicionarAoCarrinho(id) {
  if (carrinho.some(item => item.id === id)) return;
 
  const produto = produtos.find(p => p.id === id);
  carrinho.push({ ...produto });
 
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (card) card.classList.add('selecionado');
 
  atualizarBarraCarrinho();
}
 
// atualiza a barra flutuante
function atualizarBarraCarrinho() {
  let barra = document.getElementById('carrinhoFlutuante');
 
  if (!barra) {
    barra = document.createElement('div');
    barra.id = 'carrinhoFlutuante';
    barra.innerHTML = `
      <div class="barra-info">
        <span class="barra-icone">🛒</span>
        <span class="barra-texto"><span id="barraQtd">0</span> item(s)</span>
        <span class="barra-total">Total: <strong id="barraTotal">R$ 0,00</strong></span>
      </div>
      <div class="barra-acoes">
        <button class="barra-btn-desconto" id="barraBtnDesconto">🏷️ Aplicar 10% de desconto</button>
        <a class="barra-btn-ver" href="pages/loja.html">Ver Carrinho →</a>
      </div>
    `;
    document.body.appendChild(barra);
    document.getElementById('barraBtnDesconto').addEventListener('click', aplicarDescontoBarra);
  }
 
  const total = carrinho.reduce((acc, item) => acc + item.price, 0);
  document.getElementById('barraQtd').textContent = carrinho.length;
  document.getElementById('barraTotal').textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
 
  localStorage.setItem('carrinhoMs', JSON.stringify(carrinho));
  barra.classList.toggle('visivel', carrinho.length > 0);
 
  const btn = document.getElementById('barraBtnDesconto');
  if (btn && !btn.disabled) btn.textContent = '🏷️ Aplicar 10% de desconto';
}
 
// desconto na barra da index
function aplicarDescontoBarra() {
  if (!carrinho.length) return;
 
  const btn = document.getElementById('barraBtnDesconto');
  const totalEl = document.getElementById('barraTotal');
 
  const totalComDesconto = carrinho.reduce((acc, item) => acc + item.price, 0) * 0.9;
  totalEl.textContent = `R$ ${totalComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
 
  btn.textContent = '✓ Desconto aplicado!';
  btn.disabled = true;
  btn.style.opacity = '0.6';
}
 
// renderiza o carrinho na loja.html
function renderizarCarrinho() {
  const lista = document.getElementById('carrinhoLista');
  const totalEl = document.getElementById('totalCompra');
  const totalFinalEl = document.getElementById('totalFinal');
  if (!lista) return;
 
  const itens = JSON.parse(localStorage.getItem('carrinhoMs') || '[]');
 
  const itensExibir = itens.length > 0 ? itens : [
    { id: 1, name: "Hatsune Miku",          price: 599.99, img: "src/assets/img/miku.jpg"    },
    { id: 2, name: "Chainsaw Man - Pochita", price: 299.99, img: "src/assets/img/pochita.jpg" },
    { id: 3, name: "Piplup",                price: 499.99, img: "src/assets/img/piplup.jpg"  }
  ];
 
  function reRenderLista(listaAtual) {
    lista.innerHTML = '';
 
    listaAtual.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.dataset.id = item.id;
 
      li.innerHTML = `
        <div class="cart-item-info">
          <img src="${basePath}${item.img || ''}" alt="${item.name}" class="cart-item-img"
            onerror="this.style.display='none'" />
          <span class="item-name">${item.name}</span>
        </div>
        <div class="cart-item-acoes">
          <span class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
          <button class="btn-remover" data-id="${item.id}">✕ Remover</button>
        </div>
      `;
 
      lista.appendChild(li);
    });
 
    lista.querySelectorAll('.btn-remover').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const index = listaAtual.findIndex(i => i.id === id);
        if (index !== -1) listaAtual.splice(index, 1);
 
        localStorage.setItem('carrinhoMs', JSON.stringify(listaAtual));
 
        reRenderLista(listaAtual);
        recalcularTotal(listaAtual);
 
        descontado = false;
        btnDesconto.textContent = '🏷️ APLICAR 10% DE DESCONTO';
        btnDesconto.style.opacity = '1';
        btnDesconto.disabled = false;
        discountBadge.classList.remove('show');
      });
    });
  }
 
  function recalcularTotal(listaAtual) {
    const total = listaAtual.reduce((acc, item) => acc + item.price, 0);
    totalEl.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    totalFinalEl.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
 
  reRenderLista(itensExibir);
  recalcularTotal(itensExibir);
 
  const btnDesconto = document.getElementById('btnDesconto');
  const discountBadge = document.getElementById('discountBadge');
  if (!btnDesconto) return;
 
  let descontado = false;
 
  btnDesconto.addEventListener('click', () => {
    if (descontado) return;
 
    const totalComDesconto = itensExibir.reduce((acc, item) => acc + item.price, 0) * 0.9;
    totalFinalEl.textContent = `R$ ${totalComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
 
    discountBadge.classList.add('show');
    descontado = true;
    btnDesconto.textContent = '✓ DESCONTO APLICADO';
    btnDesconto.style.opacity = '0.6';
    btnDesconto.disabled = true;
  });
}
 
// animacao de scroll
function observarFadeIn() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08 });
 
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}
 
document.addEventListener('DOMContentLoaded', () => {
  renderizarProdutos();
  renderizarCarrinho();
  observarFadeIn();
});
