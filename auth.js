// Load Firebase from CDN (no install needed)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Pull config from the global window (loaded from firebase-config.js)
const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------- SIGN UP ----------
export async function signup(name, phone, email, password) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  // Save name on profile
  await updateProfile(user, { displayName: name });

  // Save extra info to Firestore
  await setDoc(doc(db, "users", user.uid), {
    name: name,
    phone: phone,
    email: email,
    createdAt: new Date().toISOString()
  });

  return user;
}

// ---------- LOGIN ----------
export async function login(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

// ---------- LOGOUT ----------
export async function logout() {
  await signOut(auth);
  window.location.href = "index.html";
}

// ---------- GET CURRENT USER ----------
export function watchAuth(callback) {
  onAuthStateChanged(auth, callback);
}

// ---------- GET USER PROFILE ----------
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

// ---------- PROTECT A PAGE ----------
export function requireLogin() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
}
