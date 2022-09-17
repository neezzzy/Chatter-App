const dom = {
  messageInput: document.querySelector('.input'),
  inputAvatar: document.querySelector('.chat-form-container .avatar'),
  dashboardMessage: document.querySelector('h1'),
  feed: document.querySelector('.feed'),
  sendButton: document.querySelector('.send-button'),
  dashboardList: document.querySelector('.dashboard-list'),
  feedback: document.querySelector('.feedback'),
};

const app = {
  rooms: function () {
    const socket = io('/rooms', { transports: ['websocket'] });

    // When socket connects, get a list of chatrooms
    socket.on('connect', function () {
      // Update rooms list upon emitting updateRoomsList event
      socket.on('updateRoomsList', function (room) {
        // Display an error message upon a user error(i.e. creating a room with an existing title)
        $('.room-create p.message').remove();
        if (room.error != null) {
          $('.room-create').append(`<p>${room.error}</p>`);
        } else {
          app.helpers.updateRoomsList(room);
        }
      });

      // Whenever the user hits the create button, emit createRoom event.
      $('.room-create-btn').on('click', function (e) {
        const inputEle = $("input[name='title']");
        const roomTitle = inputEle.val().trim();
        if (roomTitle !== '') {
          socket.emit('createRoom', roomTitle);
          inputEle.val('');
        }
      });
    });
  },

  chat: function (roomId, username) {
    const socket = io('/chatroom', { transports: ['websocket'] });

    // When socket connects, join the current chatroom
    socket.on('connect', function () {
      socket.emit('join', roomId);

      // Update users list upon emitting updateUsersList event
      socket.on('updateUsersList', function (users, clear) {
        $('.container p.message').remove();
        if (users.error != null) {
          $('.container').html(`<p class="message error">${users.error}</p>`);
        } else {
          app.helpers.updateUsersList(users, clear);
        }
      });

      // Whenever the user hits the save button, emit newMessage event.
      $('.send-button').on('click', function (e) {
        const inputEle = $("input[name='message']");
        const messageContent = inputEle.val().trim();
        if (messageContent !== '') {
          const message = {
            content: messageContent,
            username: username,
            date: Date.now(),
          };

          socket.emit('newMessage', roomId, message);
          inputEle.val('');
          app.helpers.addMessage(message, socket.id);
        }
      });

      // Whenever a user leaves the current room, remove the user from users list
      socket.on('removeUser', function (userId) {
        console.log('removing user')
        $('li#user-' + userId).remove();
        app.helpers.updateNumOfUsers();
      });

      // Append a new message
      socket.on('addMessage', function (message) {
        app.helpers.addMessage(message);
      });
    });
  },

  helpers: {
    encodeHTML: function (str) {
      return $('<div />').text(str).html();
    },

    // Update rooms list
    updateRoomsList: function (room) {
      room.title = this.encodeHTML(room.title);
      room.title = room.title.length > 25 ? room.title.substr(0, 25) + '...' : room.title;
      const listItem = `<a class="list-group-item list-group-item-action border" href="/chat/${room._id.trim()}">${
        room.title
      }</a>`;

      if (listItem === '') {
        return;
      }

      $('.room-list').prepend(listItem);

      this.updateNumOfRooms();
    },

    // Update users list
    updateUsersList: function (users, clear) {
      if (users.constructor !== Array) {
        users = [users];
      }

      let html = '';
      for (const user of users) {
        user.username = this.encodeHTML(user.username);
        html += `<li id="user-${user._id}">
                     <img class="avatar" src="${user.avatar}" alt="${user.username}" />
                     <div class="about">
                        <div class="name">${user.username}</div>
                     </div></li>`;
      }

      if (html === '') {
        return;
      }

      if (clear != null && clear == true) {
        $('.users-list ul').html('').html(html);
      } else {
        $('.users-list ul').prepend(html);
      }

      this.updateNumOfUsers();
    },

    // Adding a new message to chat history
    addMessage: function (message, socketId) {
      message.date = new Date(message.date).toLocaleString();
      message.username = this.encodeHTML(message.username);
      message.content = this.encodeHTML(message.content);

      const messageEntry = document.createElement('li');

      const you = socketId === socket.id ? true : false;

      messageEntry.classList = `${you ? ' message-display-left' : 'message-display-right'}`;

      messageEntry.innerHTML = `
      <div class="message-body">
          <span class="user-name">${message.username}</span>
          <time>@ ${message.date}</time>
          <p>${message.content}</p>
      </div>
  `;

      dom.feed.appendChild(messageEntry);
      // scroll to the bottom of all chat messages
      const xHeight = dom.feed.scrollHeight;
      dom.feed.scrollTo(0, xHeight);
    },

    // Update number of rooms
    // This method MUST be called after adding a new room
    updateNumOfRooms: function () {
      const num = $('.room-list ul li').length;
      $('.room-num-rooms').text(num + ' Room(s)');
    },

    // Update number of online users in the current room
    // This method MUST be called after adding, or removing list element(s)
    updateNumOfUsers: function () {
      const num = $('.users-list ul li').length;
      $('.chat-num-users').text(num + ' User(s)');
    },
  },
};
