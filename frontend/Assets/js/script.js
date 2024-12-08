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

document.addEventListener('DOMContentLoaded', async function() {
    const propertyList = document.getElementById('featuredPropertyList');

    try {
        // Fetch properties data from JSON file
        const response = await fetch('./Assets/json/properties.json');
        const properties = await response.json();

        // Get the top 6 properties
        const topProperties = properties.slice(0, 6);

        // Render the property cards
        renderPropertyCards(topProperties, 'featuredPropertyList');
    } catch (error) {
        console.error("Error loading properties:", error);
    }
});

window.redirectToPropertyInfo = function(propertyId) {
    window.location.href = `property_info.html?id=${propertyId}`;
};