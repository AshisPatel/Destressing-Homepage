const quoteEl = document.querySelector("#quote-btn");
const contentEl = document.querySelector("#content");
const blobContainerEl = document.querySelector("#blobContainer");
const logoBtnEl = document.querySelector("#logo-btn")

const gifBtnEl = document.querySelector("#gif-btn");

const contentOptionsEl = document.querySelector('#content-options');

const nextBtnEl = document.querySelector("#next-btn");
const searchBtnEl = document.querySelector("#search-btn");
const surpriseBtnEl = document.querySelector("#surprise-btn"); 
const searchModalEl = document.querySelector("#searchModal");
const searchModalContentEl = document.querySelector("#searchModalContent");
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
    let relaxMsg = ["It’s okay to take a break.", "Disconnect to reconnect.", "Relax. Nothing is under control.", "Rest your mind. Calm your heart.", "If you’re tired, learn to rest not quit.", "For the love of your work, take a break!", "Rest and be thankful.", "Sometimes a break is the very thing you need.", "Taking a break can lead to breakthroughs.", "Take a break and have fun.", "Life isn’t as serious as we think.", "Take a deep breath.", "Turn off your mind, relax, and float downstream.", "Nature does not hurry, yet everything is accomplished."];
    let headerText = "";
    let msgText = selectRandom(relaxMsg, 1);

    //Early-hours 
    if (hour >= 0 && hour < 6) {
        headerText = "Night Owl or Early Bird?";
    }
    // Morning-hours
    if (hour >= 6 && hour < 12) {
        headerText = "Good Morning";
    }
    // Afternoon-hours
    if (hour >= 12 && hour < 18) {
        headerText = "Good Afternoon";
    }

    // Evenning-hours
    if (hour >= 18 && hour < 24) {
        headerText = "Good Evening";
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
    welcomeHeaderEl.classList = "space-top-text appear-header";
    welcomeHeaderEl.textContent = headerText;

    const welcomeMsgEl = document.createElement("h3");
    welcomeMsgEl.classList = "pt-2 appear-msg"
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

    searchModalEl.classList.add("show");
    searchModalContentEl.classList.add("modal-slide-in");
    searchModalContentEl.classList.remove("modal-slide-out");

    const searchCategoryEl = document.querySelector("#search-category");
    // Add current category to search header in modal 

    searchCategoryEl.textContent = currentContent.charAt(0).toUpperCase() + currentContent.slice(1);

}

const modalChooseBtnHandler = function (event) {

    // Hide modal 
    searchModalEl.classList.remove("show");
    searchModalContentEl.classList.remove("modal-slide-in");
    searchModalContentEl.classList.add("modal-slide-out");

    // Check which display is on the screen 

    if (currentContent === "gif") {
        getRandomGif();
    }

    if (currentContent === "painting") {
        // Insert function to call random painting
        getArt("Painting");
    }

    if (currentContent === "quote") {
        // Insert function to call random quote
    }

    if (currentContent === "joke") {
        // Insert function to call random joke 
        getjoke();
    }
}

const modalSearchHandler = function (event) {

    //event.preventDefault();

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
    searchModalEl.classList.remove("show");
    searchModalContentEl.classList.remove("modal-slide-in");
    searchModalContentEl.classList.add("modal-slide-out");

    // Check for content of search 
    if (currentContent === "gif") {
        prevGifTag = searchTag;
        getGifs(searchTag);

        modalSearchFormEl.reset();
    }

    if (currentContent === "painting") {
        // Insert function to call random painting
        getArt(searchTag);
        modalSearchFormEl.reset();
    }

    if (currentContent === "quote") {
        // Insert function to call random quote
    }

    if (currentContent === "joke") {
        // Insert function to call random joke
        searchJoke(searchTag);
        modalSearchFormEl.reset();
    }
}

// Functions related to gif generation 

const getRandomGif = function (event) {
    // Set potential tags that could be searched
    const potentialTags = ["kitten", "cat", "dog", "puppy", "cute", "wholesome", "peaceful", "relaxing", "rain", "happy", "cute animal", "baby animal"];
    // Select a random tag from potential tags
    const randomSearchTag = selectRandom(potentialTags, 1);
    prevGifTag = randomSearchTag;
    getGifs(randomSearchTag);
    //searchModalEl.style.display = "none";
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
    //gifWrapper.setAttribute("style", "width:800px;height:550px");
    gifWrapper.classList = "flex justify-center media-wrapper";
    const gifImg = document.createElement("img");
    gifImg.classList.add("image-mask");


    gifImg.setAttribute("src", gif[0].images.original.url);
    gifWrapper.appendChild(gifImg);
    contentEl.appendChild(gifWrapper);

    nextBtnEl.classList.add("show", "my-10");
    searchBtnEl.classList.remove("hide");
    searchBtnEl.classList.add("show", "my-10");
}


