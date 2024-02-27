class Comment {
  userID = '';
  postID = '';
  content = '';
  apiUrl = 'https://65d8d0b7c96fbb24c1bc5dec.mockapi.io';

  async create() {
    let data = {
      post_id: this.postID,
      user_id: this.userID,
      content: this.content,
    };

    data = JSON.stringify(data);

    const res = await fetch(`${this.apiUrl}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });

    data = await res.json();

    console.log(data);
  }
}
