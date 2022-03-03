const socket = io();
socket.on('countUpdated', (count) => {
  console.log(count);
});

document
  .querySelector('#increment')
  .addEventListener('click', () => socket.emit('increment'));

document
  .querySelector('#reset')
  .addEventListener('click', () => socket.emit('reset'));
