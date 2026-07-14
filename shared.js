/* ==========================================================================
   HRB Imports — núcleo compartilhado (catálogo, carrinho, header, popups)
   Carregar em TODAS as páginas antes do script da página.
   ========================================================================== */

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const CART_STORAGE_KEY = "hrb-cart";

/* Catálogo único — em produção vem do WooCommerce (wp REST / loop de produtos) */
const products = [
  {
    id: "hrb-11428585235",
    name: "Trocador de calor c/ suporte filtro óleo alumínio",
    oem: "11428585235",
    sku: "HRB12C12OC",
    tag: "Trocador de Calor",
    brand: "BMW",
    model: "320i",
    year: "2021",
    engine: "2.0 Turbo",
    category: "Suspensão",
    maker: "HRB",
    oldPrice: 1170.9,
    price: 900,
    image: "assets/figma/produto.png",
  },
  {
    id: "hrb-31306852149",
    name: "Bucha da bandeja dianteira reforçada premium",
    oem: "31306852149",
    sku: "HRB31BUCHA",
    tag: "Buchas",
    brand: "BMW",
    model: "X1",
    year: "2022",
    engine: "2.0 Turbo",
    category: "Suspensão",
    maker: "Febi",
    oldPrice: 740,
    price: 629,
    image: "assets/figma/produto.png",
  },
  {
    id: "hrb-0004207800",
    name: "Pastilha de freio dianteira cerâmica",
    oem: "0004207800",
    sku: "HRB00PAST",
    tag: "Freio",
    brand: "Mercedes-Benz",
    model: "C180",
    year: "2020",
    engine: "1.6",
    category: "Pastilhas de Freio",
    maker: "Bosch",
    oldPrice: 690,
    price: 549,
    image: "assets/figma/produto.png",
  },
  {
    id: "hrb-5q0413031",
    name: "Amortecedor dianteiro pressurizado",
    oem: "5Q0413031",
    sku: "HRB5QAMOR",
    tag: "Amortecedor",
    brand: "Volkswagen",
    model: "Jetta",
    year: "2023",
    engine: "2.0 Turbo",
    category: "Amortecedores",
    maker: "HRB",
    oldPrice: 980,
    price: 799,
    image: "assets/figma/produto.png",
  },
  {
    id: "hrb-06h905611",
    name: "Vela de ignição iridium alta performance",
    oem: "06H905611",
    sku: "HRB06VELA",
    tag: "Ignição",
    brand: "Audi",
    model: "A3",
    year: "2024",
    engine: "2.0 Turbo",
    category: "Velas de Ignição",
    maker: "Bosch",
    oldPrice: 320,
    price: 249,
    image: "assets/figma/produto.png",
  },
  {
    id: "hrb-16117222391",
    name: "Bomba de combustível elétrica completa",
    oem: "16117222391",
    sku: "HRB16BOMB",
    tag: "Combustível",
    brand: "BMW",
    model: "320i",
    year: "2023",
    engine: "3.0",
    category: "Bombas de Combustível",
    maker: "HRB",
    oldPrice: 1320,
    price: 1090,
    image: "assets/figma/produto.png",
  },
  {
    id: "hrb-a2712030282",
    name: "Mangueira superior do radiador com engate rápido",
    oem: "A2712030282",
    sku: "HRBA2MANG",
    tag: "Mangueira",
    brand: "Mercedes-Benz",
    model: "C180",
    year: "2021",
    engine: "1.6",
    category: "Mangueiras",
    maker: "Hengst",
    oldPrice: 420,
    price: 339,
    image: "assets/figma/produto.png",
  },
  {
    id: "hrb-8v0615301",
    name: "Disco de freio ventilado dianteiro",
    oem: "8V0615301",
    sku: "HRB8VDISC",
    tag: "Disco de Freio",
    brand: "Audi",
    model: "A3",
    year: "2022",
    engine: "2.0 Turbo",
    category: "Discos de Freio",
    maker: "Febi",
    oldPrice: 820,
    price: 699,
    image: "assets/figma/produto.png",
  },
];

function productById(id) {
  return products.find((product) => product.id === id);
}

function pixPrice(product) {
  return product.price * 0.9; /* 10% OFF no PIX */
}

/* ---------------- Carrinho (localStorage) ---------------- */

function loadStoredCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

const cart = new Map(loadStoredCart());

function saveStoredCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([...cart.entries()]));
}

function cartTotalValue() {
  return [...cart.entries()].reduce((total, [id, quantity]) => {
    const product = productById(id);
    return total + (product ? product.price * quantity : 0);
  }, 0);
}

function addToCart(id, { open = true } = {}) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  if (open) openCartDrawer();
}

function removeFromCart(id) {
  const quantity = cart.get(id) || 0;
  if (quantity <= 1) cart.delete(id);
  else cart.set(id, quantity - 1);
  renderCart();
}

