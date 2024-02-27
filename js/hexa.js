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

const addComments = function (commentsDiv, singlePost, author, currentUser) {
  const html = `
    <div class="comments">
        <div class="comment-info-wrapper">
            <p class="comment-title">${singlePost.content}</p>
            <span class="author">Autor:${author?.username}</span>
        </div>

        <div class="comment-inner-wrapper">
            <img  data-likes-id="${
              singlePost.id
            }" src="img/like.png" class="likesBtn" style="cursor: pointer;" /> <span>${
    singlePost.likes
  }</span> <span>Likes</span>

            <button class="comment-other-btn" data-comment-id="${
              singlePost.id
            }" style="display: flex;
            padding: 0;
            height: 40px;
            background-color: transparent;
            border: none;
            flex-direction: row;
            align-content: center;
            align-items: center;
            color: white;"><img data-comment-id="${
              singlePost.id
            }" src="img/comment.png"/> <span data-comment-id="${
    singlePost.id
  }">Comments</span></button>

            ${
              author.id === currentUser.id
                ? `<button class="removeComment" data-remove-id="${singlePost.id}">Obrisi</button>`
                : ''
            }
        </div> 
    </div>
`;

  commentsDiv.insertAdjacentHTML('afterbegin', html);
};

const removePost = function (e) {
  e.preventDefault();

  let post = new Post();
  let postID = +e.target.dataset.removeId;

  post.delete(postID);

  e.target.closest('.comments').remove();
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
    let allUsers = await user.get();
    let currentUser = await user.getSingleUser(sessionID);

    let commentContent = document.querySelector('#contentComment');

    post.userID = sessionID;
    post.content = commentContent.value;
    post.likes = 0;

    const postData = await post.create();

    commentContent.value = '';

    let author = allUsers.find(
      singleUser => singleUser.id === postData.user_id
    );

    const commentsDiv = document.querySelector('.comments-wrapper');

    addComments(commentsDiv, postData, author, currentUser);

    document.querySelectorAll('.removeComment').forEach(el => {
      el.addEventListener('click', e => {
        removePost(e);
      });
    });
  };

  createPost();
});

const displayAllPosts = async function () {
  const user = new User();
  const post = new Post();
  const allPosts = await post.getAll();
  let allUsers = await user.get();
  let currentUser = await user.getSingleUser(sessionID);

  const commentsDiv = document.querySelector('.comments-wrapper');
  let author;
  allPosts.forEach(singlePost => {
    author = allUsers.find(singleUser => singleUser.id === singlePost.user_id);

    addComments(commentsDiv, singlePost, author, currentUser);
  });

  document.querySelectorAll('.removeComment').forEach(el => {
    el.addEventListener('click', e => {
      removePost(e);
    });
  });

  if (document.querySelectorAll('.comment-other-btn')) {
    const commentBtns = document.querySelectorAll('.comment-other-btn');

    commentBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();

        const postID = +e.target.dataset.commentId;
        const comment = new Comment();
        const commentText = prompt('Napisi komentar');
        const commentsDiv = e.target.closest('.comments');

        comment.userID = sessionID;
        comment.postID = postID;
        comment.content = commentText;

        comment.create();

        if (!commentText) {
          console.log('greska');
        } else {
          commentsDiv.innerHTML += `
            <div id="otherCommentWritten">
                <p>${commentText}</p>
            </div>
            `;
        }
      });
    });
  }

  if (document.querySelector('.likesBtn')) {
    const likeBtn = document.querySelectorAll('.likesBtn');

    likeBtn.forEach(btn => {
      btn.addEventListener('click', e => {
        let post = new Post();
        let span = e.target.nextElementSibling;
        let spanNum = Number(span.textContent);
        let postID = +e.target.dataset.likesId;
        post.likes = ++spanNum;

        post.changeLikes(postID);

        span.textContent = post.likes;
      });
    });
  }
};

setUserData();
displayAllPosts();
