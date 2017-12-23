/*
    Hymybot, a simple Telegram bot with fun group functionality
    Copyright (C) 2017 Joonas Ulmanen

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
    index.js
    Main entrypoint
*/

'use strict';

const CommandsAPI = require('telegram-bot-cmd-api')(process.env.TOKEN, process.env.BOT_MODE, process.env.APP_URL);
const when = require('when');
const order = 2;
const markov = require('./markov.js')(order);
const query = require('pg-query');
query.connectionParameters = process.env.DATABASE_URL;

CommandsAPI.helpText = 'Moi, olen Hymybot. Olen käytettävissä vain HYMY-ryhmässä privaatisti.';
CommandsAPI.privateCommandNoticeText = 'Käytä tätä komentoa vain minun kanssa!';
CommandsAPI.cmdFailText = 'Virhe! Komennon ohje: ';

CommandsAPI.otherwise = (msg, words, bot) => {
    let deferred = when.defer();
    words = words.map(w => w.toLowerCase());

    let start = markov.findPartialKeyFromData(words);
    let lottery = Math.random();
    console.log(start, lottery);
    if(start && lottery > 0.7){
        bot.sendMessage(msg.chat.id, start + ' ' + markov.generate(start, 15).join(' '));
    }

    // save the message to db
    if(words.length < order + 1){
        deferred.resolve();
        return deferred.promise;
    }

    markov.seed(words);

    query('insert into msgs (msg) values ($1)', [words.join(markov.delimiter)])
        .then(() => {

        }, (err) => {
            console.log('error while saving message to db');
            console.log(err);
        });


    deferred.resolve();
    return deferred.promise;
};

/* seed the markov chain from db */

query('select msg from msgs')
.then((res) => {
    let msgs = res[0];
    for(let i in msgs){
        let words = msgs[i].msg.split(markov.delimiter);
        markov.seed(words);
    }
    console.log('seeded with ' + msgs.length + ' messages');
}, (err) => {
    console.log('Error while seeding markov chain from db');
    console.log(err);
});
