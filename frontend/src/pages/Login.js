import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password
    });

    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br/>
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} /><br/>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;