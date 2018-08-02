// ==UserScript==
// @name         squaremeter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.funda.nl/*
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

(function($) {
  'use strict';

  function doDetail(object) {
    var elements = object.find('.object-kenmerken-list > *, .object-kenmerken-group-list > dl > *');
    var tAddress = object.find('.object-header__address').text();
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
        // Overige inpandige ruimte
        case 'Overige inpandige ruimte':
          tOverigeInpandigeRuimte = valueElement.text();
          break;
        // Gebouwgebonden buitenruimte
        case 'Gebouwgebonden buitenruimte':
          tGebouwgebondenBuitenruimte = valueElement.text();
          break;
        // Externe bergruimte
        case 'Externe bergruimte':
          tExterneBergruimte = valueElement.text();
          break;
        default:
          console.log(text);
      }
    }
    infoObject.transmission.price = extractNumber(tVraagprijs);
    infoObject.surfacesAndContents.useAreas.livingArea = extractNumber(tWoonoppervlakte);
    infoObject.surfacesAndContents.useAreas.otherIndoorSpace = extractNumber(tOverigeInpandigeRuimte);
    infoObject.surfacesAndContents.useAreas.buildingRelatedOutdoorSpace = extractNumber(tGebouwgebondenBuitenruimte);
    infoObject.surfacesAndContents.useAreas.externalStorageSpace = extractNumber(tExterneBergruimte);
    infoObject.surfacesAndContents.contents = extractNumber(tInhoud);
    infoObject.surfacesAndContents.totalUseAreas =
      infoObject.surfacesAndContents.useAreas.livingArea +
      infoObject.surfacesAndContents.useAreas.otherIndoorSpace +
      infoObject.surfacesAndContents.useAreas.buildingRelatedOutdoorSpace +
      infoObject.surfacesAndContents.useAreas.externalStorageSpace;
    infoObject.address = tAddress;
    infoObject.url = document.location.href;
    infoObject.ownershipSituation = tEigendomssituatie;
    return infoObject;
  }
  function extractNumber(text) {
    if (!text) {
      text = '0';
    }
    return parseFloat(text.replace(/\D/g, ''));
  }
  function doOverview(object) {
    var tAddress = object.find('h3.search-result-title').text();
    var tVraagprijs = object.find('.search-result-price').text();
    var tWoonoppervlakte = object.find('[title=Woonoppervlakte]').text();
    infoObject.address = tAddress;
    infoObject.url = document.location.href;
    infoObject.transmission.price = extractNumber(tVraagprijs);
    infoObject.surfacesAndContents.useAreas.livingArea = extractNumber(tWoonoppervlakte);

    return infoObject;
  }

  function createOverview(infoObject, element) {
    var pricePerSquareMeters = infoObject.transmission.price / infoObject.surfacesAndContents.useAreas.livingArea;
    var eExtraInfo = $('<div>');
    eExtraInfo.append($('<p>').text('pricePerSquareMeters: ' + pricePerSquareMeters));

    element.find('.search-result-info-price').append(eExtraInfo);
  }

  function createDetail(infoObject, element) {
    /* eslint no-unused-vars: 0 */
    var pricePerSquareMeters = infoObject.transmission.price / infoObject.surfacesAndContents.useAreas.livingArea;
    // Unused vars
    var pricePerSquareMetersExtra =
      infoObject.transmission.price /
      (infoObject.surfacesAndContents.useAreas.livingArea +
        infoObject.surfacesAndContents.useAreas.otherIndoorSpace +
        infoObject.surfacesAndContents.useAreas.buildingRelatedOutdoorSpace +
        infoObject.surfacesAndContents.useAreas.externalStorageSpace);

    var pricePerQubicMeters = infoObject.transmission.price / infoObject.surfacesAndContents.contents;
    /* eslint no-unused-vars: 1 */
    var eExtraInfo = $('<table>');
    var eExtraInfoRowHeader = $('<tr>');
    var eExtraInfoRowData = $('<tr>');
    var flattenInfoObject = flatten(infoObject);

    for (var key in flattenInfoObject) {
      eExtraInfoRowHeader.append($('<th>').text(key.split('.').pop()));
      var value = flattenInfoObject[key];
      eExtraInfoRowData.append($('<td>').text(value));
    }

    eExtraInfo.append(eExtraInfoRowHeader);
    eExtraInfo.append(eExtraInfoRowData);
    element.prepend(eExtraInfo);
  }
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

  var bDetail = $('main div.object-detail').length === 1;
  var bOverview = $('main form').length === 1;
  var infoObject = {
    address: '',
    url: '',
    transmission: {
      price: 0,
    },
    ownershipSituation: '',

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
    var objects = $('.search-result-content-inner');
    for (var i = 0; i < objects.length; ++i) {
      var eOverviewItem = $(objects[i]);
      infoObject = doOverview(eOverviewItem);
      createOverview(infoObject, eOverviewItem);
    }
  }

  if (bDetail) {
    var eDetail = $('.object-detail');
    infoObject = doDetail(eDetail);
    createDetail(infoObject, $('body'));
  }

  if (infoObject.ownershipSituation.match(/erfpacht/gi)) {
    document.body.style.backgroundColor = 'red';
  }

  // Console.table(nVierkanteMeterPrijs2);
  console.table(infoObject);
  console.table(flatten(infoObject));
}.bind(this)(jQuery));

jQuery.noConflict();
