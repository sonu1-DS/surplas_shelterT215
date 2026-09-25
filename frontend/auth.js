<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Surplus-to-Shelter</title>

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap"
>

<style>

*{
  box-sizing:border-box;
}

body{
  margin:0;
  font-family:"Bricolage Grotesque",system-ui,sans-serif;
  background:#f4f7f3;
  color:#17231f;
}

nav{
  min-height:70px;
  display:flex;
  align-items:center;
  padding:0 7%;
  background:#fff;
  border-bottom:1px solid #dce4dc;
}

.logo{
  font-size:22px;
  font-weight:800;
  color:#14463a;
  margin-right:auto;
}

nav a{
  margin-left:24px;
  text-decoration:none;
  color:#34473f;
  font-weight:600;
}

nav a:hover{
  color:#2f7d5b;
}

.hero{
  min-height:calc(100vh - 70px);
  display:grid;
  grid-template-columns:1.1fr .9fr;
  gap:55px;
  align-items:center;
  max-width:1200px;
  margin:auto;
  padding:55px 7%;
}

.eyebrow{
  display:inline-block;
  padding:8px 14px;
  background:#dff1e7;
  color:#17603a;
  border-radius:30px;
  font-weight:700;
  margin-bottom:18px;
}

h1{
  margin:0 0 18px;
  color:#14463a;
  font-size:58px;
  line-height:1.05;
}

.hero-text{
  color:#68766f;
  line-height:1.7;
  font-size:18px;
  max-width:620px;
}

.points{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:12px;
  margin-top:28px;
}

.point{
  background:#fff;
  border:1px solid #dce4dc;
  padding:16px;
  border-radius:13px;
}

.point b{
  color:#14463a;
  display:block;
  margin-bottom:4px;
}

.point span{
  color:#728078;
  font-size:13px;
}

.auth-card{
  background:#fff;
  border:1px solid #d7e1d9;
  border-radius:22px;
  padding:30px;
  box-shadow:0 18px 50px rgba(20,70,58,.10);
}

.auth-card h2{
  margin:0 0 7px;
  color:#14463a;
  font-size:28px;
}

.auth-card > p{
  color:#718078;
  margin:0 0 22px;
}

.role-title{
  font-size:14px;
  font-weight:800;
  color:#43574e;
  margin-bottom:10px;
}

.roles{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:10px;
  margin-bottom:22px;
}

.role{
  border:2px solid #dce5df;
  border-radius:13px;
  background:#fff;
  padding:15px 8px;
  text-align:center;
  cursor:pointer;
  transition:.2s;
  font-family:inherit;
}

.role:hover{
  border-color:#8eb5a0;
}

.role.active{
  border-color:#14463a;
  background:#eaf5ee;
}

.role-icon{
  display:block;
  font-size:25px;
  margin-bottom:5px;
}

.role b{
  display:block;
  color:#14463a;
}

.role small{
  color:#75827b;
}

.mode-tabs{
  display:grid;
  grid-template-columns:1fr 1fr;
  background:#edf3ef;
  padding:4px;
  border-radius:11px;
  margin-bottom:20px;
}

.mode-tab{
  border:none;
  background:transparent;
  padding:10px;
  border-radius:8px;
  cursor:pointer;
  font-family:inherit;
  font-weight:800;
  color:#637169;
}

.mode-tab.active{
  background:#fff;
  color:#14463a;
  box-shadow:0 2px 7px rgba(0,0,0,.05);
}

.field{
  margin-bottom:15px;
}

.field label{
  display:block;
  margin-bottom:7px;
  font-weight:700;
  color:#354b41;
}

.field input{
  width:100%;
  padding:13px 14px;
  border:1px solid #cbd7cf;
  border-radius:10px;
  font-family:inherit;
  font-size:15px;
  outline:none;
}

.field input:focus{
  border-color:#2f7d5b;
  box-shadow:0 0 0 3px rgba(47,125,91,.10);
}

.hidden{
  display:none !important;
}

.submit-btn{
  width:100%;
  border:none;
  border-radius:10px;
  background:#14463a;
  color:#fff;
  padding:14px;
  font-family:inherit;
  font-size:16px;
  font-weight:800;
  cursor:pointer;
  margin-top:4px;
}

.submit-btn:hover{
  background:#2f7d5b;
}

.submit-btn:disabled{
  opacity:.6;
  cursor:not-allowed;
}