/* ---------------- Drawer do carrinho + popup de login (injetados) ---------------- */

function injectOverlays() {
  if (document.querySelector("#cartDrawer")) return;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <aside class="cart-drawer" id="cartDrawer" aria-hidden="true">
      <div class="cart-panel">
        <div class="cart-head">
          <h2>Meu Carrinho</h2>
          <button type="button" class="close-cart" id="closeCart" aria-label="Fechar carrinho">&rsaquo;</button>
        </div>
        <div id="cartItems" class="cart-items"></div>
        <div class="price-details">
          <h3>Price Details</h3>
          <div class="price-line"><span>Total Product Price</span><span id="drawerSubtotal">R$ 0,00</span></div>
          <div class="price-line"><span>Total Discounts</span><span id="drawerDiscount">R$ 0,00</span></div>
          <div class="price-line total"><span>Order Total</span><strong id="drawerTotal">R$ 0,00</strong></div>
        </div>
        <a class="pill-button cart-finish" href="checkout.html">Finalizar Compra</a>
      </div>
    </aside>
    <div class="login-overlay" id="loginOverlay" aria-hidden="true">
      <div class="login-popup" role="dialog" aria-label="Login">
        <button type="button" class="close-cart" id="closeLogin" aria-label="Fechar login">&times;</button>
        <img class="login-logo" src="assets/figma/footer-logo.svg" alt="HRB Imports" />
        <form class="login-form" id="loginForm">
          <label class="input-field">
            <span>E-mail</span>
            <input type="email" name="email" placeholder="seu@email.com" required />
          </label>
          <label class="input-field">
            <span>Senha</span>
            <input type="password" name="password" placeholder="********" required />
          </label>
          <div class="login-actions">
            <span class="hint">Não tem uma Conta?</span>
            <a class="pill-button ghost" href="cadastro.html">Cadastre-se</a>
            <button class="pill-button" type="submit">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  `;
  while (wrapper.firstElementChild) document.body.appendChild(wrapper.firstElementChild);
}

function openCartDrawer() {
  const drawer = document.querySelector("#cartDrawer");
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeCartDrawer() {
  const drawer = document.querySelector("#cartDrawer");
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
}

function renderCart() {
  saveStoredCart();
  const total = cartTotalValue();
  const subtotal = [...cart.entries()].reduce((sum, [id, quantity]) => {
    const product = productById(id);
    return sum + (product ? product.oldPrice * quantity : 0);
  }, 0);

  document.querySelectorAll("#cartTotal").forEach((el) => (el.textContent = currency.format(total)));
  const drawerTotal = document.querySelector("#drawerTotal");
  const drawerSubtotal = document.querySelector("#drawerSubtotal");
  const drawerDiscount = document.querySelector("#drawerDiscount");
  if (drawerTotal) drawerTotal.textContent = currency.format(total);
  if (drawerSubtotal) drawerSubtotal.textContent = currency.format(subtotal);
  if (drawerDiscount) drawerDiscount.textContent = currency.format(subtotal - total);

  const cartItems = document.querySelector("#cartItems");
  if (!cartItems) return;

  if (!cart.size) {
    cartItems.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
    return;
  }

  cartItems.innerHTML = [...cart.entries()]
    .map(([id, quantity]) => {
      const product = productById(id);
      if (!product) return "";
      return `
        <div class="cart-item">
          <a class="cart-item-image" href="produto.html?id=${product.id}">
            <span class="mini-tag">${product.tag}</span>
            <img src="${product.image}" alt="${product.name}" />
          </a>
          <div class="cart-item-info">
            <strong>${product.name}</strong>
            <div class="cart-qty">
              <span>Qt. :</span>
              <button type="button" data-remove="${product.id}" aria-label="Remover uma unidade">−</button>
              <b>${String(quantity).padStart(2, "0")}</b>
              <button type="button" data-add-quiet="${product.id}" aria-label="Adicionar uma unidade">+</button>
            </div>
            <div class="cart-item-bottom">
              <span class="cart-item-price">${currency.format(product.price * quantity)}</span>
              <button type="button" class="remove-pill" data-remove-all="${product.id}">Remover</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

/* ---------------- Card de produto (fiel ao Figma, clicável → produto) ---------------- */

function productCard(product) {
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);

  return `
    <a class="card" href="produto.html?id=${product.id}" aria-label="${product.name}">
      <div class="card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="card-tag">${product.tag}</span>
        ${discount >= 5 ? `<span class="card-discount">${discount}% OFF</span>` : ""}
      </div>
      <div class="card-info">
        <div class="card-text">
          <h3 class="card-name">${product.name}</h3>
          <p class="card-oem">OEM: ${product.oem}</p>
        </div>
        <div class="card-price-row">
          <div class="card-prices">
            <span class="card-old-price">${currency.format(product.oldPrice)}</span>
            <strong class="card-price">${currency.format(product.price)}</strong>
          </div>
          <button class="card-add" type="button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">
            <img src="assets/figma/cart-add-icon.svg" alt="" aria-hidden="true" />
          </button>
        </div>
      </div>
    </a>
  `;
}

