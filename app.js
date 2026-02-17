// Your OpenWeatherMap API Key
const API_KEY = 'fc8bef3f051346dca63f8bafded30cb1';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
async function getWeather(city) {
    // Show loading state at the START
    showLoading();
    
    // Disable search button and update text
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
    
    // Build the API URL
    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    
    // Wrap in try-catch block
    try {
        // Use await with axios.get()
        const response = await axios.get(url);
        
        // Log the response (for debugging)
        console.log('Weather Data:', response.data);
        
        // Call displayWeather with response.data
        displayWeather(response.data);
        
    } catch (error) {
        // Log the error
        console.error('Error fetching weather:', error);
        
        // Show appropriate error message based on error type
        if (error.response && error.response.status === 404) {
            // City not found error
            showError('City not found. Please check the spelling and try again.');
        } else if (error.response && error.response.status === 401) {
            // API key error
            showError('API key error. Please check your configuration.');
        } else if (error.message === 'Network Error') {
            // Network error
            showError('Network error. Please check your internet connection.');
        } else {
            // Generic error
            showError('Could not fetch weather data. Please try again.');
        }
    } finally {
        // Re-enable search button and restore text
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Search';
    }
}

// Function to display weather data
function displayWeather(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    // Create HTML to display
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
    
    // Put it on the page
    document.getElementById('weather-display').innerHTML = weatherHTML;
    
    // Focus back on input for quick follow-up searches
    cityInput.focus();
}

// Function to display error message
function showError(message) {
    // Create HTML for error message with styling
    const errorHTML = `
        <div class="error-container">
            <p class="error-message">❌ ${message}</p>
            <p class="error-hint">Please check the city name and try again.</p>
        </div>
    `;
    
    // Display in #weather-display div
    document.getElementById('weather-display').innerHTML = errorHTML;
}

// Function to display loading state
function showLoading() {
    // Create loading HTML with spinner and text
    const loadingHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p class="loading-text">Fetching weather data...</p>
        </div>
    `;
    
    // Display in #weather-display
    document.getElementById('weather-display').innerHTML = loadingHTML;
}

// Get references to HTML elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

// Function to handle search
function handleSearch() {
    const city = cityInput.value.trim();
    
    // Validate - Check if empty
    if (!city) {
        showError('Please enter a city name.');
        return;
    }
    
    // Validate - Check minimum length
    if (city.length < 2) {
        showError('City name too short. Please enter at least 2 characters.');
        return;
    }
    
    // Show loading state
    showLoading();
    
    // Call getWeather(city)
    getWeather(city);
}

// Add click event listener to search button
searchBtn.addEventListener('click', handleSearch);

// Add enter key support for input field
cityInput.addEventListener('keypress', function(event) {
    // Check if Enter key was pressed (event.key === 'Enter')
    if (event.key === 'Enter') {
        // Trigger the same search logic
        handleSearch();
    }
});

// Show welcome message on page load
document.addEventListener('DOMContentLoaded', function() {
    const welcomeHTML = `
        <div class="welcome-container">
            <p class="welcome-message">👋 Welcome to SkyFetch!</p>
            <p class="welcome-hint">Search for a city above to check the weather.</p>
        </div>
    `;
    document.getElementById('weather-display').innerHTML = welcomeHTML;
});