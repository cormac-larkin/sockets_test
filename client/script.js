import { io } from "socket.io-client";

const joinRoomButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const form = document.getElementById("form");

const socket = io("http://localhost:3000", {
  transports: ['websocket'], // Admin dashboard does not connect without this line!
  withCredentials: true
});

socket.on("connect", () => {
  displayMessage(`You have connected with socket id: ${socket.id}`);
});

socket.on("receive-message", (message) => {
  displayMessage(message);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;

  if (message === "") {
    return;
  }

  displayMessage(message);

  socket.emit("send-message", message, room);

  messageInput.value = "";
});

joinRoomButton.addEventListener("click", () => {
  const room = roomInput.value;
  socket.emit("join-room", room, (message) => {
    displayMessage(message);
    
  });
  roomInput.value = "";
});

function displayMessage(message) {
  const div = document.createElement("div");
  div.textContent = message;
  document.getElementById("message-container").append(div);
}
