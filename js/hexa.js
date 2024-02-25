const session = new Session();
const sessionID = session.getSession(document.cookie.substring(0, 4));

if (sessionID === '') window.location.href = '/';

const openModal = document.querySelector('#openModal2');
const closeModal = document.querySelector('#closeModal2');
const changeAccData = document.querySelector('#changeAccData');

openModal.addEventListener('click', () => {
  changeAccData.style.display = 'block';
});

closeModal.addEventListener('click', e => {
  e.preventDefault();

  changeAccData.style.display = 'none';
});

const setUserData = async function () {
  const user = new User();

  const profileName = document.querySelector('.profile-name');
  const profileEmail = document.querySelector('.profile-email');

  const userData = await user.getSingleUser(sessionID);

  profileEmail.textContent = userData.email;
  profileName.textContent = userData.username;
};

setUserData();
