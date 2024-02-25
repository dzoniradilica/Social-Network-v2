const session = new Session();
const sessionID = session.getSession(document.cookie.substring(0, 4));

if (sessionID === '') window.location.href = '/';
