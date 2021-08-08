const quoteEl = document.querySelector("#quote-btn");
const contentEl = document.querySelector("#content");
const blobContainerEl = document.querySelector("#blobContainer");
const logoBtnEl = document.querySelector("#logo-btn")

const gifBtnEl = document.querySelector("#gif-btn");
// const museumBtnEl = document.querySelector("#museum-btn");
const contentOptionsEl = document.querySelector('#content-options');

const nextBtnEl = document.querySelector("#next-btn");
const searchBtnEl = document.querySelector("#search-btn");
const searchModalEl = document.querySelector("#searchModal");
const closeModalBtnEl = document.querySelector("#close-modal-btn");
const modalChooseBtnEl = document.querySelector("#modal-choose-btn");
const modalSearchBtnEl = document.querySelector("#modal-search-btn");
const modalSearchFormEl = document.querySelector("#modal-search-form");
const warningEl = document.querySelector(".warning-text");
let prevGifTag = "";
let currentContent = "";

// DOM elements related to sound
const soundDropDownEl = document.querySelector(".sound-dropdown-content");
const volumeControlEl = document.querySelector("#volume-slider");
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

    displayWelcomeMessage(headerText, msgText);
}

const displayWelcomeMessage = function (headerText, msgText) {
    // Reset home page 
    blobContainerEl.classList.remove("hide");
    blobContainerEl.classList.add("show");

    nextBtnEl.classList.remove("show", "my-10");
    searchBtnEl.classList.remove("show", "my-10");

    contentEl.classList.remove("space-top-image");
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

// Handler functions regarding welcome page generation
const logoBtnHandler = function (event) {
    // Grab time and message based on time
    getCurrentTime();
    // Reset selected menu to default option
    contentOptionsEl.selectedIndex = 0;
}


// Functions regarding modals 

const searchBtnHandler = function (event) {
    warningEl.classList.add("hide");
    warningEl.classList.remove("show");

    const searchCategoryEl = document.querySelector("#search-category");
    // Add current category to search header in modal 
    searchCategoryEl.textContent = currentContent.charAt(0).toUpperCase() + currentContent.slice(1);
    searchModalEl.style.display = "block";
}

const modalChooseBtnHandler = function (event) {

    // Hide modal 
    searchModalEl.style.display = "none";
    // Check which display is on the screen 

    if (currentContent === "gif") {
        getRandomGif();
    }

    if (currentContent === "painting") {
        // Insert function to call random painting
        getArt();
    }

    if (currentContent === "quote") {
        // Insert function to call random quote
    }

    if (currentContent === "joke") {
        // Insert function to call random joke 
    }
}

const modalSearchHandler = function (event) {
    event.preventDefault();

    const modalSearchInputEl = document.querySelector("#modal-search-input");
    const searchTag = modalSearchInputEl.value.trim();

    // Check if text input is blank
    if (searchTag === "") {
        const warningEl = document.querySelector(".warning-text");
        warningEl.classList.remove("hide");
        warningEl.classList.add("show");
        return;
    }

    // Hide Modal
    searchModalEl.style.display = "none";

    // Check for content of search 
    if (currentContent === "gif") {
        prevGifTag = searchTag;
        getGifs(searchTag);

        modalSearchFormEl.reset();
    }

    if (currentContent === "painting") {
        // Insert function to call random painting
        console.log("Painting Search Test");
    }

    if (currentContent === "quote") {
        // Insert function to call random quote
    }

    if (currentContent === "joke") {
        // Insert function to call random joke 
    }
}

// Functions related to gif generation 

const getRandomGif = function (event) {
    // Set potential tags that could be searched
    const potentialTags = ["kitten", "cat", "dog", "puppy", "cute", "wholesome"];
    // Select a random tag from potential tags
    const randomSearchTag = selectRandom(potentialTags, 1);
    prevGifTag = randomSearchTag;
    getGifs(randomSearchTag);
    searchModalEl.style.display = "none";
}

const getGifs = function (searchTag) {
    nextBtnEl.textContent = `More ${searchTag} gifs`;
    const apiUrl = `https://api.giphy.com/v1/gifs/search?q=${searchTag}&api_key=8uu014p8mspMOtSIJu7z8PtcUxdwsM9x`;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // Grab a random gifs from the retrieved gif array 
                const numGifs = 1;
                const retrievedGifs = data.data;
                console.log(retrievedGifs);
                const selectedGifs = selectRandom(retrievedGifs, numGifs);
                // Returned object is contains a "data" key that is an array of 50 gifs
                // Grab numGifs from that array, maybe randomize

                displayGifs(selectedGifs);

            })
        }
        else {
            console.log("There was a problem finding a gif!");
        }
    });
}

const displayGifs = function (gif) {
    currentContent = "gif";
    // Delete old content in content section
    blobContainerEl.classList.remove("show");
    blobContainerEl.classList.add("hide");
    contentEl.textContent = "";
    contentEl.classList.add("space-top-image");

    const gifWrapper = document.createElement("div");
    gifWrapper.setAttribute("style", "width:800px;height:550px");
    gifWrapper.classList = "flex justify-center";
    const gifImg = document.createElement("img");
    gifImg.classList.add("image-mask");
    gifImg.setAttribute("style", "width:480px;height:480px");
    gifImg.setAttribute("src", gif[0].images.original.url);
    gifWrapper.appendChild(gifImg);
    contentEl.appendChild(gifWrapper);

    nextBtnEl.classList.add("show", "my-10");
    searchBtnEl.classList.remove("hide");
    searchBtnEl.classList.add("show", "my-10");
}


// Functions regarding artwork generation 

