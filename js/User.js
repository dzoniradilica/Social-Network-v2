class User {
  userID = '';
  password = '';
  email = '';
  username = '';
  apiUrl = 'https://65d7959727d9a3bc1d7b607e.mockapi.io';

  async create() {
    let data = {
      username: this.username,
      password: this.password,
      email: this.email,
    };

    data = JSON.stringify(data);

    const res = await fetch(`${this.apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });

    return (data = await res.json());
  }

  async get() {
    const res = await fetch(`${this.apiUrl}/users`);
    const data = await res.json();

    return data;
  }

  async getSingleUser(userID) {
    try {
      const res = await fetch(`${this.apiUrl}/users/${userID}`);
      const data = await res.json();

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async changeUser(userID) {
    try {
      let data = {
        username: this.username,
        email: this.email,
      };

      data = JSON.stringify(data);

      const res = await fetch(`${this.apiUrl}/users/${userID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });

      data = await res.json();

      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
}
