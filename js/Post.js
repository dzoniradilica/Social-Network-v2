class Post {
  userID = '';
  content = '';
  likes = 0;
  apiUrl = 'https://65d7959727d9a3bc1d7b607e.mockapi.io';

  async create() {
    let data = {
      user_id: this.userID,
      content: this.content,
      likes: this.likes,
    };

    data = JSON.stringify(data);

    const res = await fetch(`${this.apiUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });
    data = (await res).json();

    return data;
  }

  async getSinglePost(postID) {
    try {
      const res = await fetch(`${this.apiUrl}/posts/${postID}`);
      const data = await res.json();

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async getAll() {
    const res = await fetch(`${this.apiUrl}/posts`);
    const data = await res.json();

    return data;
  }

  async delete(postID) {
    try {
      let comment = new Comment();
      let singlePost = await this.getSinglePost(postID);
      let allCommetns = await comment.getAll();
      let relatedComm = allCommetns.filter(comm => comm.post_id === postID);

      relatedComm.forEach(comm => {
        comment.deleteComm(comm.id);
      });

      const res = await fetch(`${this.apiUrl}/posts/${postID}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      console.log(singlePost);
    } catch (err) {
      console.log(err);
    }
  }

  async changeLikes(postID) {
    try {
      let data = {
        likes: this.likes,
      };

      data = JSON.stringify(data);

      const res = await fetch(`${this.apiUrl}/posts/${postID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });

      data = await res.json();

      return data;
    } catch (err) {
      console.log(err);
    }
  }
}
