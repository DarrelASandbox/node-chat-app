const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

const resetInput = () => {
  $messageFormInput.value = '';
  $messageFormInput.focus();
  $messageFormButton.removeAttribute('disabled');
};

socket.on('toClientMessage', (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm:ss a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);

  resetInput();
});

socket.on('locationMessage', (locationInfo) => {
  const html = Mustache.render(locationTemplate, {
    date: locationInfo.date,
    latitude: locationInfo.latitude,
    longitude: locationInfo.longitude,
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = $messageFormInput.value;
  if (!message) return $messageFormButton.removeAttribute('disabled');

  socket.emit('toServerMessage', message, (serverAcknowledgement) => {
    resetInput();
    console.log(serverAcknowledgement);
  });
});

$locationButton.addEventListener('click', () => {
  $locationButton.setAttribute('disabled', 'disabled');

  if (!navigator.geolocation)
    return alert('Geolocation is not supported by your browser.');
  navigator.geolocation.getCurrentPosition((pos) => {
    const locationInfo = {
      date: moment(pos.timestamp).format('h:mm:ss a'), // (epochTimestamp)
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };

    socket.emit('locationMessage', locationInfo, (serverAcknowledgement) => {
      $locationButton.removeAttribute('disabled');
      console.log(serverAcknowledgement);
    });
  });
});
