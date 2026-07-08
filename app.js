const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const CART_STORAGE_KEY = "hrb-cart";

const products = [
  {
    id: "hrb-11428585235",
    name: "Trocador de calor c/ suporte filtro oleo aluminio",
    oem: "11428585235",
    category: "Suspensao",
    tag: "Trocador de Calor",
    brand: "BMW",
    model: "320i",
    year: "2021",
    oldPrice: 1170,
    price: 900,
    image: "assets/product-trocador.png",
  },
  {
    id: "hrb-31306852149",
    name: "Bucha da bandeja dianteira reforcada premium",
    oem: "31306852149",
    category: "Suspensao",
    tag: "Buchas",
    brand: "BMW",
    model: "X1",
    year: "2022",
    oldPrice: 740,
    price: 629,
    image: "assets/product-trocador.png",
  },
  {
    id: "hrb-0004207800",
    name: "Pastilha de freio dianteira ceramica",
    oem: "0004207800",
    category: "Pastilhas de Freio",
    tag: "Freio",
    brand: "Mercedes-Benz",
    model: "C180",
    year: "2020",
    oldPrice: 690,
    price: 549,
    image: "assets/product-trocador.png",
  },
  {
    id: "hrb-5q0413031",
    name: "Amortecedor dianteiro pressurizado",
    oem: "5Q0413031",
    category: "Amortecedores",
    tag: "Amortecedor",
    brand: "Volkswagen",
    model: "Jetta",
    year: "2023",
    oldPrice: 980,
    price: 799,
    image: "assets/product-trocador.png",
  },
  {
    id: "hrb-06h905611",
    name: "Vela de ignicao iridium alta performance",
    oem: "06H905611",
    category: "Velas de Ignicao",
    tag: "Ignicao",
    brand: "Audi",
    model: "A3",
    year: "2024",
    oldPrice: 320,
    price: 249,
    image: "assets/product-trocador.png",
  },
  {
    id: "hrb-16117222391",
    name: "Bomba de combustivel eletrica completa",
    oem: "16117222391",
    category: "Bombas de Combustivel",
    tag: "Combustivel",
    brand: "BMW",
    model: "320i",
    year: "2023",
    oldPrice: 1320,
    price: 1090,
    image: "assets/product-trocador.png",
  },
  {
    id: "hrb-a2712030282",
    name: "Mangueira superior do radiador com engate rapido",
    oem: "A2712030282",
    category: "Mangueiras",
    tag: "Mangueira",
    brand: "Mercedes-Benz",
    model: "C180",
    year: "2021",
    oldPrice: 420,
    price: 339,
    image: "assets/product-trocador.png",
  },
  {
    id: "hrb-8v0615301",
    name: "Disco de freio ventilado dianteiro",
    oem: "8V0615301",
    category: "Discos de Freio",
    tag: "Disco de Freio",
    brand: "Audi",
    model: "A3",
    year: "2022",
    oldPrice: 820,
    price: 699,
    image: "assets/product-trocador.png",
  },
];

let activeCategory = "";
const cart = new Map(loadStoredCart());

const bestSellers = document.querySelector("#bestSellers");
const promotions = document.querySelector("#promotions");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const brandSelect = document.querySelector("#brandSelect");
const modelSelect = document.querySelector("#modelSelect");
const yearSelect = document.querySelector("#yearSelect");
const cartTotal = document.querySelector("#cartTotal");
const drawerTotal = document.querySelector("#drawerTotal");
const cartItems = document.querySelector("#cartItems");
const cartDrawer = document.querySelector("#cartDrawer");
const desktopNav = document.querySelector(".desktop-nav");

