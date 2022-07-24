const socket = io();

const dom = {
  nameInput: document.querySelector(".input"),
  joinButton: document.querySelector(".join-button"),
  inputAvatar: document.querySelector(".chat-form-container .avatar"),
  dashboardMessage: document.querySelector("h1"),
  feed: document.querySelector(".feed"),
  sendButton: document.querySelector(".send-button"),
  dashboard: document.querySelector(".dashboard"),
};

const user = {
  name: null,
  avatar: null,
};

const fetchRandomAvatar = () => {
  const size = Math.floor(Math.random() * 100) + 25;

  return `url(https://www.placecage.com/${size}/${size})`;
};

const addEntry = ({ user, message }, you) => {
  const entry = document.createElement("li");
  const date = new Date();

  entry.classList = `message-entry${you ? " message-entry-own" : ""}`;
  entry.innerHTML = `
        <span class="avatar" style="background: ${
          user.avatar
        }; background-size: contain;"></span>
        <div class="message-body">
            <span class="user-name">${you ? "You" : user.name}</span>
            <time>@ ${date.getHours()}:${date.getMinutes()}</time>
            <p>${message}</p>
        </div>
    `;

  dom.feed.appendChild(entry);

  const xH = dom.feed.scrollHeight;
  dom.feed.scrollTo(0, xH);
};

const addUserToDashboard = (user) => {
  const dashboardMessage = document.createElement("li");
  const message = `${user.name} has joined the chat`;

  const avatar = `<span class="avatar" style="background: ${user.avatar}; background-size: contain;"></span>`;

  dashboardMessage.classList = "user-is-online-message";
  dashboardMessage.innerHTML = `
        <div class="dashboard-message-text">
            ${avatar}
            ${message}
        </div>
    `;

  dom.dashboard.appendChild(dashboardMessage);
};

const enterChannel = () => {
  const avatar = fetchRandomAvatar();
  const name = dom.nameInput.value;

  dom.joinButton.remove();

  dom.sendButton.style.display = "block";
  dom.nameInput.value = "";
  dom.nameInput.placeholder = "Send a message...";

  dom.inputAvatar.innerText = "";
  dom.inputAvatar.style.backgroundImage = avatar;
  dom.inputAvatar.style.backgroundSize = "contain";

  user.name = name;
  user.avatar = avatar;

  addUserToDashboard({ avatar, name });

  socket.emit("user connected", {
    name,
    avatar,
  });
};

socket.on("user connected", (payload) => addUserToDashboard(payload));

socket.on("send message", (payload) => {
  addEntry(payload);
});

dom.joinButton.onclick = (e) => {
  e.preventDefault();

  if (!dom.nameInput.value) {
    dom.nameInput.parentElement.classList.add("error");
  } else {
    enterChannel();
  }
};

dom.sendButton.onclick = (e) => {
  e.preventDefault();
  const message = dom.nameInput.value;

  socket.emit("send message", {
    message,
    user,
  });

  addEntry({ user, message }, true);
  dom.nameInput.value = "";
  e.target.value = "";
};
