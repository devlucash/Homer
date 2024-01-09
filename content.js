document.body.style.border = "5px solid red";
// if js wont load try disabling and reenabling the extension? not sure of problem
// content.js

document.addEventListener('DOMContentLoaded', function () {
    console.log('Content script loaded');

    // Rest of your content script logic...
});
const addressElement = selectedProperty.querySelector('.property-info-address');
const priceElement = selectedProperty.querySelector('.property-price.property-info__price');
console.log("AddressQuery:" + addressElement);
console.log("PriceQuery:" +priceElement);   // wont log at all..


// Function to extract property details from the selected property
function getPropertyDetails(selectedProperty) {
    const addressElement = selectedProperty.querySelector('.property-info-address');
    const priceElement = selectedProperty.querySelector('.property-price.property-info__price');
    console.log("AddressQuery:" + addressElement);
    console.log("PriceQuery:" +priceElement);

    // Check if the price is available
    let price = priceElement ? priceElement.textContent.trim() : 'Contact Agent';

    // If the price is "Contact Agent", set it to a default value (e.g., 0)
    if (price.toLowerCase() === 'contact agent') {
        price = 'Contact Agent';
    }

    // Extract other details as needed
    const address = addressElement ? addressElement.textContent.trim() : 'Unknown Address';
    console.log(address);
    return { address, price };
}

// Function to check if the property is within the specified price range
function isPropertyWithinRange(price, upperLimit) {
    // Convert the price to a numeric value (remove non-numeric characters)
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));

    // Check if the numeric price is within the desired range (e.g., 0 to upperLimit)
    return numericPrice >= 0 && numericPrice <= upperLimit;
}

// Function to update the URL with the selected property details and upper limit
function updateURL(propertyDetails, upperLimit) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('address', propertyDetails.address);
    urlParams.set('price', propertyDetails.price);
    urlParams.set('upperLimit', upperLimit);

    const newURL = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, document.title, newURL);
}

// Function to add text element with the upper limit beneath the property price
function addUpperLimitText(propertyPrice, upperLimit) {
    const upperLimitText = document.createElement('span');
    upperLimitText.className = 'upper-limit-text';
    upperLimitText.textContent = `Homer Estimated Price: $${upperLimit}`;

    propertyPrice.parentNode.appendChild(upperLimitText);
}

// Function to simulate the interval querying
function simulateIntervalQuery(startingUpperLimit, increment) {
    let currentUpperLimit = startingUpperLimit;

    // Simulate querying at intervals and checking if the existing address is found
    const intervalId = setInterval(() => {
        const selectedProperty = document.querySelector('.property-card'); // Adjust the selector based on your actual structure

        if (selectedProperty) {
            const propertyDetails = getPropertyDetails(selectedProperty);

            // Check if the property is within the specified price range
            if (isPropertyWithinRange(propertyDetails.price, currentUpperLimit)) {
                // Update the URL with the property details and current upper limit
                updateURL(propertyDetails, currentUpperLimit);

                // Add text element with the current upper limit beneath the property price
                const propertyPriceElement = selectedProperty.querySelector('.property-price');
                addUpperLimitText(propertyPriceElement, currentUpperLimit);

                console.log('Selected Property Details:', propertyDetails);
                console.log('Current Upper Limit:', currentUpperLimit);
            } else {
                console.log('Property is outside the specified price range.');
            }

            // Increment the upper limit for the next iteration
            currentUpperLimit += increment;
        } else {
            console.log('Property not found. Stopping interval query.');
            clearInterval(intervalId);
        }
    }, 1000); // Adjust the interval time as needed (in milliseconds)
}

// Start the interval querying with a starting upper limit of 100k and increments of 25k
simulateIntervalQuery(100000, 25000);
