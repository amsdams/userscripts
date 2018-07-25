// ==UserScript==
// @name         ilost
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ilost.co/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';

    var container = $('.l-container');
    var width = container.css('width');

    var side = $('.l-side');
    side.remove();

    var content = $('.l-content')[0];
    content.style.padding=0;
    content.style.margin=0;
    content.style.width=width;
    reset();
    var moreButton = $(content).find('.btn.js-load-more');
    moreButton.on('click', function(){
        setTimeout(reset, 2000);
    });

    function reset(){
        var elements = $(content).find('a.list-item');
        for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            if (!element){
                console.error('element no?', element);
            }else{

                if (element.getAttribute('reset')!=='1'){
                    console.log('element', element);
                    element.style.width=width;
                    element.style.height=width;
                    element.style.left='0';
                    element.style.top='0';
                    element.style.padding='0';
                    element.style.margin='0';
                    element.setAttribute('reset', '1');

                    var images = $(element).find('.list-item__image');
                    for (var j = 0; j < images.length; ++j) {
                        var image = images[j];
                        if (!image){
                            console.error('image no?', image);
                        }else{
                            console.log('image', image);

                            var src = image.getAttribute('src');
                            if (src){
                                src = src.replace(/\/80/, '/1200');

                                image.setAttribute('src', src);
                            }
                            image.style.width=width;
                            image.style.height=width;
                            image.style.minWidth='auto';
                            image.style.minHeight='auto';
                            image.style.position='relative';
                            image.style.left='0';
                            image.style.top='0';
                            image.style.padding='0';
                            image.style.margin='0';
                        }
                    }
                }

            }
        }



    }



}.bind(this)(jQuery));

jQuery.noConflict();
