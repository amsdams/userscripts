// ==UserScript==
// @name         Discogs Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds info currently available Label, Format, Country, Released, Genre, Style on detail page of release
// @author       You
// @match        https://www.discogs.com/user/nightc/collection?*
// @icon         https://www.google.com/s2/favicons?domain=discogs.com
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==


var $ = window.jQuery;

$(document).ready(function() {
   var rows = $('.release_list_table tr')
    $.each(rows, function( index, value ) {
        var row = $(value);
        var link = row.find('.collection-image-wrapper a');
       // if (index==0){
        $.get( link.attr('href'), function( data ) {
            var info = $(data).find('tbody')[0];
            row.append(info);
        });
      //  }
    });
});
