import alt from 'alt';
import 'login_client';
import 'character_creator_client';
import 'inventory_client';
import Fingerpointing from 'functions';

let pointing = new Fingerpointing();

alt.on('keydown', (key) => {
    if (key == 'B'.charCodeAt(0)) {
        pointing.start();
    }
});

alt.on('keyup', (key) => {
    if (key == 'B'.charCodeAt(0)) {
        pointing.stop();
    }
});
