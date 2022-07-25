const socket = io();

const dom = {
  nameInput: document.querySelector(".input"),
  joinButton: document.querySelector(".join-button"),
  inputAvatar: document.querySelector(".chat-form-container .avatar"),
  dashboardMessage: document.querySelector("h1"),
  feed: document.querySelector(".feed"),
  sendButton: document.querySelector(".send-button"),
  dashboardList: document.querySelector(".dashboard-list"),
};

const user = {
  name: null,
  avatar: null,
};

const fetchRandomAvatar = () => {
  const size = Math.floor(Math.random() * 100) + 25;
  return `url(https://www.placecage.com/${size}/${size})`;
};

const addChatMessage = ({ user, message }, you) => {
  const entry = document.createElement("li");
  const date = new Date();

  entry.classList = `${
    you ? " message-display-left" : "message-display-right"
  }`;
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
  // scroll to the bottom of all chat messages
  const xHeight = dom.feed.scrollHeight;
  dom.feed.scrollTo(0, xHeight);
};

const addUserToDashboard = (user) => {
  const dashboardMessage = document.createElement("li");
  const avatar = `<span class="avatar" style="background: ${user.avatar}; background-size: contain;"></span>`;

  dashboardMessage.innerHTML = `
        <div class="dashboard-list-message-text">
            ${avatar}
            ${user.name}
        </div>
    `;

  dom.dashboardList.appendChild(dashboardMessage);
};

const enterChat = () => {
  const avatar = fetchRandomAvatar();
  const name = dom.nameInput.value;

  dom.joinButton.remove();

  dom.sendButton.style.display = "block";
  dom.nameInput.value = "";
  dom.nameInput.placeholder = "Send a message...";

  dom.inputAvatar.innerText = "";
  dom.inputAvatar.style.backgroundImage = avatar;
  dom.inputAvatar.style.backgroundSize = "contain";
  // adding values to the user object
  user.name = name;
  user.avatar = avatar;

  addUserToDashboard({ avatar, name });

  socket.emit("user connected", {
    name,
    avatar,
  });
};

socket.on("user connected", (payload) => {
  addUserToDashboard(payload);
});

// recipient receives the chat message and it displays for them
socket.on("send message", (payload) => {
  addChatMessage(payload);
});

dom.joinButton.onclick = (e) => {
  e.preventDefault();

  if (!dom.nameInput.value) {
    dom.nameInput.parentElement.classList.add("error");
  } else {
    enterChat();
  }
};

dom.sendButton.onclick = (e) => {
  e.preventDefault();
  const message = dom.nameInput.value;

  // original sender sends the chat message
  if (message) {
    socket.emit("send message", {
      message,
      user,
    });
    addChatMessage({ user, message }, true);
    dom.nameInput.value = "";
    e.target.value = "";
  } else {
    dom.nameInput.parentElement.classList.add("error");
  }
};
