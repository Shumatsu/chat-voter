const tmi = require('tmi.js');

let _active=false;
const voter={};
const characters={};
const vote_moderators = ['Shumat_su']
const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: [ 'shumat_su' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    console.log(`${tags['display-name']}: ${message}`);
    if(message.startsWith('+startvote') && vote_moderators.includes(tags['display-name'])) _active=true;
    if(message.startsWith('+endvote') && vote_moderators.includes(tags['display-name'])) _active=false;
    if(message.startsWith('+results') && vote_moderators.includes(tags['display-name'])) {
        let _characters = [];
        for (let character in characters){
            _characters.push([character,characters[character]])
        }
        console.log(_characters.sort(function(a,b){
            return b[1] - a[1];
        }));
        return;
    }

    if(!_active) return;
    if(self || !message.startsWith('+')) return;

    const args = message.slice(1).split(' ');
    const command = args.shift().toLowerCase();

    if(command === 'vote') {
        console.log(`${tags['display-name']} voted for ${args.join(' ')}`)
        if( voter[tags['display-name']] !== true){
            // voter[tags['display-name']] = true;
            console.log(`One vote for ${args}!`)
            if (!characters[args]) characters[args]=0;
            characters[args]++;
        } else {
            console.log(`Repeat voter!`);
        }
        // client.say(channel, `@${tags.username}, you said: "${args.join(' ')}"`);
    }


});