import alt from 'alt';
import game from 'natives';

let access =
[
    {
        "discord": "Aktyn#9473"
    },
    {
        "discord": "SuchY#8384"
    },
    {
        "discord": "Grenade#0001"
    },
	{
        "discord": "Gašper52#2455"
    },
];

let discord = alt.discordInfo();
let loaded = false;
let opened = false;
let currentMouseState = null;
let accessBool = false;

for (var i = 0; i < access.length; i++)
{
    let format = discord.name+"#"+discord.discriminator;
    if (access[i].discord == format)
    {
        accessBool = true;
    }
}

let view = new alt.WebView("http://resources/editor/html/index.html");

view.on('clientEvalExecute', (evalcode) => {
    eval(evalcode);
});

view.on('serverEvalExecute', (evalcode) => {
    alt.emitServer('serverEvalExecute', evalcode);
});

view.on('editorReady', () => {
    loaded = true;
});

view.on('editorOpened', (active) => {
    opened = active;
    alt.toggleGameControls(!active);
    if(currentMouseState !== active){
      alt.showCursor(active)
      currentMouseState = active;
    }
    if(active)
      view.focus();
});

alt.on('keyup', (key) => {
    if (!loaded) return;
    if(!accessBool) return;

    // list of key codes https://docs.microsoft.com/en-us/windows/desktop/inputdev/virtual-key-codes
    if (key == 0x73) { //f4
        view.emit('toggleEditor');
    } else if (opened && key == 0x1B) {
        view.emit('toggleEditor');
    }
});