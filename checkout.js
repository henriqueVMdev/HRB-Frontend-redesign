/* Checkout — mostra itens do carrinho (shared.js) e simula finalização */

const checkoutRail = document.querySelector("#checkoutRail");
const checkoutTotal = document.querySelector("#checkoutTotal");

function checkoutCard(product, quantity) {
  return `
    <a class="card checkout-card" href="produto.html?id=${product.id}" aria-label="${product.name}">
      <div class="card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="card-tag">${product.tag}</span>
        ${quantity > 1 ? `<span class="card-discount">${quantity}x</span>` : ""}
      </div>
      <div class="card-info">
        <div class="card-text">
          <h3 class="card-name">${product.name}</h3>
          <p class="card-oem">OEM: ${product.oem}</p>
        </div>
        <div class="card-price-row centered">
          <strong class="card-price">${currency.format(product.price * quantity)}</strong>
        </div>
      </div>
    </a>
  `;
}

function renderCheckout() {
  const entries = [...cart.entries()].filter(([id]) => productById(id));

  checkoutRail.innerHTML = entries.length
    ? entries.map(([id, quantity]) => checkoutCard(productById(id), quantity)).join("")
    : '<p class="cart-empty">Seu carrinho está vazio. <a href="index.html" style="color:var(--yellow)">Voltar à loja</a></p>';

  checkoutTotal.textContent = `Total : ${currency.format(cartTotalValue())}`;
}

document.querySelector("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("#checkoutMessage");

  if (!cart.size) {
    message.textContent = "Seu carrinho está vazio.";
    return;
  }

  /* ponytail: pagamento fake; no WooCommerce esse form vira o checkout nativo + gateway Mercado Pago */
  message.textContent = "Pedido recebido! Em produção você seria redirecionado ao Mercado Pago.";
  cart.clear();
  renderCart();
  renderCheckout();
});

document.addEventListener("DOMContentLoaded", renderCheckout);
