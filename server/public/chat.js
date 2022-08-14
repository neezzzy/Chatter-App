const socket = io();

// const { username } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });

const dom = {
  messageInput: document.querySelector(".input"),
  inputAvatar: document.querySelector(".chat-form-container .avatar"),
  dashboardMessage: document.querySelector("h1"),
  feed: document.querySelector(".feed"),
  sendButton: document.querySelector(".send-button"),
  dashboardList: document.querySelector(".dashboard-list"),
  feedback: document.querySelector(".feedback"),
};

const addMessage = ({ senderID, content, createdAt }, user) => {
  const [{ username, avatar }] = user;

  const messageEntry = document.createElement("li");
  const you = senderID === socket.id ? true : false;

  messageEntry.classList = `${
    you ? " message-display-left" : "message-display-right"
  }`;
  messageEntry.innerHTML = `
        <span class="avatar" style="background: ${avatar}; background-size: contain;"></span>
        <div class="message-body">
            <span class="user-name">${you ? "You" : username}</span>
            <time>@ ${createdAt}</time>
            <p>${content}</p>
        </div>
    `;

  dom.feed.appendChild(messageEntry);
  // scroll to the bottom of all chat messages
  const xHeight = dom.feed.scrollHeight;
  dom.feed.scrollTo(0, xHeight);
};

const updateUsersDashboard = (users) => {
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

dom.sendButton.onclick = (e) => {
  e.preventDefault();
  const message = dom.messageInput.value;

  if (!message) {
    $(".input").fadeOut(500).fadeIn(500);

  } else {
    socket.emit("chatMessage", { message });
    dom.messageInput.value = "";
    dom.messageInput.focus();
  }
};

socket.on("message", ({ newMessage, user }) => {
  dom.feedback.innerHTML = "";
  addMessage(newMessage, user);
});

socket.on("new user joined", ({ users }) => {
  updateUsersDashboard(users);
});
socket.on("user has left", (updatedUsers) => {
  updateUsersDashboard(updatedUsers);
});

dom.messageInput.addEventListener("keypress", () => {
  socket.emit("user typing", socket.id);
});

socket.on("user typing", (username) => {
  dom.feedback.innerHTML = "<p><em>" + username + " is typing...</em></p>";
});
