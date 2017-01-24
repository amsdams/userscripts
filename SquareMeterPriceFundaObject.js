// ==UserScript==
// @name         SquareMeterPriceFundaObject
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.funda.nl/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var descs = document.querySelectorAll(".object-kenmerken-list > *, .object-kenmerken-group-list > dl > *");
    var tWoonoppervlakte;
    var tVraagprijs;
    var nVierkanteMeterPrijs;

    for (var i=0; i < descs.length; ++i){
        var desc = descs[i];
        var text = desc.innerText || desc.textContent;
        console.log(text);

        if (text == 'Vraagprijs'){
            var eVraagprijs = descs[i+1];
            tVraagprijs = eVraagprijs.innerText || eVraagprijs.textContent;

        }

        /* Gebruiksoppervlakten*/
        if (text  == 'Woonoppervlakte'){
            var eWoonoppervlakte = descs[i+1];
            tWoonoppervlakte = eWoonoppervlakte.innerText || eWoonoppervlakte.textContent;


        }


    }

    //replace(/[^0-9.]/g, "");
    var nVraagprijs = tVraagprijs.replace(/[^0-9]/g, "");
    var nWoonoppervlakte = tWoonoppervlakte.replace(/[^0-9]/g, "");
    console.log(nVraagprijs);
    console.log(nWoonoppervlakte);
    nVierkanteMeterPrijs = nVraagprijs/nWoonoppervlakte;
    alert(nVierkanteMeterPrijs);


})();
