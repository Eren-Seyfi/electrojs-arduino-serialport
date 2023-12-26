let Name = document.getElementById("Name");
let Password = document.getElementById("Password");
let eyeBtn = document.getElementById("eyeBtn");

function passwordControl() {
  eyeBtn.innerHTML = "";
  if (Password.type == "text") {
    Password.type = "password";

    eyeBtn.innerHTML =
      ' <img src="../assets/images/hidden.png" class="hover:bg-slate-300 rounded-full p-1.5"   />';
  } else {
    Password.type = "text";
    eyeBtn.innerHTML =
      '  <img src="../assets/images/view.png" class="hover:bg-slate-300 rounded-full p-1.5"  />';
  }
}
