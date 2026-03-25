import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    await axios.post("http://localhost:5000/api/auth/register", {
      name,
      email,
      password
    });

    alert("Registered!");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} /><br/>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br/>
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} /><br/>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;