const socket = io();

const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const dom = {
  messageInput: document.querySelector(".input"),
  inputAvatar: document.querySelector(".chat-form-container .avatar"),
  dashboardMessage: document.querySelector("h1"),
  feed: document.querySelector(".feed"),
  sendButton: document.querySelector(".send-button"),
  dashboardList: document.querySelector(".dashboard-list"),
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

const addUsersToDashboard = (users) => {
  dom.dashboardList.innerHTML = "";
  for (user of users) {
    const dashboardMessage = document.createElement("li");
    const avatar = `<span class="avatar" style="background: ${user.avatar}; background-size: contain;"></span>`;

    dashboardMessage.innerHTML = `
        <div class="dashboard-list-message-text">
         ${avatar}
         ${user.username}
        </div>
    `;

    dom.dashboardList.appendChild(dashboardMessage);
  }
};

// user typed username in the login screen
socket.emit("typed username", { username });

dom.sendButton.onclick = (e) => {
  e.preventDefault();
  const message = dom.messageInput.value;
  // emit message to server
  socket.emit("chatMessage", ({message}));
};

socket.on("message", (message) => {
  console.log(message);
});

socket.on("new user joined", (users) => {
  addUsersToDashboard(users);
});

socket.on("user has left", (users) => {
  addUsersToDashboard(users);
});
