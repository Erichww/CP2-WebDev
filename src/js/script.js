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
