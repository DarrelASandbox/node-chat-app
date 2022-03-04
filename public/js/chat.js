const socket = io();

socket.on('toClientMessage', (message) => console.log(message));

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();

  //   const message = document.querySelector('input').value;
  const message = e.target.elements.message.value;
  if (!message) return;
  socket.emit('toServerMessage', message);
  e.target.elements.message.value = '';
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation)
    return alert('Geolocation is not supported by your browser.');
  navigator.geolocation.getCurrentPosition((pos) => {
    const date = new Date(pos.timestamp); // (epochTimestamp)

    socket.emit(
      'toServerMessage',
      `${date}: https://www.google.com/maps/@${pos.coords.latitude},${pos.coords.longitude}`
    );
  });
});
