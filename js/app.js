const config = {
  korisnicko_ime: {
    required: true,
    minlength: 5,
    maxlength: 20,
  },

  email: {
    required: true,
    email: true,
    minlength: 5,
    maxlength: 50,
  },

  lozinka: {
    required: true,
    minlength: 5,
    maxlength: 20,
    matching: ponovi_lozinku,
  },

  ponovi_lozinku: {
    required: true,
    minlength: 5,
    maxlength: 20,
    matching: lozinka,
  },
};

const openModal = document.querySelector('#openModal');
const closeModal = document.querySelector('#closeModal');
const registrationForm = document.querySelector('#registrationForm');

openModal.addEventListener('click', () => {
  registrationForm.style.display = 'block';
});

closeModal.addEventListener('click', e => {
  e.preventDefault();

  registrationForm.style.display = 'none';
});

let validator = new Validator(config, registrationForm);
