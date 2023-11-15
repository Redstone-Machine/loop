import React from 'react';

const Login = () => {
  return (
    <div>
      <h1>Logga in på Loop</h1>
      <button>Logga in med Apple</button>
      <button>Logga in med Google</button>
      <form>
        <label htmlFor="username">Användarnamn:</label>
        <input type="text" id="username" name="username" />
        <br />
        <label htmlFor="password">Lösenord:</label>
        <input type="password" id="password" name="password" />
        <br />
        <button>Logga in</button>
      </form>
      <button>Skapa ett konto</button>
    </div>
  );
};

export default Login;