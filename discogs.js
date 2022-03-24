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
var columns = ["Label", "Series", "Format", "Country", "Releases", "Genre", "Style"]
$(document).ready(function() {
    var headrow = $('.release_list_table thead tr');
    $.each(columns, function( ){
        var column = this;
        headrow.append("<th class='"+column+"'>"+column+"</th>");
    });
    var bodyrows = $('.release_list_table tbody tr');

    $.each(bodyrows, function( body_index, body_value ) {
        var bodyrow = $(this);
        $.each(columns, function( ){
            var column = this;
            bodyrow.append("<td class='"+column+"'>"+column+"</td>");
        });
        var link = bodyrow.find('.collection-image-wrapper a');
        $.get( link.attr('href'), function( data ) {
            var info = $(data).find('tbody')[0];
            var info_rows = $(info).find('tr');

            $.each(info_rows, function( ) {
                var info_row = $(this);
                var info_row_label = info_row.find('th').text().replace('\:', '');
                var info_row_value = info_row.find('td');
                bodyrow.find('td.'+info_row_label).empty().append(info_row_value);


            })
        });
    });
});
