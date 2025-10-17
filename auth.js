// Show Login/Register
document.getElementById("showLogin").addEventListener("click", () => {
  document.getElementById("registerBox").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
});

document.getElementById("showRegister").addEventListener("click", () => {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("registerBox").style.display = "block";
});

// Register User
document.getElementById("registerBtn").addEventListener("click", () => {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if(name && email && password){
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if(users.find(u => u.email === email)){
      alert("Email already registered!");
    } else {
      users.push({name, email, password});
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful!");
      document.getElementById("registerBox").style.display = "none";
      document.getElementById("loginBox").style.display = "block";
    }
  } else alert("Please fill all fields.");
});

// Login User
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if(user){
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("welcomeBox").style.display = "block";
    document.getElementById("userName").textContent = user.name;
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else alert("Incorrect email or password!");
});

// Logout User
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  document.getElementById("welcomeBox").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
});
