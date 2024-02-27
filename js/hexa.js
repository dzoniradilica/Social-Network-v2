const session = new Session();
const sessionID = session.getSession(document.cookie.substring(0, 4));

if (sessionID === '') window.location.href = '/';

const openModal = document.querySelector('#openModal2');
const closeModal = document.querySelector('#closeModal2');
const changeAccData = document.querySelector('#changeAccData');

const changeUsername = document.querySelector('#korisnicko_ime');
const changeEmail = document.querySelector('#email');
const changeBtn = document.querySelector('#changeProfile');

const logout = document.querySelector('#logout');
const deleteBtn = document.querySelector('#deleteProfile');
const btnPost = document.querySelector('#btnPost');

const addComments = function (commentsDiv, singlePost, author) {
  commentsDiv.innerHTML += `
        <div class="comments">
            <div class="comment-info-wrapper">
                <p class="comment-title">${singlePost.content}</p>
                <span class="author">Autor:${author.username}</span>
            </div>

            <div class="comment-inner-wrapper">
                <img src="img/like.png" alt="" /> <span>${singlePost.likes} Likes</span>
                <img src="img/comment.png" alt="" /> <span>Comments</span>
            </div> 
        </div>
    `;
};

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

  changeUsername.value = userData.username;
  changeEmail.value = userData.email;

  changeBtn.addEventListener('click', e => {
    e.preventDefault();

    profileEmail.textContent = changeEmail.value;
    profileName.textContent = changeUsername.value;

    changeAccData.style.display = 'none';

    const changeUserData = async function () {
      try {
        user.username = changeUsername.value;
        user.email = changeEmail.value;

        await user.changeUser(sessionID);
      } catch (err) {
        console.log(err);
      }
    };

    changeUserData();
  });
};

logout.addEventListener('click', e => {
  session.deleteSession();

  window.location.href = '/';
});

deleteBtn.addEventListener('click', e => {
  e.preventDefault();

  const deleteUser = async function () {
    let user = new User();

    user.delete(sessionID);
    session.deleteSession();

    window.location.href = '/';
  };
  deleteUser();
});

btnPost.addEventListener('click', e => {
  e.preventDefault();

  const createPost = async function () {
    let post = new Post();
    let user = new User();

    let currentUser = await user.getSingleUser(sessionID);

    let commentContent = document.querySelector('#contentComment');

    post.userID = sessionID;
    post.content = commentContent.value;
    post.likes = 0;

    const postData = await post.create();

    commentContent.value = '';

    const commentsDiv = document.querySelector('.comments-wrapper');
    addComments(commentsDiv, postData, currentUser);
  };

  createPost();
});

const displayAllPosts = async function () {
  const user = new User();
  const post = new Post();
  const allPosts = await post.getAll();
  let allUsers = await user.get();

  const commentsDiv = document.querySelector('.comments-wrapper');
  allPosts.forEach(singlePost => {
    let author = allUsers.find(
      singleUser => singleUser.id === singlePost.user_id
    );

    addComments(commentsDiv, singlePost, author);
  });
};

setUserData();
displayAllPosts();
