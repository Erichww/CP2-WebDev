// ─── DADOS DOS PRODUTOS ───────────────────────────────────────────────────────
const produtos = [
  {
    id: 1,
    brand: "SEGA",
    name: "Hatsune Miku",
    desc: "Action figure articulada com 32 pontos de articulação. Inclui acessórios a parte.",
    price: 599.99,
    badge: "BESTSELLER",
    img: "https://http2.mlstatic.com/D_NQ_NP_2X_741845-MLB108802426794_032026-F.webp"
  },
  {
    id: 2,
    brand: "Bandai Namco",
    name: "Chainsaw Man - Pochita",
    desc: "Figura premium, Acabamento pintado à mão.",
    price: 299.99,
    badge: "NOVO",
    img: "https://resize.cdn.otakumode.com/ex/700.525/shop/product/ba5136fea2414fcf87add6c672cbc1c6.jpg.webp"
  },
  {
    id: 3,
    brand: "Pokémon",
    name: "Piplup",
    desc: "Edição especial com efeitos de aura em acrílico.",
    price: 499.99,
    badge: "LIMITED",
    img: "https://http2.mlstatic.com/D_NQ_NP_2X_822391-MLB88653655295_072025-F.webp"
  },
  {
    id: 4,
    brand: "Bandai Banpresto",
    name: "Madoka Magica",
    desc: "Base inclusa figura não articulada.",
    price: 799.99,
    badge: "IMPORTADO",
    img: "https://kairosekiactionfigures.com.br/cdn/shop/files/2725387_2_700x.jpg?v=1745447666"
  },
  {
    id: 5,
    brand: "BANDAI",
    name: "Tony Chopper",
    desc: "Versão colecionável do comic #1. Capa plástica com 28cm de altura e base diorama.",
    price: 399.99,
    badge: "EXCLUSIVE",
    img: "https://m.media-amazon.com/images/I/61YMiLSOQ7L._AC_SX679_.jpg"
  }
];

// ─── EMOJIS CASO A IMAGEM NÃO CARREGUE
const fallbackEmoji = { 1: "🥒", 2: "🪚", 3: "🐧", 4: "🧚", 5: "🦌" };

// ─── CARRINHO GLOBAL ──────────────────────────────────────────────────────────
let carrinho = [];

// ─── RENDERIZAR CARDS NA INDEX ────────────────────────────────────────────────
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
          src="${produto.img}"
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

// ─── SELECIONAR / DESSELECIONAR CARD ─────────────────────────────────────────
function toggleSelecionarCard(card, id) {
  const jaSelecionado = carrinho.some(item => item.id === id);

  if (jaSelecionado) {
    carrinho = carrinho.filter(item => item.id !== id);
    card.classList.remove('selecionado');
    mostrarNotificacao('Item removido do carrinho', 'info');
  } else {
    const produto = produtos.find(p => p.id === id);
    carrinho.push({ ...produto });
    card.classList.add('selecionado');
    mostrarNotificacao(`${produto.name} adicionado!`, 'success');
  }

  atualizarBarraCarrinho();
}

// ─── ADICIONAR VIA BOTÃO ──────────────────────────────────────────────────────
function adicionarAoCarrinho(id) {
  const jaSelecionado = carrinho.some(item => item.id === id);
  if (jaSelecionado) {
    mostrarNotificacao('Já está no carrinho!', 'info');
    return;
  }
  const produto = produtos.find(p => p.id === id);
  carrinho.push({ ...produto });

  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (card) card.classList.add('selecionado');

  mostrarNotificacao(`${produto.name} adicionado!`, 'success');
  atualizarBarraCarrinho();
}

// ─── BARRA FLUTUANTE DO CARRINHO ──────────────────────────────────────────────
function atualizarBarraCarrinho() {
  let barra = document.getElementById('carrinhoFlutuante');

  if (!barra) {
    barra = document.createElement('div');
    barra.id = 'carrinhoFlutuante';
    barra.innerHTML = `
      <div class="barra-info">
        <span class="barra-icone">🛒</span>
        <span class="barra-texto"><span id="barraQtd">0</span> item(s) selecionado(s)</span>
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

  const qtd = carrinho.length;
  const total = carrinho.reduce((acc, item) => acc + item.price, 0);

  document.getElementById('barraQtd').textContent = qtd;
  document.getElementById('barraTotal').textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  localStorage.setItem('carrinhoMs', JSON.stringify(carrinho));

  barra.classList.toggle('visivel', qtd > 0);

  // Reset visual do botão de desconto ao mudar o carrinho
  const btn = document.getElementById('barraBtnDesconto');
  if (btn && !btn.disabled) {
    btn.textContent = '🏷️ Aplicar 10% de desconto';
  }
}

// ─── DESCONTO NA BARRA ────────────────────────────────────────────────────────
function aplicarDescontoBarra() {
  if (!carrinho.length) return;
  const btn = document.getElementById('barraBtnDesconto');
  const totalEl = document.getElementById('barraTotal');

  const totalComDesconto = carrinho.reduce((acc, item) => acc + item.price, 0) * 0.9;
  totalEl.textContent = `R$ ${totalComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  btn.textContent = '✓ Desconto aplicado!';
  btn.disabled = true;
  btn.style.opacity = '0.6';
  mostrarNotificacao('10% de desconto aplicado!', 'success');
}

// ─── CARRINHO NA LOJA.HTML ────────────────────────────────────────────────────
function renderizarCarrinho() {
  const lista = document.getElementById('carrinhoLista');
  const totalEl = document.getElementById('totalCompra');
  const totalFinalEl = document.getElementById('totalFinal');
  if (!lista) return;

  const itens = JSON.parse(localStorage.getItem('carrinhoMs') || '[]');
  const itensExibir = itens.length > 0 ? itens : [
    { id: 1, name: "Homem-Aranha Classic", price: 349.90, img: produtos[0].img },
    { id: 2, name: "Batman Dark Knight",   price: 429.90, img: produtos[1].img },
    { id: 3, name: "Goku Ultra Instinct",  price: 589.90, img: produtos[2].img }
  ];

  lista.innerHTML = '';
  itensExibir.forEach(item => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div class="cart-item-info">
        <img src="${item.img || ''}" alt="${item.name}" class="cart-item-img"
          onerror="this.style.display='none'" />
        <span class="item-name">${item.name}</span>
      </div>
      <span class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
    `;
    lista.appendChild(li);
  });

  const total = itensExibir.reduce((acc, item) => acc + item.price, 0);
  totalEl.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  totalFinalEl.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

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
  });
}
