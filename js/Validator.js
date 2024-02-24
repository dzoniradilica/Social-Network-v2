class Validator {
  constructor(configEl, registrationForm) {
    this.configEl = configEl;
    this.registrationForm = registrationForm;
    this.errors = {};

    this.setErrors();
    this.inputListener();
  }

  setErrors() {
    for (let key of Object.keys(this.configEl)) this.errors[key] = [];
  }

  inputListener() {
    for (let key of Object.keys(this.configEl)) {
      const el = this.registrationForm.querySelector(`input[name="${key}"]`);

      el.addEventListener('input', this.validate.bind(this));
    }
  }

  validate(e) {
    const configEl = this.configEl;
    const currentInput = e.target;
    const inputName = currentInput.getAttribute('name');
    const inputValue = currentInput.value;

    this.errors[inputName] = [];

    if (configEl[inputName].required && inputValue === '')
      this.errors[inputName].push('Polje je obavezno i ne moze biti prazno');

    if (
      configEl[inputName].minlength > inputValue.length ||
      configEl[inputName].maxlength < inputValue.length
    )
      this.errors[inputName].push(
        `Minimalno mozes napisati ${configEl[inputName].minlength} karaktera ili maksimalno ${configEl[inputName].maxlength} karaktera.`
      );
    if (configEl[inputName].email && !this.validateEmail(inputValue))
      this.errors[inputName].push('Neispravna email adresa');

    if (configEl[inputName].matching) {
      const matchingEl = configEl[inputName].matching;
      const matchingElValue = matchingEl.value;
      const matchingElName = matchingEl.getAttribute('name');

      if (matchingElValue !== inputValue)
        this.errors[inputName].push('Lozinke se moraju poklapati');

      if (matchingElValue === inputValue) this.errors[matchingElName] = [];
    }

    this.populateErrors();
  }

  populateErrors() {
    document.querySelectorAll('.errors').forEach(el => el.remove());

    for (let key of Object.keys(this.errors)) {
      const parentEl = this.registrationForm.querySelector(
        `input[name="${key}"]`
      ).parentElement;
      const lista = document.createElement('ul');
      lista.classList.add('errors');
      parentEl.appendChild(lista);

      this.errors[key].forEach(err => {
        const li = document.createElement('li');
        li.textContent = err;

        lista.appendChild(li);
      });
    }
  }

  validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }

    return false;
  }

  validationPassed() {
    for (let key of Object.keys(this.errors)) {
      if (this.errors[key].length > 0) return false;
    }

    return true;
  }
}
