/* Detalhes do Produto — popula a página a partir de ?id= (catálogo do shared.js) */

const params = new URLSearchParams(window.location.search);
const product = productById(params.get("id")) || products[0];

document.title = `${product.name} — HRB Imports Auto Parts`;
document.querySelector("#productName").textContent = product.name.toUpperCase();
document.querySelector("#productCategory").textContent = `${product.category} // ${product.tag}`;
document.querySelector("#productOem").textContent = `OEM: ${product.oem}`;
document.querySelector("#productSku").textContent = `SKU: ${product.sku}`;
document.querySelector("#productPrice").textContent = currency.format(product.price);
document.querySelector("#productInstallments").textContent =
  `OU 12X DE ${currency.format(product.price / 12)} SEM JUROS NO CARTÃO`;

const mainImage = document.querySelector("#mainProductImage");
const reviewList = document.querySelector("#reviewList");
const commentForm = document.querySelector("#commentForm");
const commentCounter = document.querySelector("#commentCounter");

const reviews = [
  {
    name: "Ricardo Souza",
    date: "12 OUT 2023",
    text: "Instalado no meu G80 M3. Temperatura do câmbio baixou quase 15 graus em uso de pista. Encaixe perfeito como o original.",
  },
  {
    name: "Ricardo Souza",
    date: "12 OUT 2023",
    text: "Instalado no meu G80 M3. Temperatura do câmbio baixou quase 15 graus em uso de pista. Encaixe perfeito como o original.",
  },
  {
    name: "Ricardo Souza",
    date: "12 OUT 2023",
    text: "Instalado no meu G80 M3. Temperatura do câmbio baixou quase 15 graus em uso de pista. Encaixe perfeito como o original.",
  },
];

function renderReviews() {
  reviewList.innerHTML = reviews
    .map(
      (review) => `
        <article class="review-card">
          <div class="review-head">
            <div>
              <span class="review-stars" aria-label="5 estrelas">
                ${'<img src="assets/figma/star.svg" alt="" />'.repeat(5)}
              </span>
              <strong>${review.name}</strong>
            </div>
            <time>${review.date}</time>
          </div>
          <p>"${review.text}"</p>
        </article>
      `,
    )
    .join("");
}

document.querySelector("#productThumbs").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-image]");
  if (!button) return;

  mainImage.style.opacity = "0";
  setTimeout(() => {
    mainImage.src = button.dataset.image;
    mainImage.style.opacity = "1";
  }, 180);
  document
    .querySelectorAll("#productThumbs button")
    .forEach((thumb) => thumb.classList.toggle("is-active", thumb === button));
});

document.querySelector("#detailAddCart").addEventListener("click", () => {
  addToCart(product.id);
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

  reviews.unshift({ name: "Cliente HRB", date: "Hoje", text });
  commentForm.reset();
  commentCounter.textContent = "0 / 100";
  renderReviews();
});

renderReviews();
