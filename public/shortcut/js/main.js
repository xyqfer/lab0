"use strict";
//-------------------
//Primary code
//-------------------

let ul = document.querySelector('.list-wrapper');


function randomNumber(maxLength) {
    return Math.floor( Math.random() * maxLength ); 
}

// const shuffled = data.sort( () => 0.5 - Math.random() );
// let selected = shuffled.slice( 0, 3);
// let selected = data;

ul.innerHTML = data.map( (displayShortcut) => {
    return displayShortcut.shortcuts.reduce((acc, item) => {
        return acc += `
            <li class="inner-container">
                    <h6>${displayShortcut.category}</h6>
                    <h2>${item.command}</h2>
                    <p>${item.description}</p>
            </li>`;
    }, '');
	}).join(" ");

// -------------------
//  Future development
// ------------------- 

// Add refresh button
// Add search-input for commands
// Develop commands for windows and linux
    