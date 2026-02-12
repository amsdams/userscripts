// ==UserScript==
// @name         Discogs Collection Scraper (jQuery with Button)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scrape album and artist from Discogs collection using jQuery
// @match        https://www.discogs.com/user/*/collection*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// ==/UserScript==
(function($) {
    'use strict';

    let $resultsDiv;
    let $overlay;

    function scrapeCollection() {
        const $items = $('[class*="titleAndArtist"]');

        if ($items.length === 0) {
            alert('No collection items found!');
            return;
        }

        const collection = [];

        $items.each(function() {
            const $item = $(this);
            const title = $item.children('a').eq(0).text().trim();
            const artist = $item.children('span').eq(0).text().trim();

            if (title && artist) {
                collection.push({
                    title: title,
                    artist: artist,
                    youtubeUrl: 'https://music.youtube.com/search?q=' + encodeURIComponent(artist + ' ' + title) + '&filter=albums'
                });
            }
        });

        console.log('Scraped ' + collection.length + ' items:', collection);

        // Display results
        displayResults(collection);

        // Download as JSON
        const json = JSON.stringify(collection, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        $('<a>')
            .attr('href', url)
            .attr('download', 'discogs-collection.json')
            .get(0)
            .click();

        URL.revokeObjectURL(url);
    }

    function displayResults(collection) {
        // Clear previous results
        $resultsDiv.empty();

        // Add close button
        $('<button>')
            .text('×')
            .css({
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#666',
                lineHeight: '1',
                padding: '0',
                width: '30px',
                height: '30px'
            })
            .hover(
                function() { $(this).css('color', '#ff6600'); },
                function() { $(this).css('color', '#666'); }
            )
            .click(closeResults)
            .appendTo($resultsDiv);

        // Add title
        $('<h2>')
            .text('Collection (' + collection.length + ' items)')
            .css({
                margin: '0 0 15px 0',
                paddingRight: '40px',
                fontSize: '20px',
                borderBottom: '2px solid #ff6600'
            })
            .appendTo($resultsDiv);

        // Create table
        const $table = $('<table>')
            .css({
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px'
            })
            .appendTo($resultsDiv);

        // Table header
        $('<thead>')
            .append(
                $('<tr>').append(
                    $('<th>').text('Artist').css({padding: '8px', background: '#333', color: 'white', textAlign: 'left'}),
                    $('<th>').text('Album').css({padding: '8px', background: '#333', color: 'white', textAlign: 'left'}),
                    $('<th>').text('YouTube Music').css({padding: '8px', background: '#333', color: 'white', textAlign: 'center', width: '120px'})
                )
            )
            .appendTo($table);

        // Table body
        const $tbody = $('<tbody>').appendTo($table);

        collection.forEach(function(item, index) {
            const bgColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff';

            $('<tr>')
                .css({background: bgColor})
                .append(
                    $('<td>').text(item.artist).css({padding: '8px', borderBottom: '1px solid #ddd'}),
                    $('<td>').text(item.title).css({padding: '8px', borderBottom: '1px solid #ddd'}),
                    $('<td>')
                        .css({padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center'})
                        .append(
                            $('<a>')
                                .attr('href', item.youtubeUrl)
                                .attr('target', '_blank')
                                .text('Search')
                                .css({
                                    color: '#ff0000',
                                    textDecoration: 'none',
                                    fontWeight: 'bold'
                                })
                                .hover(
                                    function() { $(this).css('textDecoration', 'underline'); },
                                    function() { $(this).css('textDecoration', 'none'); }
                                )
                        )
                )
                .appendTo($tbody);
        });

        // Show the overlay and div
        $overlay.show();
        $resultsDiv.show();
    }

    function closeResults() {
        $resultsDiv.hide();
        $overlay.hide();
    }

    $(document).ready(function() {
        // Create overlay (darkened background)
        $overlay = $('<div>')
            .css({
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9997,
                display: 'none'
            })
            .click(closeResults)
            .appendTo('body');

        // Create results div
        $resultsDiv = $('<div>')
            .css({
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '700px',
                maxHeight: '80vh',
                background: 'white',
                border: '2px solid #ff6600',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                zIndex: 9998,
                overflowY: 'auto',
                display: 'none'
            })
            .click(function(e) {
                // Prevent clicks inside the div from closing it
                e.stopPropagation();
            })
            .appendTo('body');

        // Add scrape button
        $('<button>')
            .text('Scrape Collection')
            .css({
                position: 'fixed',
                top: '10px',
                right: '10px',
                zIndex: 9999,
                padding: '10px 20px',
                background: '#ff6600',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
            })
            .hover(
                function() { $(this).css('background', '#ff8833'); },
                function() { $(this).css('background', '#ff6600'); }
            )
            .click(scrapeCollection)
            .appendTo('body');
    });
})(jQuery);