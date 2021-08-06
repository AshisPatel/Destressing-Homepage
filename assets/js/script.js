const contentEl = document.querySelector("#content"); 
const blobContainerEl = document.querySelector("#blobContainer");
const logoBtnEl = document.querySelector("#logo-btn")

const gifBtnEl = document.querySelector("#gif-btn");
// const museumBtnEl = document.querySelector("#museum-btn");
const contentOptionsEl = document.querySelector('#content-options');

const nextBtnEl = document.querySelector("#next-btn"); 
const gifModalEl = document.querySelector("#gifModal"); 
const closeModalBtnEl = document.querySelector("#close-modal-btn"); 
const gifChooseBtnEl = document.querySelector("#gif-choose-btn");
const gifSearchBtnEl = document.querySelector("#gif-search-btn");
const gifSearchFormEl = document.querySelector("#gif-search-form");
const warningEl = document.querySelector(".warning-text");
let prevGifTag = "";

//  Utility functions

const selectRandom = function (array, numItems) {
    let random = [];
    for (let i = 0; random.length < numItems; i++) {
        let randomItem = array[Math.floor(Math.random() * array.length)];
        if (!random.includes(randomItem)) {
            random.push(randomItem);
        }
    }
    return random;
}

// Functions related to welcome page generation

const getCurrentTime = function () {
    const currentDate = new Date();
    const hour = currentDate.getHours();
    getWelcomeMessage(hour);
}

const getWelcomeMessage = function (hour) {
    // Initalize message variables
    let headerText = "";
    let msgText = ""; 

    //Early-hours 
    if (hour >= 0 && hour < 6) {
        console.log("Early-hours"); 
        headerText = "Night Owl or Early Bird?";
        msgText = "Stay Awhile and Relax 😊";
    }
    // Morning-hours
    if (hour >= 6 && hour < 12) {
        console.log("Morning");
        headerText = "Good Morning";
        msgText = "Stay Awhile and Relax 😊";
    }
    // Afternoon-hours
    if (hour >= 12 && hour < 18) {
        console.log("Afternoon"); 
        headerText = "Good Afternoon";
        msgText = "Stay Awhile and Relax 😊";
    }
    
    // Evenning-hours
    if (hour >= 18 && hour < 24) {
        console.log("Evenning");
        headerText = "Good Evenning";
        msgText = "Stay Awhile and Relax 😊";
    }

    displayWelcomeMessage(headerText,msgText); 
}

const displayWelcomeMessage = function(headerText,msgText) {
    contentEl.textContent = "";

    const welcomeHeaderEl = document.createElement("h1");
    welcomeHeaderEl.classList = "space-top-text";
    welcomeHeaderEl.textContent = headerText;

    const welcomeMsgEl = document.createElement("h2");
    welcomeMsgEl.classList = "pt-2"
    welcomeMsgEl.textContent = msgText;

    contentEl.appendChild(welcomeHeaderEl);
    contentEl.appendChild(welcomeMsgEl);
}
// Functions related to gif generation 

const displayGifs = function (gifArray) {
    nextBtnType = "gif";
    // Delete old content in content section
    contentEl.textContent = "";
    // Create div to contain grid of 4 columns , thus '3 rows' for 12 items
    const gridEl = document.createElement("div");
    gridEl.classList = "grid grid-cols-4 justify-items-center gap-5 bg-green-50";
    // Populate grid of taken in array
    for (let i = 0; i < gifArray.length; i++) {
        // Create div to hold each gif img element
        const imgWrapperEl = document.createElement("div");
        imgWrapperEl.classList = "col-span-1 p-8 bg-green-200 rounded";
        // Create image for each gif and add to img-wrapper
        const imgEl = document.createElement("img");
        imgEl.setAttribute("src", gifArray[i].images.original.url);
        imgEl.setAttribute("alt", "");
        imgEl.classList = "w-80 h-80 rounded";
        imgWrapperEl.appendChild(imgEl);
        // Add image-wrapper to grid
        gridEl.appendChild(imgWrapperEl);
    }
    // Add grid to content section
    contentEl.appendChild(gridEl);
}