/* ---------------- Sliders (setas + dots reativos) ---------------- */

function setupSliders() {
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const railId = slider.dataset.slider;
    const rail = document.querySelector(`#${railId}`);
    const dotsBox = slider.querySelector("[data-dots]");

    const pageCount = () => (rail ? Math.max(1, Math.ceil(rail.scrollWidth / rail.clientWidth)) : 1);
    const currentPage = () => (rail ? Math.round(rail.scrollLeft / rail.clientWidth) : 0);

    function renderDots() {
      if (!dotsBox) return;
      const pages = pageCount();
      const current = Math.min(currentPage(), pages - 1);
      dotsBox.innerHTML = Array.from(
        { length: pages },
        (_, i) => `<span class="slider-dot${i === current ? " is-active" : ""}" data-page="${i}"></span>`,
      ).join("");
    }

    slider.querySelectorAll("[data-dir]").forEach((arrow) => {
      arrow.addEventListener("click", () => {
        if (!rail) return;
        rail.scrollBy({ left: Number(arrow.dataset.dir) * rail.clientWidth, behavior: "smooth" });
      });
    });

    if (dotsBox) {
      dotsBox.addEventListener("click", (event) => {
        const dot = event.target.closest("[data-page]");
        if (!dot || !rail) return;
        rail.scrollTo({ left: Number(dot.dataset.page) * rail.clientWidth, behavior: "smooth" });
      });
    }

    if (rail) {
      rail.addEventListener("scroll", () => requestAnimationFrame(renderDots), { passive: true });
      new ResizeObserver(renderDots).observe(rail);
      /* re-renderiza quando os cards são inseridos */
      new MutationObserver(renderDots).observe(rail, { childList: true });
    }
    renderDots();
  });
}

/* ---------------- Reveal on scroll ---------------- */

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ---------------- Eventos globais ---------------- */

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const addQuiet = event.target.closest("[data-add-quiet]");
  const removeButton = event.target.closest("[data-remove]");
  const removeAll = event.target.closest("[data-remove-all]");

  if (removeAll) {
    cart.delete(removeAll.dataset.removeAll);
    renderCart();
    return;
  }

  if (addButton) {
    event.preventDefault(); /* dentro do <a class="card"> não navega */
    event.stopPropagation();
    addButton.classList.add("added");
    addButton.addEventListener("animationend", () => addButton.classList.remove("added"), { once: true });
    addToCart(addButton.dataset.add);
    return;
  }
  if (addQuiet) addToCart(addQuiet.dataset.addQuiet, { open: false });
  if (removeButton) removeFromCart(removeButton.dataset.remove);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeCartDrawer();
  const login = document.querySelector("#loginOverlay");
  if (login) {
    login.classList.remove("is-open");
    login.setAttribute("aria-hidden", "true");
  }
});

function setupChrome() {
  injectOverlays();

  const cartButton = document.querySelector("#cartButton");
  if (cartButton) cartButton.addEventListener("click", openCartDrawer);

  document.querySelector("#closeCart").addEventListener("click", closeCartDrawer);
  document.querySelector("#cartDrawer").addEventListener("click", (event) => {
    if (event.target.id === "cartDrawer") closeCartDrawer();
  });

  const loginOverlay = document.querySelector("#loginOverlay");
  const loginButton = document.querySelector("#loginButton");
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      loginOverlay.classList.add("is-open");
      loginOverlay.setAttribute("aria-hidden", "false");
    });
  }
  document.querySelector("#closeLogin").addEventListener("click", () => {
    loginOverlay.classList.remove("is-open");
    loginOverlay.setAttribute("aria-hidden", "true");
  });
  loginOverlay.addEventListener("click", (event) => {
    if (event.target === loginOverlay) {
      loginOverlay.classList.remove("is-open");
      loginOverlay.setAttribute("aria-hidden", "true");
    }
  });
  document.querySelector("#loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    /* ponytail: login fake no front; no WordPress vira wp_login_form / WooCommerce my-account */
    window.location.href = "conta.html";
  });

  renderCart();
  setupSliders();
  setupReveal();

  /* #login na URL abre o popup (ex.: link "Faça Login" do cadastro) */
  if (window.location.hash === "#login" && loginOverlay) {
    loginOverlay.classList.add("is-open");
    loginOverlay.setAttribute("aria-hidden", "false");
  }
}

document.addEventListener("DOMContentLoaded", setupChrome);
