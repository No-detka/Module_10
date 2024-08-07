const wsUri = 'wss://echo-ws-service.herokuapp.com';

const btnSend = document.querySelector('.button-send');
const btnGeo = document.querySelector('.button-geo');
const input = document.querySelector('.input');
const output = document.querySelector('.output');
const btnClose = document.querySelector('.button-close');

let websocket;

function writeToScreen(message, className) {
    let pre = document.createElement("p");
    pre.innerHTML = message;
    pre.classList.add("myMessage", className);
    output.appendChild(pre);
}

websocket = new WebSocket(wsUri);

websocket.onopen = function (evt) {
    writeToScreen(`CONNECTED`, 'open');
};

websocket.onmessage = function (evt) {
    writeToScreen(
        `Ответ сервера: ${evt.data}`, 'server__message');
};

websocket.onerror = function (evt) {
    console.log(evt.data);
};

btnSend.addEventListener('click', () => {
    const message = input.value;
    websocket.send(message);
    writeToScreen(`Вы: ${message}`, 'user__message');
    input.value = '';
}
)

btnClose.addEventListener('click', () => {
    websocket.close();
    websocket.onclose = function () {
        writeToScreen(`DISCONNECTED`, 'close');
        websocket = null;
    };
}
);


const error = () => {
    const textError = 'Невозможно получить ваше местоположение';
    writeToScreen(textError);
};

const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const geoLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    writeToScreen(`<a href='${geoLink}' target='_blank'>Ваша геолокация</a>`, 'geo');
};

btnGeo.addEventListener('click', () => {
    if (!navigator.geolocation) {
        console.log('Geolocation не поддерживается вашим браузером');
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
});
