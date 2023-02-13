// ==UserScript==
// @name         Discogs Grid Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds Grid view based on items per page. Ex 5x5 or 10x10
// @author       You
// @match        https://www.discogs.com/user/nightc/collection?*
// @icon         https://www.google.com/s2/favicons?domain=discogs.com
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

var $ = window.jQuery;
$(document).ready(function() {
    var repeat = $('#limit_top').val()/5;

    $('.card-release-title, .card-artist-name, .card_actions.skittles').remove();

    $('.card').css({'margin':'0px',
                    'height':'auto'});
    $('.cards').css({'display':'grid',
                     'grid-template-columns': 'repeat('+repeat+', 1fr)',
                     'gap':'0',
                     'width':'0'})
});
