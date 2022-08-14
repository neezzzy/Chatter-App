const usernameEl = document.querySelector("#username");
const form = document.querySelector("#login");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = usernameEl.value.trim();
  if (username === "") {
    showError(username, "Username cannot be blank.");
  } else {
    login(username);
  }
});

const showError = (input, message) => {
  const formField = document.querySelector("#error-message");
  formField.innerHTML = message;
  $("#error-message").show().delay(5000).fadeOut();
};

const login = (username) => {
  $.ajax({
    type: "POST",
    url: "/",
    data: $("#login").serialize(),
  }).done(function(){
    window.location.href = "chat.html";
  });

  // window.location.href = `chat.html`;
};
