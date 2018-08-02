// ==UserScript==
// @name         memakelaars
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.memakelaars.nl/aanbod/300/Exclusieve
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function() {
  $('<a/>', {
    class: 'hideSold',
    text: 'Hide Sold',
    click: function() {
      $('div.tile.tile-aanbod.outline').each(function() {
        console.log($(this).children('div.item-status').length);
        if ($(this).children('div.item-status').length > 0) {
          $(this).toggle('slow');
        }
      });
    },
  }).prependTo('body');
});
