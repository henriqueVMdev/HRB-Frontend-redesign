const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const CART_STORAGE_KEY = "hrb-cart";
const DEMO_TOTAL = 19520.99;

const products = [
  {
    id: "hrb-11428585235",
    name: "Trocador de calor c/ suporte filtro oleo aluminio",
    oem: "11428585235",
    tag: "Trocador de Calor",
    price: 1170,
    image: "assets/checkout-product.png",
  },
  {
    id: "hrb-31306852149",
    name: "Trocador de calor c/ suporte filtro oleo aluminio",
    oem: "11428585235",
    tag: "Trocador de Calor",
    price: 1170,
    image: "assets/checkout-product.png",
  },
  {
    id: "hrb-0004207800",
    name: "Trocador de calor c/ suporte filtro oleo aluminio",
    oem: "11428585235",
    tag: "Trocador de Calor",
    price: 1170,
    image: "assets/checkout-product.png",
  },
  {
    id: "hrb-5q0413031",
    name: "Trocador de calor c/ suporte filtro oleo aluminio",
    oem: "11428585235",
    tag: "Trocador de Calor",
    price: 1170,
    image: "assets/checkout-product.png",
  },
];

const demoCart = products.map((product) => [product.id, 1]);
const storedCart = loadStoredCart();
const isDemoCheckout = storedCart.length === 0;
const cart = new Map(isDemoCheckout ? demoCart : storedCart);

const checkoutItems = document.querySelector("#checkoutItems");
const checkoutTotal = document.querySelector("#checkoutTotal");
const checkoutHeaderTotal = document.querySelector("#checkoutHeaderTotal");
const checkoutMessage = document.querySelector("#checkoutMessage");

function loadStoredCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveStoredCart() {
  if (isDemoCheckout) return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([...cart.entries()]));
}

function getProduct(id) {
  return products.find((product) => product.id === id) || products[0];
}

function totalValue() {
  if (isDemoCheckout) return DEMO_TOTAL;

  return [...cart.entries()].reduce((total, [id, quantity]) => {
    return total + getProduct(id).price * quantity;
  }, 0);
}

function checkoutCard([id, quantity]) {
  const product = getProduct(id);

  return `
    <article class="checkout-product-card">
      <div class="checkout-product-image">
        <img src="${product.image}" alt="${product.name}" />
        <span>${product.tag}</span>
      </div>
      <div class="checkout-product-copy">
        <h2>${product.name}</h2>
        <p>OEM: ${product.oem}</p>
        <strong>${currency.format(product.price * quantity)}</strong>
      </div>
    </article>
  `;
}

function renderCheckout() {
  saveStoredCart();
  checkoutItems.innerHTML = [...cart.entries()].map(checkoutCard).join("");
  const total = currency.format(totalValue());
  checkoutTotal.textContent = `Total : ${total}`;
  checkoutHeaderTotal.textContent = total;
}

document.querySelector("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  checkoutMessage.textContent =
    "Pedido preparado. Na integracao WordPress/WooCommerce, este botao envia para o checkout real ou Mercado Pago.";
});

renderCheckout();
