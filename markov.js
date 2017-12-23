/*
    Hymybot, a simple Telegram bot with fun group functionality
    Copyright (C) 2017  Joonas Ulmanen

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
    markov.js
    Simple general implementation of markov chains
    Reinvented the wheel just because felt like it
*/
'use strict';

module.exports = (order) => {
    let markov = {order: order, delimiter: ' '};
    let m_keys = [];
    let m_partial_keys = {};
    let m_data = {};

    markov.seed = (data) => {
        for(let i=0; i < data.length-order; i += 1){
            let orderTuple = data.slice(i, i+order).join(markov.delimiter);
            if(!m_data[orderTuple]) {
                m_data[orderTuple] = [];
                m_data._length += 1;
                m_keys.push(orderTuple);
                let orderKeys = orderTuple.split(markov.delimiter);
                for(let k in orderKeys) {
                    let partialKey = orderKeys[k];
                    if(!m_partial_keys[partialKey]) {
                        m_partial_keys[partialKey] = [];
                    }
                    m_partial_keys[partialKey].push(orderTuple);
                }
            }
            m_data[orderTuple].push(data[i+order]);
        }
    };

    markov.generate = (key, limit) => {
        let counter = 0;
        let generated = [];
        let nextKey = key;
        while(m_data[nextKey] && counter < limit){
            counter += 1;
            let nextItem = m_data[nextKey][Math.floor(Math.random()*m_data[nextKey].length)];
            generated.push(nextItem);
            if (order > 1) {
                nextKey = nextKey.split(markov.delimiter).slice(1, markov.order).join(markov.delimiter) + markov.delimiter + nextItem;
            } else {
                nextKey = nextItem;
            }
        }
        return generated;
    };

    markov.randomKey = () => {
        return m_keys[Math.floor(Math.random()*m_keys.length)];
    };

    markov.findPartialKeyFromData = (data) => {
        let found = [];
        for (let i in data) {
            let point = data[i];
            if(m_partial_keys[point]){
                found = found.concat(m_partial_keys[point]);
            }
        }
        return found[Math.floor(Math.random()*found.length)];
    };

    markov.findExactKeyFromData = (data) => {
        for(let i=0; i < data.length-order; i += 1){
            let orderTuple = data.slice(i, i+order).join(markov.delimiter);
            if(m_data[orderTuple]){
                return orderTuple;
            }
        }
        return false;
    };

    return markov;
};