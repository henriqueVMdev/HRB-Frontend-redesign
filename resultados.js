/* Resultados — filtros + cards horizontais (usa catálogo/carrinho do shared.js) */

const form = document.querySelector("#resultsFilterForm");
const resultsList = document.querySelector("#resultsList");
const brandLogo = document.querySelector("#brandLogo");

/* ponytail: só temos o logo BMW no design; outros escondem a imagem */
const brandLogos = { BMW: "assets/figma/brand-bmw.svg" };

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
    engine: String(data.get("engine") || ""),
    categories: getCheckedValues("category"),
    makers: getCheckedValues("maker"),
    minPrice: Number(data.get("minPrice") || 0),
    maxPrice: Number(data.get("maxPrice") || 0),
  };
}

function filteredProducts() {
  const filters = getFilters();

  return products.filter((product) => {
    const text = `${product.name} ${product.oem} ${product.sku} ${product.tag} ${product.category}`.toLowerCase();
    return (
      (!filters.q || text.includes(filters.q)) &&
      (!filters.brand || product.brand === filters.brand) &&
      (!filters.model || product.model === filters.model) &&
      (!filters.year || product.year === filters.year) &&
      (!filters.engine || product.engine === filters.engine) &&
      (!filters.categories.length || filters.categories.includes(product.category)) &&
      (!filters.makers.length || filters.makers.includes(product.maker)) &&
      (!filters.minPrice || product.price >= filters.minPrice) &&
      (!filters.maxPrice || product.price <= filters.maxPrice)
    );
  });
}

function priceParts(value) {
  const integerPart = Math.floor(value).toLocaleString("pt-BR");
  const cents = String(Math.round((value % 1) * 100)).padStart(2, "0");
  return { integerPart, cents };
}

function resultCard(product) {
  const { integerPart, cents } = priceParts(product.price);
  const installment = (product.price / 10).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return `
    <article class="result-card reveal is-visible">
      <a class="result-image" href="produto.html?id=${product.id}" aria-label="${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="card-tag">${product.tag}</span>
      </a>
      <div class="result-info">
        <div class="result-headline">
          <h2><a href="produto.html?id=${product.id}">${product.name}</a></h2>
          <div class="result-meta">
            <span>OEM: ${product.oem}</span>
            <i></i>
            <span>SKU: ${product.sku}</span>
          </div>
        </div>
        <p class="stock-row"><span class="stock-dot"></span>Em estoque - Envio imediato</p>
      </div>
      <div class="result-buy">
        <div class="result-pricing">
          <div class="result-price" aria-label="${currency.format(product.price)}">
            <span>R$</span>
            <strong>${integerPart}</strong>
            <em>,${cents}</em>
          </div>
          <p class="installment">ou 10x de ${installment}</p>
          <div class="pix-row">
            <span class="pix-badge">Pix</span>
            <strong>${currency.format(pixPrice(product))} à vista</strong>
          </div>
        </div>
        <div class="result-actions">
          <button class="yellow-button add-button" type="button" data-add="${product.id}">
            <img src="assets/figma/cart-icon-24.svg" alt="" aria-hidden="true" />
            Adicionar
          </button>
          <button class="favorite-button" type="button" data-favorite>
            <img src="assets/figma/heart.svg" alt="" aria-hidden="true" />
            Favoritar
          </button>
        </div>
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
  for (const key of ["q", "brand", "model", "year", "engine"]) {
    const value = params.get(key);
    if (value && form.elements[key]) form.elements[key].value = value;
  }
  const category = params.get("category");
  if (category) {
    form.querySelectorAll('input[name="category"]').forEach((input) => {
      input.checked = input.value === category;
    });
  }
  updateBrandLogo();
}

function updateBrandLogo() {
  const brand = form.elements.brand.value;
  const logo = brandLogos[brand];
  brandLogo.src = logo || "";
  brandLogo.style.visibility = logo ? "visible" : "hidden";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResults();
});

form.addEventListener("change", (event) => {
  if (event.target.name === "brand") updateBrandLogo();
  renderResults(); /* filtros reativos: aplica ao mudar */
});

document.querySelector("#clearResultsFilters").addEventListener("click", () => {
  form.reset();
  updateBrandLogo();
  renderResults();
});

document.addEventListener("click", (event) => {
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) favorite.classList.toggle("is-active");
});

applyQueryParams();
renderResults();
