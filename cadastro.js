const signupForm = document.querySelector("#signupForm");
const signupMessage = document.querySelector("#signupMessage");

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const password = form.elements.password.value;
  const confirmPassword = form.elements.confirmPassword.value;

  if (password.length < 8) {
    signupMessage.textContent = "Use uma senha com pelo menos 8 caracteres.";
    return;
  }

  if (password !== confirmPassword) {
    signupMessage.textContent = "As senhas precisam ser iguais.";
    return;
  }

  const customer = {
    fullName: form.elements.fullName.value.trim(),
    email: form.elements.email.value.trim(),
    phone: form.elements.phone.value.trim(),
    document: form.elements.document.value.trim(),
  };

  localStorage.setItem("hrb-customer", JSON.stringify(customer));
  signupMessage.textContent = "Cadastro salvo localmente. Na integracao WordPress, isso vai para a conta do cliente.";
  form.reset();
});