// Functions regarding artwork generation 

const getArt = async function (searchTag) {
    // Hide the button while it's grabbing the response and show in the function
    nextBtnEl.classList.remove("show");
    searchBtnEl.classList.remove("show");

    // Create loader
    const loader = document.createElement("img");
    loader.src = "assets/img/loader.gif";
    loader.setAttribute("style", "width:350px;height:350px");

    contentEl.innerHTML = '';
    currentContent = "painting";
    blobContainerEl.classList.remove("show");

    contentEl.appendChild(loader);

    // Get all objects that have an image and matches the query 'Painting'
    // Use try/catch to catch any errors
    try {
        const allMuseumResponse = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${searchTag}`
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

        // Remove loader to show image
        contentEl.removeChild(loader);

        const artSource = artData.primaryImageSmall;

        const artWrapper = document.createElement("div");
        const artImg = document.createElement("img");
        artImg.src = artSource;
        artWrapper.classList = 'media-wrapper';

        contentEl.appendChild(artWrapper);
        artWrapper.appendChild(artImg);
        contentEl.classList.add("space-top-image");
        artImg.classList.add("image-mask");

        // Show the next buttona and hide the blobs
        nextBtnEl.classList.add("show", "my-10");

        nextBtnEl.textContent = `More artwork`;

        searchBtnEl.classList.remove("hide");
        searchBtnEl.classList.add("show", "my-10");

        } catch (error) {
            console.log(`There was a problem grabbing the artwork! Error: ${error}`);
        }
}

// Function to handle displaying more of currently selected content 
const nextBtnHandler = function (event) {

    if (currentContent === "gif") {
        getGifs(prevGifTag);

    }

    if (currentContent === "joke") {
        // Insert function to fetch joke
        getjoke();
    }

    if (currentContent === "painting") {
        getArt();
    }


    if (currentContent === "quote") {
        startQuotes();
    }
}


const closeModalBtnHandler = function (event) {
    searchModalContentEl.classList.remove("modal-slide-in");
    searchModalContentEl.classList.add("modal-slide-out");
    searchModalEl.classList.remove("show");

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
                quoteCard.classList = "space-top-text";
                quoteCard.setAttribute("style", "max-width: 70%");

                const quoteTextArea = document.createElement("div");
                quoteTextArea.classList = "w-full mb-5";
                quoteCard.appendChild(quoteTextArea);

                const randomQuote = document.createElement("h2");
                randomQuote.textContent = '"' + data.content + '"';
                quoteTextArea.appendChild(randomQuote);

                const autorArea = document.createElement("div");
                autorArea.classList = "w-full";
                quoteCard.appendChild(autorArea);

                const autorName = document.createElement("h4");
                autorName.classList = "text-md text-center";
                autorName.textContent = "\u2015" +data.author;
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


const createRipple = function (event) {
    const button = event.currentTarget;
    // Calculate the ripple size based on the button
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;

    // Add the light ripple for the modal search button
    if (button === modalSearchBtnEl) {
        console.log("light-ripple")
        circle.classList.add("light-ripple");
        const rippleLight = document.getElementsByClassName("light-ripple")[0];
        // Remove leftover ripples if there are any
        if (rippleLight) {
            rippleLight.remove();
        }
    }

    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    // Remove leftover ripples if there are any
    if (ripple) {
        ripple.remove();
    }
    // Append the ripple span
    button.appendChild(circle);
}

//Joke section

const getjoke = async function () {

    currentContent = "joke";


    //call Api
    const jokefetch = await fetch('https://icanhazdadjoke.com/', {
        headers: {
            'Accept': 'application/json'
        }
    });

    const jokeContent = await jokefetch.json();

    //console.log(jokeContent.joke);
    //Passing joke on screen
    blobContainerEl.classList.remove("hide");
    blobContainerEl.classList.add("show");
    nextBtnEl.classList.remove("show", "my-10");
    searchBtnEl.classList.remove("show", "my-10");
    contentEl.classList.remove("space-top-image");
    contentEl.textContent = "";

    const jokeContainer = document.createElement("div");
    jokeContainer.classList = "jokeContainer space-top-text w-3/4";

    const jokeContentEL = document.createElement("h2");
    jokeContentEL.classList = "pt-2 ";
    jokeContainer.appendChild(jokeContentEL);
    contentEl.appendChild(jokeContainer);

    jokeContentEL.innerHTML = jokeContent.joke;

    nextBtnEl.textContent = "More jokes";
    nextBtnEl.classList.add("show", "my-10");

    searchBtnEl.classList.remove("hide");
    searchBtnEl.classList.add("show", "my-10");
}

//call for search
async function searchJoke(searchTag) {

    //call Api
    const jokefetch = await fetch('https://icanhazdadjoke.com/search?term=' + searchTag, {
        headers: {
            'Accept': 'application/json'
        }
    });

    const jokeContent = await jokefetch.json();
    console.log(jokeContent.results);

    var jokerandom= selectRandom(jokeContent.results,1);
    console.log(jokerandom);


    blobContainerEl.classList.remove("hide");
    blobContainerEl.classList.add("show");
    nextBtnEl.classList.remove("show", "my-10");
    searchBtnEl.classList.remove("show", "my-10");
    contentEl.classList.remove("space-top-image");
    contentEl.textContent = "";

    const jokeContainer = document.createElement("div");
    jokeContainer.classList = "jokeContainer space-top-text w-3/4";

    const jokeContentEL = document.createElement("h2");
    jokeContentEL.classList = "pt-2 ";
    jokeContainer.appendChild(jokeContentEL);
    contentEl.appendChild(jokeContainer);

    //Passing joke on screen
    jokeContentEL.innerHTML = jokerandom[0].joke;

    nextBtnEl.textContent = "More jokes";
    nextBtnEl.classList.add("show", "my-10");

    searchBtnEl.classList.remove("hide");
    searchBtnEl.classList.add("show", "my-10");

    //Passing joke on screen
}

// Function for suprise option

const getSurprise = function () {
    const options = ["gif", "painting", "quote", "joke"];

    const selected = selectRandom(options, 1)[0];
    // Call function to display selected content and change the dropdown to the option that represents the content 
    switch (selected) {
        case "gif":
            getRandomGif();
            contentOptionsEl.selectedIndex = 1;
            break;
        case "painting":
            contentOptionsEl.selectedIndex = 2;
            getArt();
            break;
        case "quote":
            contentOptionsEl.selectedIndex = 3;
            startQuotes();
            break;
        case "joke":
            contentOptionsEl.selectedIndex = 4;
            getjoke();
    }
}

const surpriseBtnHandler = function(event) {
    getSurprise(); 
}

logoBtnEl.addEventListener("click", logoBtnHandler);

// Run the function based on the value in the dropdown
contentOptionsEl.addEventListener('change', function () {
    if (contentOptionsEl.value === 'painting') {
        getArt("Painting");
    }

    if (contentOptionsEl.value === 'quote') {
        startQuotes();
    }

    if (contentOptionsEl.value === 'gif') {
        getRandomGif();
    }

    if (contentOptionsEl.value === 'joke') {
        getjoke();
    }
})


searchBtnEl.addEventListener("click", createRipple);
// Timeouts added so you can see the ripple effect before the function is called
searchBtnEl.addEventListener("click", function () {
    setTimeout(searchBtnHandler, 350);
});

modalChooseBtnEl.addEventListener("click", createRipple);
modalChooseBtnEl.addEventListener("click", function () {
    setTimeout(modalChooseBtnHandler, 350)
});

modalSearchBtnEl.addEventListener("click", createRipple);
modalSearchFormEl.addEventListener("submit", function () {
    setTimeout(modalSearchHandler, 300);
});

nextBtnEl.addEventListener("click", createRipple);
nextBtnEl.addEventListener("click", function () {
    setTimeout(nextBtnHandler, 300)
});

surpriseBtnEl.addEventListener("click", createRipple);
surpriseBtnEl.addEventListener("click", function() {
    setTimeout(surpriseBtnHandler, 300)
}); 

closeModalBtnEl.addEventListener("click", closeModalBtnHandler);

// Function Handlers that will play audio on button click 

const setVolume = function () {
    // Get volume from slider value 
    const newVolume = volumeControlEl.value / 100;
    // Grab all sounds buttons that are currently playing 
    const playingSounds = document.querySelectorAll(".play");
    // Go through each sound in the playing sounds array and set their volume 
    playingSounds.forEach(function (playingSound) {
        playingSound.querySelector("audio").volume = newVolume;
    })
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


// Close modal on background click
document.addEventListener("click", function (event) {
    // Do nothing if the target doesn't match
    if (!event.target.matches('.search-modal')) {
        return;
    }

    else {
        event.target.classList.remove("show");
        searchModalContentEl.classList.remove("modal-slide-in");
        searchModalContentEl.classList.add("modal-slide-out");
    }
})


soundDropDownEl.addEventListener("click", soundBtnHandler);
volumeControlEl.addEventListener("change", setVolume);
volumeControlEl.addEventListener("input", setVolume);

// On load, generate welcome message

window.onload = function () {
    logoBtnHandler();
}
