/* Cadastro — validação simples; no WordPress vira registro do WooCommerce */

const signupForm = document.querySelector("#signupForm");
const signupMessage = document.querySelector("#signupMessage");

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const password = signupForm.elements.password.value;
  const confirm = signupForm.elements.confirmPassword.value;

  if (password !== confirm) {
    signupMessage.textContent = "As senhas não coincidem.";
    signupForm.elements.confirmPassword.focus();
    return;
  }

  signupMessage.textContent = "Conta criada! Em produção este cadastro vai para o WooCommerce.";
  signupForm.reset();
});
