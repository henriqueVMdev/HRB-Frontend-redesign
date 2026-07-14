/* Home — renderização dos trilhos de produtos, categorias e busca */

let activeCategory = "";

const bestSellers = document.querySelector("#bestSellers");
const promotions = document.querySelector("#promotions");
const searchForm = document.querySelector("#searchForm");

function renderProducts() {
  const filtered = activeCategory ? products.filter((p) => p.category === activeCategory) : products;
  const fallback = filtered.length ? filtered : products;
  const promoList = [...fallback].sort((a, b) => b.oldPrice - b.price - (a.oldPrice - a.price));

  bestSellers.innerHTML = fallback.map(productCard).join("");
  promotions.innerHTML = promoList.map(productCard).join("");
}

document.addEventListener("click", (event) => {
  const categoryButton = event.target.closest("[data-category]");
  if (!categoryButton) return;

  activeCategory = categoryButton.dataset.category;
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.classList.toggle("is-active", button === categoryButton && Boolean(activeCategory));
  });
  renderProducts();
  document.querySelector("#mais-vendidos").scrollIntoView({ behavior: "smooth", block: "start" });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const params = new URLSearchParams();
  for (const [key, value] of new FormData(searchForm)) {
    if (String(value).trim()) params.set(key, String(value).trim());
  }
  window.location.href = `resultados.html${params.toString() ? `?${params.toString()}` : ""}`;
});

document.querySelector("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.elements.contact;
  const message = document.querySelector("#newsletterMessage");

  if (!input.value.trim()) {
    message.textContent = "Informe um e-mail ou WhatsApp para cadastrar.";
    return;
  }

  message.textContent = "Cadastro recebido! Em breve você recebe nossas condições exclusivas.";
  input.value = "";
});

renderProducts();
