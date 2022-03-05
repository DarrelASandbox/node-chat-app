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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  const $newMessage = $messages.lastElementChild;

  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = $messages.offsetHeight;
  const containerHeight = $messages.scrollHeight;
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

const resetInput = () => {
  $messageFormInput.value = '';
  $messageFormInput.focus();
  $messageFormButton.removeAttribute('disabled');
};

socket.on('toClientMessage', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm:ss a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);

  autoscroll();
  resetInput();
});

socket.on('locationMessage', (locationInfo) => {
  const html = Mustache.render(locationTemplate, {
    username: locationInfo.username,
    date: locationInfo.date,
    latitude: locationInfo.latitude,
    longitude: locationInfo.longitude,
  });
  $messages.insertAdjacentHTML('beforeend', html);

  autoscroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector('#sidebar').innerHTML = html;
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
    const googleMapInfo = {
      date: moment(pos.timestamp).format('do MMM YY (ddd) - h:mm:ss a'), // (epochTimestamp)
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };

    socket.emit('locationMessage', googleMapInfo, (serverAcknowledgement) => {
      $locationButton.removeAttribute('disabled');
      console.log(serverAcknowledgement);
    });
  });
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
