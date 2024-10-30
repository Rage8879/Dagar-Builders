'use strict';

/**
 * element toggle function
 */
const elemToggleFunc = function (elem) { 
    elem.classList.toggle("active"); 
}

/**
 * navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [overlay, navCloseBtn, navOpenBtn];

/**
 * close navbar when clicking on any navbar link
 */
for (let i = 0; i < navbarLinks.length; i++) { 
    navElemArr.push(navbarLinks[i]); 
}

/**
 * add event on all elements for toggling navbar
 */
for (let i = 0; i < navElemArr.length; i++) {
    navElemArr[i].addEventListener("click", function () {
        elemToggleFunc(navbar);
        elemToggleFunc(overlay);
    });
}

/**
 * header active state
 */
const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
    window.scrollY >= 400 ? header.classList.add("active")
        : header.classList.remove("active");
}); 

document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('search-btn');
    const searchPopover = document.getElementById('search-popover');
    const searchInput = searchPopover.querySelector('input'); // Select the input field within the popover

    // Toggle popover visibility on button click
    searchBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent event from bubbling up
        searchPopover.style.display = searchPopover.style.display === 'block' ? 'none' : 'block';
        
        // Focus the input field if the popover is visible
        if (searchPopover.style.display === 'block') {
            searchInput.focus(); // Focus the input field
        }
    });

    // Close popover when clicking outside of it
    document.addEventListener('click', function (event) {
        if (!searchBtn.contains(event.target) && !searchPopover.contains(event.target)) {
            searchPopover.style.display = 'none';
        }
    });
});
