// ==UserScript==
// @name         DeKleineWereld
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://dekleinewereld.ouderportaal.nl/portal/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

//$('link[rel=stylesheet]').remove();
//$('*[style]').attr('style', '');
//$('<link/>', {rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'}).appendTo('head');


var media = [];
//gather images from original DOM
$('ul.jcarousel img').each(function(){
    var img  = $(this);
    media.push(img.attr('src'));
});

$('td.photo-grid-column img').each(function(){
    var img  = $(this);
    media.push(img.attr('src'));
});
//end gather images from original DOM



var modal = $('<div>');
modal.attr('id', 'myModal');
modal.css({
    'display':'none', /* Hidden by default */
    'position':' fixed', /* Stay in place */
    'z-index':' 1', /* Sit on top */
    'left':' 0',
    'top':' 0',
    'width':' 100%', /* Full width */
    'height':' 100%', /* Full height */
    'overflow':' auto', /* Enable scroll if needed */
    'background-color':' rgb(0,0,0)', /* Fallback color */
    'background-color':' rgba(0,0,0,0.4)' /* Black w/ opacity */
});

modal.prependTo($('body'));

var modalContent = $('<div>');
modalContent.css({
    'background-color': '#fefefe',
    'margin': '5% auto', /* 15% from the top and centered */
    'padding': '0px',
    'border': '1px solid #888',
    'width': '90%' /* Could be more or less, depending on screen size */
});
modal.click(function(){
    $('#myModal').fadeOut('slow');
});

modalContent.appendTo(modal);

var photoList = $('<ul>');
photoList.css({
    'padding': '0',
    'margin': '0',
    'list-style-type': 'none'
});
photoList.appendTo(modalContent);

$.each(media, function( index, value ) {
    var photoListItem = $('<li>');
    photoListItem.attr('id', 'myMedia-'+index);
    photoListItem.css({
        'padding': '0',
        'margin': '0'
    });
    photoListItem.appendTo(photoList);

    var photoListItemImg = $('<img>');
    photoListItemImg.attr('src', value.replace(/photoThumb/,'photoFull'));
    photoListItemImg.css({
        'padding': '0',
        'margin': '0',
        'width': '100%'
    });

    photoListItemImg.appendTo(photoListItem);


});


//open
var buttonOpenModal = $('<button>Open Modal</button>');
buttonOpenModal.attr('id', 'myBtnOpen');
buttonOpenModal.click(function(){
    $('#myModal').fadeIn('slow');
});
buttonOpenModal.prependTo($('body'));
//end open

//close
var buttonCloseModal = $('<button>Close Modal</button>');
buttonCloseModal.attr('id', 'myBtnClose');
buttonCloseModal.click(function(){
   $('#myModal').fadeOut('slow');
});

buttonCloseModal.prependTo(modal);
//end close






