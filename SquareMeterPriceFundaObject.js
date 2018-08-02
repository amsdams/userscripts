// ==UserScript==
// @name         SquareMeterPriceFundaObjectJQ
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

  function flatten(input, reference, output) {
    output = output || {};
    for (var key in input) {
      var value = input[key];
      key = reference ? reference + '.' + key : key;
      if (typeof value === 'object' && value !== null) {
        flatten(value, key, output);
      } else {
        output[key] = value;
      }
    }
    return output;
  }

  var bDetail = $('main div.object-detail').length == 1;
  var bOverview = $('main form').length == 1;

  var infoObject = {
    address: '',
    transmission: {
      price: 0,
    },

    surfacesAndContents: {
      useAreas: {
        livingArea: 0,
        otherIndoorSpace: 0,
        buildingRelatedOutdoorSpace: 0,
        externalStorageSpace: 0,
      },
      totalUseAreas: 0,
      contents: 0,
    },
  };
  if (bOverview) {
    //alert(address);
    // Your code here...
    let objects = $('.search-result-content-inner');
    for (var i = 0; i < objects.length; ++i) {
      let object = $(objects[i]);
      let tAddress = object.find('h3.search-result-title').text();
      var eVraagprijs = object.find('.search-result-price');
      var eWoonoppervlakte = object.find('[title=Woonoppervlakte]');
      tVraagprijs = eVraagprijs.text();
      tWoonoppervlakte = eWoonoppervlakte.text();

      infoObject.transmission.price = parseFloat(tVraagprijs.replace(/[^0-9]/g, ''));
      infoObject.surfacesAndContents.useAreas.livingArea = parseFloat(tWoonoppervlakte.replace(/[^0-9]/g, ''));

      createOverview(infoObject, object);
    }
  }

  if (bDetail) {
    let object = $('.object-detail');

    let elements = object.find('.object-kenmerken-list > *, .object-kenmerken-group-list > dl > *');
    let tAddress = object.find('.object-header__address').text();
    tAddress = tAddress.replace(/\r/, '');
    tAddress = tAddress.replace(/\n/, '');

    var tInhoud, tVraagprijs, tWoonoppervlakte, tOverigeInpandigeRuimte, tGebouwgebondenBuitenruimte, tExterneBergruimte;
    var tEigendomssituatie;

    for (var i = 0; i < elements.length; ++i) {
      var element = $(elements[i]);
      var text = element.text();
      var valueElement = $(elements[i + 1]);
      switch (text) {
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

    infoObject.transmission.price = parseFloat(tVraagprijs.replace(/[^0-9]/g, ''));
    infoObject.surfacesAndContents.useAreas.livingArea = parseFloat(tWoonoppervlakte.replace(/[^0-9]/g, ''));
    infoObject.surfacesAndContents.useAreas.otherIndoorSpace = parseFloat(tOverigeInpandigeRuimte ? tOverigeInpandigeRuimte.replace(/[^0-9]/g, '') : 0);
    infoObject.surfacesAndContents.useAreas.buildingRelatedOutdoorSpace = parseFloat(
      tGebouwgebondenBuitenruimte ? tGebouwgebondenBuitenruimte.replace(/[^0-9]/g, '') : 0,
    );
    infoObject.surfacesAndContents.useAreas.externalStorageSpace = parseFloat(tExterneBergruimte ? tExterneBergruimte.replace(/[^0-9]/g, '') : 0);
    infoObject.surfacesAndContents.contents = parseFloat(tInhoud.replace(/[^0-9]/g, ''));
    infoObject.surfacesAndContents.totalUseAreas =
      infoObject.surfacesAndContents.useAreas.livingArea +
      infoObject.surfacesAndContents.useAreas.otherIndoorSpace +
      infoObject.surfacesAndContents.useAreas.buildingRelatedOutdoorSpace +
      infoObject.surfacesAndContents.useAreas.externalStorageSpace;

    infoObject.address = tAddress;

    createDetail(infoObject, object);

    if (tEigendomssituatie.indexOf('erfpacht') !== -1) {
      document.body.style.backgroundColor = 'red';
    }

    //console.table(nVierkanteMeterPrijs2);
    console.table(infoObject);
    console.table(flatten(infoObject));
  }

  function createOverview(infoObject, element) {
    let pricePerSquareMeters = infoObject.transmission.price / infoObject.surfacesAndContents.useAreas.livingArea;

    let eExtraInfo = $('<ul>');
    eExtraInfo.append($('<li>').text('pricePerSquareMeters: ' + pricePerSquareMeters));

    element.find('.search-result-info-price').append(eExtraInfo);
  }

  function createDetail(infoObject, element) {
    let pricePerSquareMeters = infoObject.transmission.price / infoObject.surfacesAndContents.useAreas.livingArea;
    let pricePerSquareMetersExtra =
      infoObject.transmission.price /
      (infoObject.surfacesAndContents.useAreas.livingArea +
        infoObject.surfacesAndContents.useAreas.otherIndoorSpace +
        infoObject.surfacesAndContents.useAreas.buildingRelatedOutdoorSpace +
        infoObject.surfacesAndContents.useAreas.externalStorageSpace);
    let pricePerQubicMeters = infoObject.transmission.price / infoObject.surfacesAndContents.contents;

    let eExtraInfo = $('<ul>');
    eExtraInfo.append($('<li>').text('pricePerSquareMeters: ' + pricePerSquareMeters));
    eExtraInfo.append($('<li>').text('pricePerSquareMetersExtra: ' + pricePerSquareMetersExtra));
    eExtraInfo.append($('<li>').text('pricePerQubicMeters: ' + pricePerQubicMeters));
    element.find('.object-header__pricing').append(eExtraInfo);
  }
})();
