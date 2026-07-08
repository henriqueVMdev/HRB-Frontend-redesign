const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = loginForm.elements.email.value.trim();
  const password = loginForm.elements.password.value;

  if (!email || !password) {
    loginMessage.textContent = "Informe login e senha para continuar.";
    return;
  }

  const savedCustomer = JSON.parse(localStorage.getItem("hrb-customer") || "null");
  const customerName = savedCustomer?.fullName || email;

  localStorage.setItem("hrb-session", JSON.stringify({ email, customerName, loggedAt: new Date().toISOString() }));
  loginMessage.textContent = "Login local realizado. Na integracao WordPress, isso sera autenticacao real.";
});
