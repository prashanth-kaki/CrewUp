import { auth } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

function getValue(...ids) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el.value.trim();
  }
  return "";
}

export async function signupHandler(e) {
  e.preventDefault();

  const email = getValue("signupEmail", "email");
  const password = getValue("signupPassword", "password");

  if (!email || !password) {
    alert("Please provide an email and password.");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created successfully!");
    window.location.href = "login.html";
  } catch (err) {
    alert(err.message);
  }
}

export async function loginHandler(e) {
  e.preventDefault();

  const email = getValue("loginEmail", "login-email");
  const password = getValue("loginPassword", "login-password");

  if (!email || !password) {
    alert("Please provide an email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "profile.html";
  } catch (err) {
    alert(err.message);
  }
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", signupHandler);
}

const loginForm = document.getElementById("loginForm") || document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", loginHandler);
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in:", user.email);
  } else {
    console.log("User logged out");
  }
});
