const tmi = require('tmi.js');

let _active = false;
const voter = {};
const characters = {};
const vote_moderators = ['DISPLAY name'] //Change this
const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['channel name'] //Change this
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    if (self || !message.startsWith('+')) return;

    const args = message.toUpperCase().slice(1).split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'vote' && _active) {
        console.log(`${tags['display-name']} voted for ${args.join(' ')}`)
        if (voter[tags['display-name']] !== true) {
            voter[tags['display-name']] = true;
            console.log(`One vote for ${args}!`)
            if (!characters[args]) characters[args] = 0;
            characters[args]++;
        } else {
            console.log(`Repeat voter!`);
        }
    } else if (command === 'startvote' && !_active) {
        if (vote_moderators.includes(tags['display-name'])) {
            _active = true;
            console.log('Vote started!');
        }
    } else if (command === 'endvote' && _active) {
        if (vote_moderators.includes(tags['display-name'])) {
            _active = false;
            console.log('Vote ended');
        }
    } else if (command === 'results') {
        if (vote_moderators.includes(tags['display-name'])) {
            let _characters = [];
            for (let character in characters) {
                _characters.push([character, characters[character]])
            }
            console.log(_characters.sort(function (a, b) {
                return b[1] - a[1];
            }));
        }
    }
});