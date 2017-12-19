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
    init.js
    Initialize Hymybot

*/

'use strict';

module.exports = function(bot) {

    const log = require('loglevel');
    const settings = require('./settings.js');
    const syslog = log.getLogger('system');

    // Initialize logging levels
    log.getLogger('system').setLevel(settings.log_system_level);
    log.getLogger('db').setLevel(settings.log_db_level);
    log.getLogger('commands').setLevel(settings.log_commands_level);

    syslog.info('Set system log level to ' + settings.log_system_level);
    syslog.info('Set db log level to ' + settings.log_db_level);
    syslog.info('Set commands log level to ' + settings.log_commands_level);

    // Initialize message hook to Command framework
    bot.on('message', (msg) => {
        syslog.debug(msg);
        if (!msg.text) {
            return;
        }
        const words = msg.text.split(' ');
        const cmd_only = words[0].replace(/@.+/, '').toLowerCase(); // remove trailing @username

        // TODO: read input and start forming markov chains
        // TODO: read commands that start with '/' and do something with them (/quote command for example)
    });

};