function productCard(product) {
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);

  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="tag">${product.tag}</span>
        <span class="discount">${discount}% OFF</span>
      </div>
      <div class="product-info">
        <div>
          <h3 class="product-name">${product.name}</h3>
          <p class="oem">OEM: ${product.oem}</p>
        </div>
        <div class="price-row">
          <div>
            <span class="old-price">${currency.format(product.oldPrice)}</span>
            <strong class="price">${currency.format(product.price)}</strong>
          </div>
          <button class="add-cart" type="button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">+</button>
        </div>
      </div>
    </article>
  `;
}

function currentFilters() {
  return {
    query: searchInput.value.trim().toLowerCase(),
    brand: brandSelect.value,
    model: modelSelect.value,
    year: yearSelect.value,
    category: activeCategory,
  };
}

function filterProducts() {
  const filters = currentFilters();

  return products.filter((product) => {
    const searchable = `${product.name} ${product.oem} ${product.category} ${product.brand} ${product.model}`.toLowerCase();
    const matchesQuery = !filters.query || searchable.includes(filters.query);
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesModel = !filters.model || product.model === filters.model;
    const matchesYear = !filters.year || product.year === filters.year;
    const matchesCategory = !filters.category || product.category === filters.category;

    return matchesQuery && matchesBrand && matchesModel && matchesYear && matchesCategory;
  });
}

function renderProducts() {
  const filtered = filterProducts();
  const fallback = filtered.length ? filtered : products;
  const promoList = [...fallback].sort((a, b) => b.oldPrice - b.price - (a.oldPrice - a.price));

  bestSellers.innerHTML = fallback.map(productCard).join("");
  promotions.innerHTML = promoList.map(productCard).join("");
}

function cartTotalValue() {
  return [...cart.entries()].reduce((total, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return total + (product ? product.price * quantity : 0);
  }, 0);
}

function loadStoredCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveStoredCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([...cart.entries()]));
}

function renderCart() {
  saveStoredCart();
  const total = cartTotalValue();
  cartTotal.textContent = currency.format(total);
  drawerTotal.textContent = currency.format(total);

  if (!cart.size) {
    cartItems.innerHTML = "<p>Seu carrinho esta vazio.</p>";
    return;
  }

  cartItems.innerHTML = [...cart.entries()]
    .map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);
      if (!product) return "";

      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" />
          <div>
            <strong>${product.name}</strong>
            <span>${quantity} x ${currency.format(product.price)}</span>
          </div>
          <button class="add-cart" type="button" data-remove="${product.id}" aria-label="Remover ${product.name}">-</button>
        </div>
      `;
    })
    .join("");
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function removeFromCart(id) {
  const quantity = cart.get(id) || 0;
  if (quantity <= 1) cart.delete(id);
  else cart.set(id, quantity - 1);
  renderCart();
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const removeButton = event.target.closest("[data-remove]");
  const scrollButton = event.target.closest("[data-scroll]");
  const categoryButton = event.target.closest("[data-category]");

  if (addButton) addToCart(addButton.dataset.add);
  if (removeButton) removeFromCart(removeButton.dataset.remove);

  if (scrollButton) {
    const rail = document.querySelector(`#${scrollButton.dataset.scroll}`);
    rail.scrollBy({
      left: Number(scrollButton.dataset.direction) * 312,
      behavior: "smooth",
    });
  }

  if (categoryButton) {
    activeCategory = categoryButton.dataset.category;
    document.querySelectorAll("[data-category]").forEach((button) => {
      button.classList.toggle("is-active", button === categoryButton && Boolean(activeCategory));
    });
    renderProducts();
    document.querySelector("#mais-vendidos").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const params = new URLSearchParams();
  const filters = currentFilters();

  if (filters.query) params.set("q", filters.query);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.model) params.set("model", filters.model);
  if (filters.year) params.set("year", filters.year);

  window.location.href = `resultados.html${params.toString() ? `?${params.toString()}` : ""}`;
});

document.querySelector("#cartButton").addEventListener("click", () => {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
});

document.querySelector("#closeCart").addEventListener("click", () => {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
});

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) {
    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
  }
});

document.querySelector("#menuToggle").addEventListener("click", () => {
  desktopNav.classList.toggle("is-open");
});

document.querySelector("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.elements.contact;
  const message = document.querySelector("#newsletterMessage");

  if (!input.value.trim()) {
    message.textContent = "Informe um e-mail ou WhatsApp para cadastrar.";
    return;
  }

  message.textContent = "Cadastro recebido. Em producao, este envio pode ir para WordPress, CRM ou WhatsApp.";
  input.value = "";
});

renderProducts();
renderCart();
