class Session {
  userID = '';

  createSession() {
    let date = new Date();
    date.setTime(date.getTime() + 2 * 24 * 60 * 60 * 1000);

    let expires = `expires=${date}`;

    document.cookie = `name=${this.userID}; ${expires}`;
  }

  getSession(cname) {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        console.log(name.length, c.length);
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
}
