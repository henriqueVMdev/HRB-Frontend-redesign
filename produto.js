const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const CART_STORAGE_KEY = "hrb-cart";
const PRODUCT_ID = "hrb-11428585235";
const PRODUCT_PRICE = 1170.9;
const knownPrices = new Map([
  [PRODUCT_ID, PRODUCT_PRICE],
  ["hrb-11428585235-b", PRODUCT_PRICE],
  ["hrb-11428585235-c", PRODUCT_PRICE],
  ["hrb-11428585235-d", PRODUCT_PRICE],
  ["hrb-31306852149", 629],
  ["hrb-0004207800", 549],
  ["hrb-5q0413031", 799],
  ["hrb-06h905611", 249],
  ["hrb-16117222391", 1090],
  ["hrb-a2712030282", 339],
  ["hrb-8v0615301", 699],
]);

const cart = new Map(loadStoredCart());
const headerTotal = document.querySelector("#productHeaderTotal");
const mainImage = document.querySelector("#mainProductImage");
const reviewList = document.querySelector("#reviewList");
const commentForm = document.querySelector("#commentForm");
const commentCounter = document.querySelector("#commentCounter");

const reviews = [
  {
    name: "Ricardo Souza",
    date: "12 OUT 2023",
    text: "Instalado no meu G80 M3. Temperatura do cambio baixou quase 15 graus em uso de pista. Encaixe perfeito como o original.",
  },
  {
    name: "Ricardo Souza",
    date: "12 OUT 2023",
    text: "Produto muito bem acabado. Foi instalado sem adaptacoes e chegou embalado com cuidado.",
  },
  {
    name: "Ricardo Souza",
    date: "12 OUT 2023",
    text: "Atendimento rapido e a peca bateu com o codigo OEM informado.",
  },
];

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

function updateHeaderTotal() {
  const total = [...cart.entries()].reduce((sum, [id, quantity]) => {
    return sum + (knownPrices.get(id) || 0) * quantity;
  }, 0);

  headerTotal.textContent = currency.format(total);
}

function renderReviews() {
  reviewList.innerHTML = reviews
    .map(
      (review) => `
        <article class="review-card">
          <div>
            <span class="review-stars" aria-label="5 estrelas">
              <img src="assets/product-star.svg" alt="" />
              <img src="assets/product-star.svg" alt="" />
              <img src="assets/product-star.svg" alt="" />
              <img src="assets/product-star.svg" alt="" />
              <img src="assets/product-star.svg" alt="" />
            </span>
            <strong>${review.name}</strong>
          </div>
          <time>${review.date}</time>
          <p>"${review.text}"</p>
        </article>
      `,
    )
    .join("");
}

document.querySelector("#productThumbs").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-image]");
  if (!button) return;

  mainImage.src = button.dataset.image;
  document.querySelectorAll("#productThumbs button").forEach((thumb) => thumb.classList.toggle("is-active", thumb === button));
});

document.querySelector("#detailAddCart").addEventListener("click", () => {
  cart.set(PRODUCT_ID, (cart.get(PRODUCT_ID) || 0) + 1);
  saveStoredCart();
  updateHeaderTotal();
});

document.querySelector("#detailFavorite").addEventListener("click", (event) => {
  event.currentTarget.classList.toggle("is-active");
});

commentForm.elements.comment.addEventListener("input", (event) => {
  commentCounter.textContent = `${event.target.value.length} / 100`;
});

commentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = commentForm.elements.comment.value.trim();
  if (!text) return;

  reviews.unshift({
    name: "Cliente HRB",
    date: "Hoje",
    text,
  });
  commentForm.reset();
  commentCounter.textContent = "0 / 100";
  renderReviews();
});

renderReviews();
updateHeaderTotal();