.message{
  padding:12px 14px;
  border-radius:9px;
  margin-bottom:15px;
  font-size:14px;
  display:none;
}

.message.error{
  display:block;
  background:#fff0ed;
  color:#a33c2c;
  border:1px solid #efc0b8;
}

.message.success{
  display:block;
  background:#e9f5ed;
  color:#17603a;
  border:1px solid #bfdcc9;
}

.selected-role{
  margin-bottom:14px;
  padding:10px 12px;
  background:#fff8e8;
  border:1px solid #ead7a6;
  border-radius:9px;
  color:#76570c;
  font-size:13px;
}

.logged-box{
  text-align:center;
}

.logged-icon{
  font-size:45px;
  margin-bottom:10px;
}

.logged-box h3{
  margin:5px 0;
  color:#14463a;
}

.logged-box p{
  color:#6c7972;
}

.portal-btn{
  display:block;
  text-decoration:none;
  background:#14463a;
  color:#fff;
  padding:13px;
  border-radius:9px;
  font-weight:800;
  margin-top:15px;
}

.logout-btn{
  width:100%;
  margin-top:10px;
  padding:11px;
  background:#fff;
  border:1px solid #c9d5cd;
  border-radius:9px;
  color:#14463a;
  font-family:inherit;
  font-weight:800;
  cursor:pointer;
}

footer{
  text-align:center;
  padding:20px;
  color:#748078;
}

@media(max-width:900px){

  .hero{
    grid-template-columns:1fr;
  }

  h1{
    font-size:45px;
  }

}

@media(max-width:600px){

  nav a{
    display:none;
  }

  .hero{
    padding:35px 18px;
  }

  h1{
    font-size:38px;
  }

  .points{
    grid-template-columns:1fr;
  }

  .roles{
    grid-template-columns:1fr;
  }

  .role{
    display:flex;
    align-items:center;
    gap:12px;
    text-align:left;
  }

  .role-icon{
    margin:0;
  }

}

</style>
</head>


<body>

<nav>

  <div class="logo">
    🍲 Surplus-to-Shelter
  </div>

  <a href="map.html">
    Live Map
  </a>

  <a href="dashboard.html">
    Impact
  </a>

</nav>


<main class="hero">


<section>

  <div class="eyebrow">
    🌱 Real-Time Food Rescue
  </div>

  <h1>
    Rescue food.<br>
    Feed people.
  </h1>

  <p class="hero-text">

    Surplus-to-Shelter connects food donors,
    rescue drivers and shelters so surplus food
    reaches people instead of going to waste.

  </p>


  <div class="points">

    <div class="point">

      <b>
        🍱 Donate
      </b>

      <span>
        Post surplus food quickly.
      </span>

    </div>


    <div class="point">

      <b>
        🚗 Rescue
      </b>

      <span>
        Pick up and deliver food.
      </span>

    </div>


    <div class="point">

      <b>
        🏠 Receive
      </b>

      <span>
        Shelters receive smart matches.
      </span>

    </div>

  </div>

</section>


<!-- ==================================================
     LOGIN / SIGNUP
================================================== -->

<section class="auth-card">


<div id="authArea">

  <h2>
    Join the rescue network
  </h2>

  <p>
    Select your role and continue.
  </p>


  <div class="role-title">
    1. Choose your role
  </div>


  <div class="roles">


    <button
      class="role"
      data-role="donor">

      <span class="role-icon">
        🍱
      </span>

      <span>

        <b>
          Donor
        </b>

        <small>
          Donate food
        </small>

      </span>

    </button>


    <button
      class="role"
      data-role="driver">

      <span class="role-icon">
        🚗
      </span>

      <span>

        <b>
          Driver
        </b>

        <small>
          Rescue food
        </small>

      </span>

    </button>


    <button
      class="role"
      data-role="shelter">

      <span class="role-icon">
        🏠
      </span>

      <span>

        <b>
          Shelter
        </b>

        <small>
          Receive food
        </small>

      </span>

    </button>

  </div>


  <div
    id="selectedRole"
    class="selected-role">

    Select Donor, Driver or Shelter above.

  </div>


  <div class="mode-tabs">

    <button
      id="loginTab"
      class="mode-tab active">

      Login

    </button>

    <button
      id="signupTab"
      class="mode-tab">

      Create Account

    </button>

  </div>


  <div
    id="message"
    class="message">
  </div>


  <form id="authForm">


    <div
      id="nameField"
      class="field hidden">

      <label for="name">
        Full Name
      </label>

      <input
        id="name"
        type="text"
        placeholder="Enter your name"
      >

    </div>


    <div class="field">

      <label for="email">
        Email address
      </label>

      <input
        id="email"
        type="email"
        placeholder="you@example.com"
        required
      >

    </div>


    <div class="field">

      <label for="password">
        Password
      </label>

      <input
        id="password"
        type="password"
        placeholder="Minimum 6 characters"
        required
      >

    </div>


    <button
      id="submitBtn"
      class="submit-btn"
      type="submit">

      Login

    </button>

  </form>

