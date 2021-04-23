const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Tamplates
const messegeTamplate = document.querySelector('#message-template').innerHTML;
const locationTamplate = document.querySelector('#location-template').innerHTML;

socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messegeTamplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('HH:mm'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (message) => {
  console.log(message);
  const html = Mustache.render(locationTamplate, {
    url: message.url,
    createdAt: moment(message.createdAt).format('HH:mm'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;
  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log('Message delivered');
  });
});

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }

  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    socket.emit(
      'sendLocation',
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      () => {
        $sendLocationButton.removeAttribute('disabled');
        $messageFormInput.focus();
        console.log('Location shared!');
      }
    );
  });
});
