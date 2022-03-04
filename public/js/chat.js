const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;

socket.on('toClientMessage', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message,
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = $messageFormInput.value;
  if (!message) return;

  socket.emit('toServerMessage', message, (serverAcknowledgement) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();
    console.log(serverAcknowledgement);
  });
});

$locationButton.addEventListener('click', () => {
  $locationButton.setAttribute('disabled', 'disabled');

  if (!navigator.geolocation)
    return alert('Geolocation is not supported by your browser.');
  navigator.geolocation.getCurrentPosition((pos) => {
    const date = new Date(pos.timestamp); // (epochTimestamp)

    socket.emit(
      'toServerMessage',
      `${date}: https://www.google.com/maps/@${pos.coords.latitude},${pos.coords.longitude}`,
      (serverAcknowledgement) => {
        $locationButton.removeAttribute('disabled');
        console.log(serverAcknowledgement);
      }
    );
  });
});
