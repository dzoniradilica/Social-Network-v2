const session = new Session();
const sessionID = session.getSession(document.cookie.substring(0, 4));

if (sessionID) window.location.href = 'hexa.html';

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

const createUser = async function () {
  registrationForm.addEventListener('submit', e => {
    e.preventDefault();

    const username = document.querySelector('#korisnicko_ime').value;
    const password = document.querySelector('#lozinka').value;
    const email = document.querySelector('#email').value;

    const user = new User();

    user.email = email;
    user.password = password;
    user.username = username;

    user.create().then(data => {
      const session = new Session();
      session.userID = data.id;
      session.createSession();

      window.location.href = 'hexa.html';
    });
  });
};

const loginUser = async function () {
  document.querySelector('#loginForm').addEventListener('submit', e => {
    e.preventDefault();

    const user = new User();
    const loginEmail = document.querySelector('#loginEmail');
    const loginPassword = document.querySelector('#loginPassword');

    user.email = loginEmail.value;
    user.password = loginPassword.value;

    user.login();
  });
};

createUser();
loginUser();
