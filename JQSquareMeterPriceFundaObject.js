// ==UserScript==
// @name         SquareMeterPriceFundaelement
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.funda.nl/*
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';


    var bDetail = $('main div.object-detail').length==1;
    var bOverview = $('main form').length==1;

    if (bOverview){
        // Your code here...
        var elements = $(".search-result-content-inner");
        for (var i=0; i < elements.length; ++i){
            var element = $(elements[i]);
            var eVraagprijs = element.find('.search-result-price');
            var eWoonoppervlakte = element.find('[title=Woonoppervlakte]');
            var tVraagprijs = eVraagprijs.text();
            var tWoonoppervlakte = eWoonoppervlakte.text();
            var nVraagprijs = tVraagprijs.replace(/[^0-9]/g, "");
            var nWoonoppervlakte = tWoonoppervlakte.replace(/[^0-9]/g, "");
            var nVierkanteMeterPrijs = nVraagprijs/nWoonoppervlakte;
            var eVierkanteMeterPrijs = createEVierkanteMeterPrijs(nVierkanteMeterPrijs);
            element.append(eVierkanteMeterPrijs);

        }
    }

    if (bDetail){
        var elements = $(".object-kenmerken-list > *, .object-kenmerken-group-list > dl > *");
        var tWoonoppervlakte, tOverigeInpandigeRuimte, tGebouwgebondenBuitenruimte, tExterneBergruimte;
        var tVraagprijs;
        var tInhoud;
        var tEigendomssituatie;

        for (var i=0; i < elements.length; ++i){
            var element = $(elements[i]);
            var text = element.text();
            var valueElement =  $(elements[i+1]);
            switch(text) {
                case 'Vraagprijs':
                    tVraagprijs = valueElement.text();
                    break;
                case 'Laatste vraagprijs':
                    tVraagprijs = valueElement.text();
                    break;
                case 'Eigendomssituatie':
                    tEigendomssituatie = valueElement.text();
                    break;
                case 'Woonoppervlakte':
                    tWoonoppervlakte = valueElement.text();
                    break;
                case 'Inhoud':
                    tInhoud = valueElement.text();
                    break;
                    //Overige inpandige ruimte
                case 'Overige inpandige ruimte':
                    tOverigeInpandigeRuimte = valueElement.text();
                    break;
                    //Gebouwgebonden buitenruimte
                case 'Gebouwgebonden buitenruimte':
                    tGebouwgebondenBuitenruimte = valueElement.text();
                    break;
                    //Externe bergruimte
                case 'Externe bergruimte':
                    tExterneBergruimte = valueElement.text();
                    break;
                default:
                    console.log(text);
            }


        }

        //replace(/[^0-9.]/g, "");
        var nVraagprijs = parseFloat(tVraagprijs.replace(/[^0-9]/g, ""));
        var nWoonoppervlakte = parseFloat(tWoonoppervlakte.replace(/[^0-9]/g, ""));
        var nOverigeInpandigeRuimte = parseFloat(tOverigeInpandigeRuimte?tOverigeInpandigeRuimte.replace(/[^0-9]/g, ""):0);
        var nGebouwgebondenBuitenruimte= parseFloat(tGebouwgebondenBuitenruimte?tGebouwgebondenBuitenruimte.replace(/[^0-9]/g, ""):0);
        var nExterneBergruimte= parseFloat(tExterneBergruimte?tExterneBergruimte.replace(/[^0-9]/g, ""):0);
        var nInhoud = tInhoud.replace(/[^0-9]/g, "");
        var nVierkanteMeterPrijs = nVraagprijs/nWoonoppervlakte;
        var nVierkanteMeterPrijs2 = nVraagprijs/(nWoonoppervlakte+nOverigeInpandigeRuimte+nGebouwgebondenBuitenruimte+nExterneBergruimte);
        var nKubiekeMeterPrijs = nVraagprijs/nInhoud;
        var eExtraInfo = $("<ul>");

        eExtraInfo.append($("<li>").text('VierkanteMeterPrijs: '+nVierkanteMeterPrijs));
        eExtraInfo.append($("<li>").text('VierkanteMeterPrijs2: '+nVierkanteMeterPrijs2));
        eExtraInfo.append($("<li>").text('KubiekeMeterPrijs: '+nKubiekeMeterPrijs));
        $(document).find('.object-header__pricing').append(eExtraInfo);

        if (tEigendomssituatie.indexOf('erfpacht')!== -1){
            document.body.style.backgroundColor = "red";
        }


    }
    

})();
