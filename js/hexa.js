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

const addPosts = function (postsDiv, singlePost, author, currentUser) {
  let html = `
    <div class="single-post" data-post-id="${singlePost.id}">
      <div class="post-content">
        <p>${singlePost.content}</p>
      </div>

      <hr />

      <div class="post-info">
        <p class="author">Autor: ${author?.username}</p>

        <div class="post-btns-wrapper">
          <button data-likes-id="${singlePost.id}" class="likesBtn">
            <img src="img/like.png" />
          </button>
          <span>${singlePost.likes}</span>
          <span>Likes</span>

          <button data-comment-id="${singlePost.id}"  class="comment-other-btn">
            <img src="img/comment.png" />
          </button>
          <span>Comment</span>

          ${
            author.id === currentUser.id
              ? `<button class="removePost" data-remove-id="${singlePost.id}">Obrisi</button>`
              : ''
          }
        </div>
      </div>

        <hr />

        <div class="comment-form">
          <input type="text" id="commentInput" />
          <button  data-comment-id="${
            singlePost.id
          }" id="postComment">Napisi komentar</button>
        </div>
    </div>
`;

  postsDiv.insertAdjacentHTML('afterbegin', html);
};

const commentBtns = function () {
  const commentBtns = document.querySelectorAll('.comment-other-btn');
  commentBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();

      const comment = new Comment();

      const singlePostDiv = e.currentTarget.closest('.single-post');

      singlePostDiv.querySelector('.comment-form').style.display = 'block';

      e.currentTarget.setAttribute('disabled', true);

      document.querySelectorAll('#postComment').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();

          let commentContent = e.target.previousElementSibling;
          const postID = +e.target.dataset.commentId;

          comment.userID = sessionID;
          comment.postID = postID;
          comment.content = commentContent.value;

          let singlePost = e.target.closest('.single-post');
          let html = `
            <div class="comment-content">
              <p>${commentContent.value}</p>
            </div>
          `;

          singlePost.insertAdjacentHTML('beforeend', html);

          comment.create();

          singlePost.querySelector('.comment-form').style.display = 'none';
          singlePost.querySelector('.comment-form').innerHTML = '';
        });
      });
    });
  });
};

const likeBtns = function () {
  const likeBtn = document.querySelectorAll('.likesBtn');

  likeBtn.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();

      let post = new Post();
      let span = e.currentTarget.nextElementSibling;
      let spanNum = Number(span.textContent);
      let postID = +e.currentTarget.dataset.likesId;
      post.likes = ++spanNum;

      post.changeLikes(postID);

      span.textContent = post.likes;

      e.currentTarget.setAttribute('disabled', true);
    });
  });
};

const removePost = function () {
  document.querySelectorAll('.removePost').forEach(el => {
    el.addEventListener('click', e => {
      removePostData(e);
    });
  });
};

const removePostData = async function (e) {
  e.preventDefault();

  let post = new Post();
  let comment = new Comment();
  let postID = +e.target.dataset.removeId;
  let singlePost = e.target.closest('.single-post');
  let allCommetns = singlePost.querySelectorAll('.comment-content');

  allCommetns.forEach(singleComment => {
    let comment_id = Number(singleComment.getAttribute('data-comment-id'));

    comment.deleteComm(comment_id);
  });

  setTimeout(() => {
    post.delete(postID);
  }, 2000);

  e.target.closest('.single-post').remove();
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

    let postContent = document.querySelector('#contentPost');

    post.userID = sessionID;
    post.content = postContent.value;
    post.likes = 0;

    const postData = await post.create();

    postContent.value = '';

    let author = allUsers.find(
      singleUser => singleUser.id === postData.user_id
    );

    const postsDiv = document.querySelector('.posts-wrapper');

    addPosts(postsDiv, postData, author, currentUser);

    removePost();

    likeBtns();

    commentBtns();
  };

  createPost();
});

const displayAllPosts = async function () {
  const user = new User();
  const post = new Post();
  const allPosts = await post.getAll();
  let allUsers = await user.get();
  let currentUser = await user.getSingleUser(sessionID);

  const postsDiv = document.querySelector('.posts-wrapper');
  let author;
  allPosts.forEach(singlePost => {
    author = allUsers.find(singleUser => singleUser.id === singlePost.user_id);

    addPosts(postsDiv, singlePost, author, currentUser);
  });

  removePost();

  likeBtns();

  commentBtns();
};

const displayAllComments2 = function () {
  setTimeout(() => {
    const displayAllComments = async function () {
      let post = new Post();
      let comment = new Comment();
      let allPosts = await post.getAll();

      const allCommetns = await comment.getAll();

      document.querySelectorAll('.single-post').forEach((singlePost, i) => {
        const post_id = +singlePost.getAttribute('data-post-id');

        allCommetns.forEach(singleComment => {
          if (singleComment.post_id === post_id) {
            singlePost.innerHTML += `
              <div class="comment-content" data-comment-id="${singleComment.id}">
                <p>${singleComment.content}</p>
              </div>
            `;
          }
        });
      });

      removePost();

      likeBtns();

      commentBtns();
    };

    displayAllComments();
  }, 1000);
};

setUserData();
displayAllPosts();
displayAllComments2();
