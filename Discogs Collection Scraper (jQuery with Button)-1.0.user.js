// ==UserScript==
// @name         Discogs Collection Scraper
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Scrape and display Discogs collection with YouTube Music links
// @match        https://www.discogs.com/user/*/collection*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_addStyle
// ==/UserScript==

(function($) {
    'use strict';

    // ========== STYLES ==========
    GM_addStyle(`
        /* Overlay */
        .tm-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9997;
            display: none;
        }

        /* Popup */
        .tm-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 700px;
            max-height: 80vh;
            background: white;
            border: 2px solid #ff6600;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 9998;
            overflow-y: auto;
            display: none;
        }

        /* Close Button */
        .tm-close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #666;
            line-height: 1;
            padding: 0;
            width: 30px;
            height: 30px;
        }

        .tm-close-btn:hover {
            color: #ff6600;
        }

        /* Scrape Button */
        .tm-scrape-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px 20px;
            background: #ff6600;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        }

        .tm-scrape-btn:hover {
            background: #ff8833;
        }

        /* Popup Title */
        .tm-popup h2 {
            margin: 0 0 15px 0;
            padding-right: 40px;
            font-size: 20px;
            border-bottom: 2px solid #ff6600;
        }

        /* Table */
        .tm-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .tm-table th {
            padding: 8px;
            background: #333;
            color: white;
            text-align: left;
        }

        .tm-table th.center {
            text-align: center;
            width: 120px;
        }

        .tm-table td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }

        .tm-table td.center {
            text-align: center;
        }

        .tm-table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }

        .tm-table tbody tr:nth-child(odd) {
            background: #ffffff;
        }

        /* YouTube Link */
        .tm-yt-link {
            color: #ff0000;
            text-decoration: none;
            font-weight: bold;
        }

        .tm-yt-link:hover {
            text-decoration: underline;
        }
    `);

    // ========== CONSTANTS ==========
    const SELECTORS = {
        titleAndArtist: '[class*="titleAndArtist"]'
    };

    // ========== STATE ==========
    let $overlay, $popup;

    // ========== CORE FUNCTIONS ==========

    /**
     * Scrape collection items from the page
     * @returns {Array} Collection array with artist, title, and YouTube URL
     */
    function scrapeCollection() {
        const $items = $(SELECTORS.titleAndArtist);

        if ($items.length === 0) {
            alert('No collection items found!');
            return [];
        }

        // Use map for better performance than each + push
        const collection = $items.map(function() {
            const $item = $(this);
            const title = $item.children('a').first().text().trim();
            const artist = $item.children('span').first().text().trim();

            // Skip invalid entries
            if (!title || !artist) return null;

            return {
                artist,
                title,
                youtubeUrl: buildYouTubeMusicUrl(artist, title)
            };
        }).get().filter(Boolean); // Remove null entries

        console.log(`Scraped ${collection.length} items`);
        return collection;
    }

    /**
     * Build YouTube Music search URL for albums
     */
    function buildYouTubeMusicUrl(artist, title) {
        const query = encodeURIComponent(`${artist} ${title}`);
        return `https://music.youtube.com/search?q=${query}&filter=albums`;
    }

    /**
     * Download collection as JSON file
     */
    function downloadJSON(collection) {
        const json = JSON.stringify(collection, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        $('<a>')
            .attr({
                href: url,
                download: 'discogs-collection.json'
            })
            .get(0)
            .click();

        URL.revokeObjectURL(url);
    }

    // ========== UI FUNCTIONS ==========

    /**
     * Show popup with collection results
     */
    function showResults(collection) {
        $popup.empty();

        // Close button
        $('<button class="tm-close-btn">×</button>')
            .click(hideResults)
            .appendTo($popup);

        // Title
        $('<h2>')
            .text(`Collection (${collection.length} items)`)
            .appendTo($popup);

        // Table
        const $table = createTable(collection);
        $popup.append($table);

        // Show
        $overlay.show();
        $popup.show();
    }

    /**
     * Create results table
     */
    function createTable(collection) {
        const $table = $('<table class="tm-table">');

        // Header
        const $thead = $('<thead>').append(
            $('<tr>').append(
                $('<th>').text('Artist'),
                $('<th>').text('Album'),
                $('<th class="center">').text('YouTube Music')
            )
        );

        // Body
        const $tbody = $('<tbody>');
        collection.forEach((item) => {
            const $row = $('<tr>').append(
                $('<td>').text(item.artist),
                $('<td>').text(item.title),
                createYouTubeCell(item.youtubeUrl)
            );

            $tbody.append($row);
        });

        return $table.append($thead, $tbody);
    }

    /**
     * Create YouTube Music link cell
     */
    function createYouTubeCell(url) {
        const $link = $('<a class="tm-yt-link">')
            .attr({
                href: url,
                target: '_blank'
            })
            .text('Search');

        return $('<td class="center">').append($link);
    }

    /**
     * Hide results popup
     */
    function hideResults() {
        $popup.hide();
        $overlay.hide();
    }

    /**
     * Handle scrape button click
     */
    function handleScrapeClick() {
        const collection = scrapeCollection();

        if (collection.length === 0) return;

        showResults(collection);
        downloadJSON(collection);
    }

    // ========== INITIALIZATION ==========

    /**
     * Initialize UI elements
     */
    function init() {
        // Create overlay
        $overlay = $('<div class="tm-overlay">')
            .click(hideResults)
            .appendTo('body');

        // Create popup
        $popup = $('<div class="tm-popup">')
            .click(e => e.stopPropagation())
            .appendTo('body');

        // Create scrape button
        $('<button class="tm-scrape-btn">Scrape Collection</button>')
            .click(handleScrapeClick)
            .appendTo('body');
    }

    // Start when ready
    $(document).ready(init);

})(jQuery);