const getArt = async function () {
    // Hide the button while it's grabbing the response and show in the function
    nextBtnEl.classList.remove("show");
    searchBtnEl.classList.remove("show");

    //To do: Need to add loader

    contentEl.innerHTML = '';
    currentContent = "painting";
    blobContainerEl.classList.remove("show");

    // Get all objects that have an image and matches the query 'Painting'
    const allMuseumResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=Painting`
    );
    const museumData = await allMuseumResponse.json();

    // Get IDs of the objects
    const museumArray = museumData.objectIDs;

    // Get random ID from that array
    const museumId = museumArray[Math.floor((Math.random() * museumArray.length))];

    // Get object matching that ID
    const artResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${museumId}`
    );
    const artData = await artResponse.json();

    const artSource = artData.primaryImageSmall;

    const artWrapper = document.createElement("div");
    const artImg = document.createElement("img");
    artImg.src = artSource;
    artWrapper.setAttribute('style', 'width:800px;height:550px');

    contentEl.appendChild(artWrapper);
    artWrapper.appendChild(artImg);
    contentEl.classList.add("space-top-image");
    artImg.classList.add("image-mask");

    // Show the next buttona and hide the blobs
    nextBtnEl.classList.add("show", "my-10");

    nextBtnEl.textContent = `More artwork`;

    searchBtnEl.classList.remove("hide");
    searchBtnEl.classList.add("show", "my-10");
}

// Function to handle displaying more of currently selected content 
const nextBtnHandler = function (event) {

    if (currentContent === "gif") {
        getGifs(prevGifTag);

    }

    if (currentContent === "joke") {
        // Insert function to fetch joke
    }

    if (currentContent === "painting") {
        getArt();
    }


    if (currentContent === "quote") {
        startQuotes();
    }
}

const closeModalBtnHandler = function (event) {
    searchModalEl.style.display = "none";

}

const startQuotes = function (event) {

    fetch("https://api.quotable.io/random").then(function (response) {

        if (response.ok) {
            blobContainerEl.classList.remove("hide");
            blobContainerEl.classList.add("show");
            searchBtnEl.classList.remove("show", "my-10");
            searchBtnEl.classList.add("hide");
            contentEl.textContent = "";
            currentContent = "quote";
            response.json().then(function (data) {
                //  console.log(data);
                // alert("quotes Working!")
                // console.log(data.content)

                const quoteCard = document.createElement("div");
                quoteCard.classList = "w-full mx-auto rounded-lg bg-white shadow-lg px-5 pt-5 pb-10 text-gray-800";
                quoteCard.setAttribute("style", "max-width: 500px")

                const quoteTextArea = document.createElement("div");
                quoteTextArea.classList = "w-full mb-10";
                quoteCard.appendChild(quoteTextArea);

                const randomQuote = document.createElement("p")
                randomQuote.classList = "text-sm text-gray-600 text-center px-5"
                randomQuote.textContent = '"' + data.content + '"';
                quoteTextArea.appendChild(randomQuote);

                const autorArea = document.createElement("div");
                autorArea.classList = "w-full";
                quoteCard.appendChild(autorArea)

                const autorName = document.createElement("p");
                autorName.classList = "text-md text-indigo-500 font-bold text-center";
                autorName.textContent = data.author;
                autorArea.appendChild(autorName);

                contentEl.appendChild(quoteCard);

                nextBtnEl.textContent = "More quotes";
                nextBtnEl.classList.add("show", "my-10");
            })
        } else {
            alert("link not working")
        }
    });
};


// Run the function based on the value in the dropdown
contentOptionsEl.addEventListener('change', function () {
    if (contentOptionsEl.value === 'painting') {
        getArt();
    }

    if (contentOptionsEl.value === 'quote') {
        startQuotes();
    }

    if (contentOptionsEl.value === 'gif') {
        getRandomGif();
    }
})

// Function Handlers that will play audio on button click 

const setVolume = function () {
    // Get volume
    const newVolume = volumeControlEl.value / 100;
    // Grab all audio elementss that are currently playing 
    audios = document.getElementsByClassName("play");
    // Go through each audio that in the playingAudio array and set the volume
    console.log(audios[0]);

    // audios.forEach(function(audio){
    //     audio.volume = newVolume
    // });
}

const soundBtnHandler = function (event) {
    // Grab the sound button of the icon that was clicked
    const selectedSoundBtnEl = event.target.closest("button");
    // Grab the audio of the icon that was clicked IF a valid button was found
    if (!selectedSoundBtnEl) {
        return; 
    }
    
    const selectedSoundAudioEl = selectedSoundBtnEl.querySelector("audio");

    // Check to see if audio is already playing or not 
    if (!selectedSoundBtnEl.classList.contains("play")) {
        // Add play class to the button to update button visual
        selectedSoundBtnEl.classList.add("play");
        // Start playing audio associated with icon and loop
        selectedSoundAudioEl.play();
        selectedSoundAudioEl.loop = true;
    }

    else {
        // Remove play class to visually show sound is no longer being played
        selectedSoundBtnEl.classList.remove("play");
        // Stop selected audio and loop 
        selectedSoundAudioEl.pause();
        selectedSoundAudioEl.loop = false;
    }

}


searchBtnEl.addEventListener("click", searchBtnHandler);
modalChooseBtnEl.addEventListener("click", modalChooseBtnHandler);
modalSearchFormEl.addEventListener("submit", modalSearchHandler);
nextBtnEl.addEventListener("click", nextBtnHandler);
closeModalBtnEl.addEventListener("click", closeModalBtnHandler);

logoBtnEl.addEventListener("click", logoBtnHandler);

soundDropDownEl.addEventListener("click", soundBtnHandler);
volumeControlEl.addEventListener("change", setVolume);
volumeControlEl.addEventListener("input", setVolume);
// On load, generate welcome message

window.onload = function () {
    logoBtnHandler();
}
