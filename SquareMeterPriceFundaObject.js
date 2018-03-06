// ==UserScript==
// @name         SquareMeterPriceFundaObject
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.funda.nl/*
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
        var tInhoud;
        var tEigendomssituatie;

        for (var i=0; i < objects.length; ++i){
            var object = objects[i];
            var text = object.innerText || object.textContent;
            console.log(text);

            if (text == 'Vraagprijs'){
                var eVraagprijs = objects[i+1];
                tVraagprijs = eVraagprijs.innerText || eVraagprijs.textContent;

            }

            /* Gebruiksoppervlakten*/
            if (text  == 'Eigendomssituatie'){
                var eEigendomssituatie = objects[i+1];
                tEigendomssituatie = eEigendomssituatie.innerText || eEigendomssituatie.textContent;


            }

            if (text  == 'Woonoppervlakte'){
                var eWoonoppervlakte = objects[i+1];
                tWoonoppervlakte = eWoonoppervlakte.innerText || eWoonoppervlakte.textContent;


            }

            if (text  == 'Inhoud'){
                var eInhoud = objects[i+1];
                tInhoud = eInhoud.innerText || eInhoud.textContent;


            }


        }

        //replace(/[^0-9.]/g, "");
        var nVraagprijs = tVraagprijs.replace(/[^0-9]/g, "");
        var nWoonoppervlakte = tWoonoppervlakte.replace(/[^0-9]/g, "");
        var nInhoud = tInhoud.replace(/[^0-9]/g, "");

        var nVierkanteMeterPrijs = nVraagprijs/nWoonoppervlakte;
        var eVierkanteMeterPrijs = createEVierkanteMeterPrijs(nVierkanteMeterPrijs);

        //kubieke meter
        var nKubiekeMeterPrijs = nVraagprijs/nInhoud;
        var eKubiekeMeterPrijs = createEKubiekeMeterPrijs(nKubiekeMeterPrijs);

        var eExtraInfo = document.createElement("ul");

        eExtraInfo.appendChild(eVierkanteMeterPrijs);
        eExtraInfo.appendChild(eKubiekeMeterPrijs);
        document.querySelector('.object-header__pricing').appendChild(eExtraInfo);

        if (tEigendomssituatie.indexOf('erfpacht')!== -1){
            document.body.style.backgroundColor = "red";
        }


    }
    function createEVierkanteMeterPrijs(nVierkanteMeterPrijs){
        var eVierkanteMeterPrijs = document.createElement("li");
        var tVierkanteMeterPrijs = document.createTextNode('VierkanteMeterPrijs: '+nVierkanteMeterPrijs + ' eur/m2');
        eVierkanteMeterPrijs.appendChild(tVierkanteMeterPrijs);
        return eVierkanteMeterPrijs;
    }

    function createEKubiekeMeterPrijs(nKubiekeMeterPrijs){
        var eKubiekeMeterPrijs = document.createElement("li");
        var tKubiekeMeterPrijs = document.createTextNode('KubiekeMeterPrijs: '+nKubiekeMeterPrijs + ' eur/m3');
        eKubiekeMeterPrijs.appendChild(tKubiekeMeterPrijs);
        return eKubiekeMeterPrijs;
    }

})();