const getGifs = function (searchTag) {
    nextBtnEl.textContent = `More ${searchTag} gifs`;
    const apiUrl = `https://api.giphy.com/v1/gifs/search?q=${searchTag}&api_key=8uu014p8mspMOtSIJu7z8PtcUxdwsM9x`;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // Grab 4 random gifs from the retrieved gif array 
                const numGifs = 4;
                const retrievedGifs = data.data;
                console.log(retrievedGifs);
                const selectedGifs = selectRandom(retrievedGifs, numGifs);
                // Returned object is contains a "data" key that is an array of 50 gifs
                // Grab numGifs from that array, maybe randomize
                displayGifs(selectedGifs);
                console.log(selectedGifs);
            })
        }
        else {
            console.log("There was a problem finding a gif!");
        }
    });
}
// Handler functions regarding welcome page generation
const logoBtnHandler = function (event) {
    console.log("This is working!"); 
    getCurrentTime();
}
// Handler functions regarding gifs

const gifChooseBtnHandler = function(event) {
    // Set potential tags that could be searched
    const potentialTags = ["kitten", "cat", "dog", "puppy", "cute", "wholesome"];
    // Select a random tag from potential tags
    const randomSearchTag = selectRandom(potentialTags, 1);
    prevGifTag = randomSearchTag;
    getGifs(randomSearchTag);
    gifModalEl.style.display = "none";
}

const gifModalHandler = function (event) {
    warningEl.classList.add("hide");
    warningEl.classList.remove("show");
    gifModalEl.style.display = "block";
}

const gifSearchHandler = function (event) {
    // Make sure there's text in the submit
    event.preventDefault();
    const gifSearchInputEl = document.querySelector("#gif-search-input");
    // Insert something to verify if the search is blank 
    const searchTag = gifSearchInputEl.value.trim();

    // Check if text input is blank
    if (searchTag === "") {
        const warningEl = document.querySelector(".warning-text");
        warningEl.classList.remove("hide");
        warningEl.classList.add("show");
        return;
    }

    prevGifTag = searchTag;
    getGifs(searchTag);
    gifModalEl.style.display = "none";
    gifSearchFormEl.reset();
}
    
const getArt = async function() {

    //To do: Need to add loader

    contentEl.innerHTML = '';
    nextBtnType = "painting"; 
    blobContainerEl.classList.remove("show");

    // Get all objects that have an image and matches the query 'Painting'
    const allMuseumResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=Painting`
    );
    const museumData = await allMuseumResponse.json();

    // Get IDs of the objects
    const museumArray = museumData.objectIDs;
    
    // Get random ID from that array
    const museumId = museumArray[Math.floor((Math.random()*museumArray.length))];

    // Get object matching that ID
    const artResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${museumId}`
    );
    const artData = await artResponse.json();

    const artSource = artData.primaryImageSmall;

    const artWrapper = document.createElement("div");
    const artImg = document.createElement("img");
    artImg.src = artSource;
    artWrapper.setAttribute('style','width:800px;height:550px');

    contentEl.appendChild(artWrapper);
    artWrapper.appendChild(artImg);
    contentEl.classList.add("space-top-image");
    artImg.classList.add("image-mask");

    // Show the next buttona and hide the blobs
    nextBtnEl.classList.add("show", "my-10");
}

// Function to handle displaying more of currently selected content 
const nextBtnHandler = function (event) {

    if (nextBtnType === "gif") {
        getGifs(prevGifTag);
    }

    if (nextBtnType === "joke") {
        // Insert function to fetch joke
    }

    if (nextBtnType === "painting") {
        getArt();
        // Hide the button while it's grabbing the response and show in the function
        nextBtnEl.classList.remove("show"); 
    }

    if (nextBtnType === "quote") {
        // Insert function to get quote 
    }
}

const closeModalBtnHandler = function(event) {
    gifModalEl.style.display= "none"; 
}

//gifBtnEl.addEventListener("click",gifModalHandler); 

// Run the function based on the value in the dropdown
contentOptionsEl.addEventListener('change', function() {
    if (contentOptionsEl.value === 'painting') {
        getArt();
    }
    // Add the other conditionals here
})

gifChooseBtnEl.addEventListener("click", gifChooseBtnHandler);
gifSearchFormEl.addEventListener("submit", gifSearchHandler);
nextBtnEl.addEventListener("click", nextBtnHandler);   
closeModalBtnEl.addEventListener("click",closeModalBtnHandler); 
logoBtnEl.addEventListener("click",logoBtnHandler);


// On load, generate welcome message

window.onload = function() {
    logoBtnHandler(); 
}