</div>


<!-- ALREADY LOGGED IN -->

<div
  id="loggedArea"
  class="logged-box hidden">

  <div class="logged-icon">
    👋
  </div>

  <h3 id="loggedName">
    Welcome
  </h3>

  <p id="loggedRole">
  </p>

  <a
    id="portalLink"
    class="portal-btn"
    href="#">

    Open Portal →

  </a>

  <button
    id="logoutBtn"
    class="logout-btn">

    Logout

  </button>

</div>


</section>

</main>


<footer>
  Surplus-to-Shelter • AmiHacks 2026
</footer>


<script>

/* ==================================================
   SETTINGS
================================================== */

const API =
  "http://127.0.0.1:5000";


let selectedRole = null;

let mode =
  "login";


/* ==================================================
   ELEMENTS
================================================== */

const roleButtons =
  document.querySelectorAll(
    ".role"
  );

const selectedRoleBox =
  document.getElementById(
    "selectedRole"
  );

const loginTab =
  document.getElementById(
    "loginTab"
  );

const signupTab =
  document.getElementById(
    "signupTab"
  );

const nameField =
  document.getElementById(
    "nameField"
  );

const nameInput =
  document.getElementById(
    "name"
  );

const emailInput =
  document.getElementById(
    "email"
  );

const passwordInput =
  document.getElementById(
    "password"
  );

const submitBtn =
  document.getElementById(
    "submitBtn"
  );

const authForm =
  document.getElementById(
    "authForm"
  );

const message =
  document.getElementById(
    "message"
  );

const authArea =
  document.getElementById(
    "authArea"
  );

const loggedArea =
  document.getElementById(
    "loggedArea"
  );

const loggedName =
  document.getElementById(
    "loggedName"
  );

const loggedRole =
  document.getElementById(
    "loggedRole"
  );

const portalLink =
  document.getElementById(
    "portalLink"
  );

const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );


/* ==================================================
   ROLE
================================================== */

roleButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        selectedRole =
          button.dataset.role;


        roleButtons.forEach(
          item =>
            item.classList.remove(
              "active"
            )
        );


        button.classList.add(
          "active"
        );


        const labels = {

          donor:
            "🍱 Donor selected",

          driver:
            "🚗 Driver selected",

          shelter:
            "🏠 Shelter selected"

        };


        selectedRoleBox.textContent =
          labels[
            selectedRole
          ];

      }
    );

  }
);


/* ==================================================
   LOGIN / SIGNUP MODE
================================================== */

loginTab.onclick =
() => {

  mode =
    "login";

  loginTab.classList.add(
    "active"
  );

  signupTab.classList.remove(
    "active"
  );

  nameField.classList.add(
    "hidden"
  );

  nameInput.required =
    false;

  submitBtn.textContent =
    "Login";

  clearMessage();

};


signupTab.onclick =
() => {

  mode =
    "signup";

  signupTab.classList.add(
    "active"
  );

  loginTab.classList.remove(
    "active"
  );

  nameField.classList.remove(
    "hidden"
  );

  nameInput.required =
    true;

  submitBtn.textContent =
    "Create Account";

  clearMessage();

};


/* ==================================================
   MESSAGE
================================================== */

function clearMessage(){

  message.className =
    "message";

  message.textContent =
    "";

}


function showError(
  text
){

  message.className =
    "message error";

  message.textContent =
    text;

}


function showSuccess(
  text
){

  message.className =
    "message success";

  message.textContent =
    text;

}


/* ==================================================
   PORTAL
================================================== */

