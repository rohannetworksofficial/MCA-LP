
// ============================================================
//  app.js — MCA Wall Climbing Lead Capture
//  Firebase Firestore (MCA collection)
// ============================================================
 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
 
// ────────────────────────────────────────────────
//  🔥 Firebase Config
//  Replace with your Firebase project credentials
// ────────────────────────────────────────────────
const firebaseConfig = {
   apiKey: "AIzaSyDnIwmC2NJD36EfAPSdZ6c6dnYB_ZuULrE",
  authDomain: "rohannetworks-b54e9.firebaseapp.com",
  projectId: "rohannetworks-b54e9",
  storageBucket: "rohannetworks-b54e9.firebasestorage.app",
  messagingSenderId: "572657691351",
  appId: "1:572657691351:web:0cc6e4139a8202b3ac5e92"
};
 
// ────────────────────────────────────────────────
//  Init Firebase
// ────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
 
// ────────────────────────────────────────────────
//  Expose submitLead() globally (called from HTML)
// ────────────────────────────────────────────────
window.submitLead = async function () {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const btn = document.getElementById("submit-btn");
  const btnText = document.getElementById("btn-text");
  const spinner = document.getElementById("btn-spinner");
 
  // ── Validation ──
  if (!firstName || !lastName || !email || !phone) {
    showAlert("error", "Please fill in all fields.");
    return;
  }
  if (!isValidEmail(email)) {
    showAlert("error", "Please enter a valid email address.");
    return;
  }
  if (!isValidPhone(phone)) {
    showAlert("error", "Please enter a valid phone number.");
    return;
  }
 
  // ── Loading state ──
  btn.disabled = true;
  btnText.textContent = "Booking...";
  spinner.classList.remove("hidden");
  hideAlert();
 
  try {
    // ── Save lead to Firestore (MCA collection) ──
    await addDoc(collection(db, "MCA"), {
      firstName,
      lastName,
      email,
      phone,
      submittedAt: serverTimestamp(),
      source: "mca-climbing-landing"
    });
 
    // ── Success ──
    showAlert("success", "✅ Booking confirmed! Check your email for details.");
    resetForm();
 
  } catch (err) {
    console.error("Firestore error:", err);
    showAlert("error", "Something went wrong. Please try again.");
  } finally {
    btn.disabled = false;
    btnText.textContent = "Book Now";
    spinner.classList.add("hidden");
  }
};
 
// ── Helpers ──
function showAlert(type, message) {
  const el = document.getElementById("form-alert");
  el.textContent = message;
  el.className = `form-alert ${type}`;
}
 
function hideAlert() {
  const el = document.getElementById("form-alert");
  el.className = "form-alert hidden";
}
 
function resetForm() {
  ["firstName", "lastName", "email", "phone"].forEach(id => {
    document.getElementById(id).value = "";
  });
}
 
function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}
 
function isValidPhone(val) {
  return /^[\d\s\+\-\(\)]{7,15}$/.test(val);
}