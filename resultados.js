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
    sku: "HRB12C12OC",
    tag: "Trocador de Calor",
    brand: "BMW",
    model: "320i",
    year: "2021",
    category: "Motor",
    maker: "HRB",
    price: 1170.9,
    pixPrice: 1060.99,
    image: "assets/result-product.png",
  },
  {
    id: "hrb-11428585235-b",
    name: "Trocador de calor c/ suporte filtro oleo aluminio",
    oem: "11428585235",
    sku: "HRB12C12OC",
    tag: "Trocador de Calor",
    brand: "BMW",
    model: "X1",
    year: "2022",
    category: "Suspensao dianteira",
    maker: "Bosch",
    price: 1170.9,
    pixPrice: 1060.99,
    image: "assets/result-product.png",
  },
  {
    id: "hrb-11428585235-c",
    name: "Trocador de calor c/ suporte filtro oleo aluminio",
    oem: "11428585235",
    sku: "HRB12C12OC",
    tag: "Trocador de Calor",
    brand: "Audi",
    model: "A3",
    year: "2023",
    category: "Sistema de Freio",
    maker: "Febi",
    price: 1170.9,
    pixPrice: 1060.99,
    image: "assets/result-product.png",
  },
  {
    id: "hrb-11428585235-d",
    name: "Trocador de calor c/ suporte filtro oleo aluminio",
    oem: "11428585235",
    sku: "HRB12C12OC",
    tag: "Trocador de Calor",
    brand: "Mercedes-Benz",
    model: "C180",
    year: "2024",
    category: "Suspensao traseira",
    maker: "Hengst",
    price: 1170.9,
    pixPrice: 1060.99,
    image: "assets/result-product.png",
  },
];

const cart = new Map(loadStoredCart());
const form = document.querySelector("#resultsFilterForm");
const resultsList = document.querySelector("#resultsList");
const headerTotal = document.querySelector("#resultsHeaderTotal");

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

function productById(id) {
  return products.find((product) => product.id === id);
}

function cartTotalValue() {
  return [...cart.entries()].reduce((total, [id, quantity]) => {
    const product = productById(id);
    return total + (product ? product.price * quantity : 0);
  }, 0);
}

function updateHeaderTotal() {
  headerTotal.textContent = currency.format(cartTotalValue());
}

function getCheckedValues(name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

function getFilters() {
  const data = new FormData(form);
  return {
    q: String(data.get("q") || "").trim().toLowerCase(),
    brand: String(data.get("brand") || ""),
    model: String(data.get("model") || ""),
    year: String(data.get("year") || ""),
    categories: getCheckedValues("category"),
    makers: getCheckedValues("maker"),
    minPrice: Number(data.get("minPrice") || 0),
    maxPrice: Number(data.get("maxPrice") || 0),
  };
}

function filteredProducts() {
  const filters = getFilters();

  return products.filter((product) => {
    const text = `${product.name} ${product.oem} ${product.sku} ${product.tag}`.toLowerCase();
    const matchesText = !filters.q || text.includes(filters.q);
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesModel = !filters.model || product.model === filters.model;
    const matchesYear = !filters.year || product.year === filters.year;
    const matchesCategory = !filters.categories.length || filters.categories.includes(product.category);
    const matchesMaker = !filters.makers.length || filters.makers.includes(product.maker);
    const matchesMin = !filters.minPrice || product.price >= filters.minPrice;
    const matchesMax = !filters.maxPrice || product.price <= filters.maxPrice;

    return matchesText && matchesBrand && matchesModel && matchesYear && matchesCategory && matchesMaker && matchesMin && matchesMax;
  });
}

function resultCard(product) {
  const integerPart = Math.floor(product.price).toLocaleString("pt-BR");
  const cents = String(Math.round((product.price % 1) * 100)).padStart(2, "0");

  return `
    <article class="result-card">
      <a class="result-image" href="produto.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" />
        <span>${product.tag}</span>
      </a>
      <div class="result-info">
        <div>
          <h2><a href="produto.html?id=${product.id}">${product.name}</a></h2>
          <div class="result-meta">
            <span>OEM: ${product.oem}</span>
            <b></b>
            <span>SKU: ${product.sku}</span>
          </div>
        </div>
        <p class="stock-dot">Em estoque - Envio imediato</p>
      </div>
      <div class="result-buy">
        <div class="result-price" aria-label="${currency.format(product.price)}">
          <span>R$</span>
          <strong>${integerPart}</strong>
          <em>,${cents}</em>
        </div>
        <p>ou 10x de ${currency.format(product.price / 10).replace("R$", "")}</p>
        <div class="pix-row"><span>Pix</span><strong>${currency.format(product.pixPrice)} a vista</strong></div>
        <button type="button" data-add="${product.id}">
          <img src="assets/result-add-icon.svg" alt="" />
          Adicionar
        </button>
        <button class="favorite-button" type="button">
          <img src="assets/result-favorite.svg" alt="" />
          Favoritar
        </button>
      </div>
    </article>
  `;
}

function renderResults() {
  const list = filteredProducts();
  resultsList.innerHTML = list.length
    ? list.map(resultCard).join("")
    : '<p class="empty-results">Nenhum produto encontrado com os filtros atuais.</p>';
}

function applyQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  const brand = params.get("brand");
  const model = params.get("model");
  const year = params.get("year");

  if (query) form.elements.q.value = query;
  if (brand) form.elements.brand.value = brand;
  if (model) form.elements.model.value = model;
  if (year) form.elements.year.value = year;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResults();
});

document.querySelector("#clearResultsFilters").addEventListener("click", () => {
  form.reset();
  form.elements.q.value = "Trocador de Calor";
  renderResults();
});

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (!addButton) return;

  cart.set(addButton.dataset.add, (cart.get(addButton.dataset.add) || 0) + 1);
  saveStoredCart();
  updateHeaderTotal();
});

applyQueryParams();
renderResults();
updateHeaderTotal();
