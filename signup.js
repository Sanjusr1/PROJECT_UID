document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  // Password validation rules
  const errors = [];
  if (password.length < 10) {
    errors.push("• At least 10 characters");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("• At least one special character");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("• At least one uppercase letter");
  }

  if (errors.length > 0) {
    alert("Password must contain:\n" + errors.join("\n"));
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  alert("Sign up successful! Redirecting to homepage...");
  window.location.href = "exp2.html";
});
