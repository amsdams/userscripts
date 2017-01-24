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
    var bDetail = document.querySelectorAll('main div.object-detail').length==1;
    var bOverview = document.querySelectorAll('main form.search').length==1;

    if (bOverview){
        // Your code here...
        var objects = document.querySelectorAll(".search-result-content-inner");
        for (var i=0; i < objects.length; ++i){
            var object = objects[i];
            var eVraagprijs = object.querySelector('.search-result-price');
            var eWoonoppervlakte = object.querySelector('[title=Woonoppervlakte]');
            var tVraagprijs = eVraagprijs.innerText || eVraagprijs.textContent;
            var tWoonoppervlakte = eWoonoppervlakte.innerText || eWoonoppervlakte.textContent;

            var nVraagprijs = tVraagprijs.replace(/[^0-9]/g, "");
            var nWoonoppervlakte = tWoonoppervlakte.replace(/[^0-9]/g, "");

            var  nVierkanteMeterPrijs = nVraagprijs/nWoonoppervlakte;

            var eVierkanteMeterPrijs = createEVierkanteMeterPrijs(nVierkanteMeterPrijs);
            object.appendChild(eVierkanteMeterPrijs);



        }
    }

    if (bDetail){
        var objects = document.querySelectorAll(".object-kenmerken-list > *, .object-kenmerken-group-list > dl > *");
        var tWoonoppervlakte;
        var tVraagprijs;
        var nVierkanteMeterPrijs;

        for (var i=0; i < objects.length; ++i){
            var object = objects[i];
            var text = object.innerText || object.textContent;
            console.log(text);

            if (text == 'Vraagprijs'){
                var eVraagprijs = objects[i+1];
                tVraagprijs = eVraagprijs.innerText || eVraagprijs.textContent;

            }

            /* Gebruiksoppervlakten*/
            if (text  == 'Woonoppervlakte'){
                var eWoonoppervlakte = objects[i+1];
                tWoonoppervlakte = eWoonoppervlakte.innerText || eWoonoppervlakte.textContent;


            }


        }

        //replace(/[^0-9.]/g, "");
        var nVraagprijs = tVraagprijs.replace(/[^0-9]/g, "");
        var nWoonoppervlakte = tWoonoppervlakte.replace(/[^0-9]/g, "");
       

        var nVierkanteMeterPrijs = nVraagprijs/nWoonoppervlakte;
        var eVierkanteMeterPrijs = createEVierkanteMeterPrijs(nVierkanteMeterPrijs);
        document.querySelector('.object-header-pricing').appendChild(eVierkanteMeterPrijs);

    }
    function createEVierkanteMeterPrijs(nVierkanteMeterPrijs){
        var eVierkanteMeterPrijs = document.createElement("span");
        var tVierkanteMeterPrijs = document.createTextNode(nVierkanteMeterPrijs + ' eur/m2');
        eVierkanteMeterPrijs.appendChild(tVierkanteMeterPrijs);
        return eVierkanteMeterPrijs;
    }

})();