function rolePage(
  role
){

  if(
    role === "donor"
  ){

    return "donor.html";

  }


  if(
    role === "driver"
  ){

    return "driver.html";

  }


  if(
    role === "shelter"
  ){

    return "shelter.html";

  }


  return "index.html";

}


/* ==================================================
   AUTH FORM
================================================== */

authForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    clearMessage();


    if(
      !selectedRole
    ){

      showError(
        "Please select Donor, Driver or Shelter first."
      );

      return;

    }


    const email =
      emailInput.value
      .trim();

    const password =
      passwordInput.value;


    if(
      !email
      ||
      !password
    ){

      showError(
        "Enter email and password."
      );

      return;

    }


    if(
      password.length < 6
    ){

      showError(
        "Password must be at least 6 characters."
      );

      return;

    }


    submitBtn.disabled =
      true;

    submitBtn.textContent =
      mode === "login"
      ?
      "Logging in..."
      :
      "Creating account...";


    try {


      /* ==========================================
         LOGIN
      ========================================== */

      if(
        mode === "login"
      ){

        const response =
          await fetch(

            API
            +
            "/api/auth/login",

            {

              method:
                "POST",

              headers:{
                "Content-Type":
                  "application/json"
              },

              credentials:
                "include",

              body:
                JSON.stringify({

                  email,
                  password

                })

            }

          );


        const data =
          await response.json();


        if(
          !response.ok
        ){

          throw new Error(
            data.error
            ||
            "Login failed"
          );

        }


        /*
          Important:
          backend role is trusted,
          not the selected card.
        */

        const actualRole =
          data.user.role;


        if(
          actualRole !== selectedRole
        ){

          throw new Error(

            `This account is registered as ${actualRole}. Please select ${actualRole}.`

          );

        }


        showSuccess(
          "Login successful ✓"
        );


        setTimeout(
          () => {

            window.location.href =
              rolePage(
                actualRole
              );

          },
          300
        );

      }


      /* ==========================================
         REGISTER
      ========================================== */

      else {


        const name =
          nameInput.value
          .trim();


        if(
          !name
        ){

          throw new Error(
            "Enter your full name."
          );

        }


        const response =
          await fetch(

            API
            +
            "/api/auth/register",

            {

              method:
                "POST",

              headers:{
                "Content-Type":
                  "application/json"
              },

              credentials:
                "include",

              body:
                JSON.stringify({

                  name,
                  email,
                  password,
                  role:
                    selectedRole

                })

            }

          );


        const data =
          await response.json();


        if(
          !response.ok
        ){

          throw new Error(
            data.error
            ||
            "Could not create account"
          );

        }


        showSuccess(
          "Account created successfully ✓"
        );


        setTimeout(
          () => {

            window.location.href =
              rolePage(
                data.user.role
              );

          },
          300
        );

      }


    }

    catch(error){

      showError(
        error.message
      );

    }


    submitBtn.disabled =
      false;

    submitBtn.textContent =
      mode === "login"
      ?
      "Login"
      :
      "Create Account";

  }
);


/* ==================================================
   CHECK EXISTING LOGIN
================================================== */

async function checkLogin(){

  try {

    const response =
      await fetch(

        API
        +
        "/api/auth/me",

        {
          credentials:
            "include"
        }

      );


    if(
      !response.ok
    ){

      return;

    }


    const data =
      await response.json();


    if(
      !data.authenticated
      ||
      !data.user
    ){

      return;

    }


    authArea.classList.add(
      "hidden"
    );

    loggedArea.classList.remove(
      "hidden"
    );


    loggedName.textContent =
      `Welcome, ${data.user.name}`;


    loggedRole.textContent =
      `Logged in as ${data.user.role.toUpperCase()}`;


    portalLink.href =
      rolePage(
        data.user.role
      );


    portalLink.textContent =
      data.user.role === "donor"
      ?
      "Open Donor Portal →"
      :
      data.user.role === "driver"
      ?
      "Open Driver Portal →"
      :
      "Open Shelter Portal →";


  }

  catch(error){

    console.log(
      "Not logged in"
    );

  }

}


/* ==================================================
   LOGOUT
================================================== */

logoutBtn.onclick =
async () => {

  try {

    await fetch(

      API
      +
      "/api/auth/logout",

      {

        method:
          "POST",

        credentials:
          "include"

      }

    );

  }
  catch(error){

  }


  window.location.reload();

};


/* ==================================================
   START
================================================== */

checkLogin();

</script>

</body>
</html>