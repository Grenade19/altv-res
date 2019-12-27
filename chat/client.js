import alt from 'alt';
import game from 'natives';

let buffer = [];

let loaded = false;
let opened = false;
let hidden = false;

let view = new alt.WebView("http://resources/chat/html/index.html");

function addMessage(name, text) {
  if (name) {
    view.emit('addMessage', name, text);
  } else {
    view.emit('addString', text);
  }
}

view.on('chatloaded', () => {
  for (const msg of buffer) {
    addMessage(msg.name, msg.text);
  }

  loaded = true;
})

view.on('chatmessage', (text) => {
  alt.emitServer('chatmessage', text);

  opened = false;
  alt.toggleGameControls(true);
  view.unfocus();
})

export function pushMessage(name, text) {
  if (!loaded) {
    buffer.push({ name, text });
  } else {
    addMessage(name, text);
  }
}

export function pushLine(text) {
  pushMessage(null, text);
}

export function isOpen() {
  return opened;
}

alt.onServer('chatmessage', pushMessage);

alt.on('keyup', (key) => {
  if (!loaded)
    return;

  if (!opened && key === 0x54 && alt.gameControlsEnabled()) {
    opened = true;
    view.emit('openChat', false);
    view.focus();
    alt.toggleGameControls(false);
  }
  else if (!opened && key === 0xBF && alt.gameControlsEnabled()) {
    opened = true;
    view.emit('openChat', true);
    view.focus();
    alt.toggleGameControls(false);
  }
  else if (opened && key == 0x1B) {
    opened = false;
    view.emit('closeChat');
    view.unfocus();
    alt.toggleGameControls(true);
  }

  if (key == 0x76) {
    hidden = !hidden;
    game.displayHud(!hidden);
    game.displayRadar(!hidden);
    view.emit('hideChat', hidden);
    if(hidden)
      view.unfocus();
    else
      view.focus();
  }
})

export default { pushMessage, pushLine };
