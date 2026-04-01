fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({email: "test@test.com", password: "password"})
}).then(r=>r.text()).then(console.log).catch(console.error);
