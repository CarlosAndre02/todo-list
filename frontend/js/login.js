import validator from "validator";

const validateFields = (e) => {
  e.preventDefault();

  const form = e.target;
  const emailInput = form.querySelector('input[name="email"]');
  const passwordInput = form.querySelector('input[name="password"]');

  if (!validator.isEmail(emailInput.value))
    return showErrorMessage("Email inválido", form);

  if (passwordInput.value.length < 3 || passwordInput.value.length > 50)
    return showErrorMessage("Senha precisa ter entre 3 e 50 caracteres", form);

  form.submit();
};

const showErrorMessage = (errorMessage, form) => {
  const errorMessageElement = form.querySelector(".error-message");
  errorMessageElement.classList.add("active");
  errorMessageElement.innerText = errorMessage;
};

const formElements = document.querySelectorAll(".form-login");
for (let form of formElements) {
  form.addEventListener("submit", validateFields);
}
