// Import from other js files
import {spline} from './spline.js';
import {pointsInPath} from './pointsInPath.js';
import {createCoordsTransformer} from './createCoordsTransformer.js';

// DOM elements related to the main page static elements 
const contentEl = document.querySelector("#content");
const logoBtnEl = document.querySelector("#logo-btn")
const contentOptionsEl = document.querySelector('#content-options');
let time = ""; 

// DOM elements related to the blobs
const blobContainerEl = document.querySelector("#blobContainer");
const blob1 = document.querySelector('#blob1');
const blob2 = document.querySelector('#blob2');

// DOM elements related to Search-Modal 
const nextBtnEl = document.querySelector("#next-btn");
const searchBtnEl = document.querySelector("#search-btn");
const surpriseBtnEl = document.querySelector("#surprise-btn"); 
const searchModalEl = document.querySelector("#search-modal");
const searchModalContentEl = document.querySelector("#search-modal-content");
const closeModalBtnEl = document.querySelector("#close-modal-btn");

const modalChooseBtnEl = document.querySelector("#modal-choose-btn");
const modalSearchBtnEl = document.querySelector("#modal-search-btn");
const modalSearchFormEl = document.querySelector("#modal-search-form");
const warningEl = document.querySelector(".warning-text");
let prevGifTag = "";
let currentContent = "";

// DOM elements related to Error-Modal 
const okBtnEl = document.querySelector("#ok-btn"); 
const errorModalEl = document.querySelector("#error-modal");
const errorModalContentEl = document.querySelector("#error-modal-content"); 

// DOM elements related to sound
const soundBtnEl = document.querySelector(".sound-btn"); 
const soundModalEl = document.querySelector("#sound-modal"); 
const soundModalContentEl = document.querySelector("#sound-modal-content"); 
const soundOptionsWrapperEl = document.querySelector("#sound-options-wrapper");
const soundDropDownEl = document.querySelector(".sound-dropdown-content");
const volumeControlEl = document.querySelector("#volume-slider");
const soundOptions = [{name: "rain",icon: "fas fa-cloud-rain fa-3x"}, {name: "cafe", icon: "fas fa-coffee fa-3x"}, {name: "city", icon: "fas fa-city fa-3x"}, {name: "forest", icon: "fas fa-tree fa-3x"}, {name: "fire", icon:"fas fa-fire fa-3x"}, {name: "space", icon: "fas fa-rocket fa-3x"}];

const savePresetBtnEl = document.querySelector("#save-preset-btn"); 
const presetNameInputEl = document.querySelector("#preset-name-input"); 
const presetWarningEl = document.querySelector("#preset-warning");
const presetSelectEl = document.querySelector("#preset-select"); 

const clearPresetBtnEl = document.querySelector("#clear-preset-btn"); 
const resetSoundBtnEl = document.querySelector("#reset-sound-modal-btn"); 
const closeSoundBtnEl = document.querySelector("#close-sound-modal-btn"); 

let presets = []; 
let playingSounds = []; 

// DOM elements related to CSS / Color Variation
const cssRoot = document.querySelector(":root");
//  Utility function

// Function to grab a random items x amount of times from an array 
const selectRandom = function (array, numItems) {
    let random = [];
    for (let i = 0; random.length < numItems; i++) {
        let randomItem = array[Math.floor(Math.random() * array.length)];
        // Check to see if that element already exists 
        if (!random.includes(randomItem)) {
            random.push(randomItem);
        }
    }
    return random;
}

// Functions related to welcome page generation

// Grabs the user's time according the browser in hours 
const getCurrentTime = function () {
  
    const currentDate = new Date();
    const hour = currentDate.getHours();
    return hour; 

}

// Grab the welcome message based on the time 
const getWelcomeMessage = function () {
    const hour = getCurrentTime();
    // Initalize message variables
    // Potential messages array to grab for header 
    let relaxMsg = ["It’s okay to take a break.", "Disconnect to reconnect.", "Relax. Nothing is under control.", "Rest your mind. Calm your heart.", "If you’re tired, learn to rest not quit.", "For the love of your work, take a break!", "Rest and be thankful.", "Sometimes a break is the very thing you need.", "Taking a break can lead to breakthroughs.", "Take a break and have fun.", "Life isn’t as serious as we think.", "Take a deep breath.", "Turn off your mind, relax, and float downstream.", "Nature does not hurry, yet everything is accomplished."];
    let headerText = "";
    let msgText = selectRandom(relaxMsg, 1);
    //Early-hours 
    if (hour >= 0 && hour < 6) {
        headerText = "Night Owl or Early Bird?";
        time = "late-night";
    }
    // Morning-hours
    if (hour >= 6 && hour < 12) {
        headerText = "Good Morning";
        time = "morning";
    }
    // Afternoon-hours
    if (hour >= 12 && hour < 18) {
        headerText = "Good Afternoon";
        time ="afternoon";
    }

    // Evenning-hours
    if (hour >= 18 && hour < 24) {
        headerText = "Good Evening";
        time = "evening";
    }
    // Call function to display welcome message 
    displayWelcomeMessage(headerText, msgText);
    // Call function to change color theme
}

// Function to populate the content-section with the welcome function 
const displayWelcomeMessage = function (headerText, msgText) {
    // Reset home page 
    blobContainerEl.classList.remove("hide");
    blobContainerEl.classList.add("show");

    nextBtnEl.classList.remove("show", "my-10");
    searchBtnEl.classList.remove("show", "my-10");
  
    contentEl.classList.remove("space-top-image");
    contentEl.textContent = "";

    // Create header and welcome sub-header and append to content section 
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
    getWelcomeMessage();
    colorChange(); 
    // Reset selected menu to default option
    contentOptionsEl.selectedIndex = 0;
}

// Move the main blobs around and respond to mouse movement
function createLiquidPath(path, options) {
    // Split the path into equidistant x y points
    const svgPoints = pointsInPath(path, options.detail);
    // Stores the original points
    let originPoints = svgPoints.map(({x,y}) => ({x,y}));
    // Stores the points that will be moving around
    const liquidPoints = svgPoints.map(({x,y}) => ({x,y}));

    // Store the mapped and translated coordinates
    const mousePos = {x:0, y:0};
    // Takes the svg argument and returns a function that will take the mouse position relative to the screen and map them to the svg viewbox
    const transformCoords = createCoordsTransformer(path.closest('svg'));

    // Returns the square root of the sum of squares of the arguments
    const pointDistance = Math.hypot(
        originPoints[0].x - originPoints[1].x,
        originPoints[0].y - originPoints[1].y    
    );
    // If the options include axis coordinates, set them to the point distance divided by 2. Otherwise, set them to 0. The point distance / 2 is the greatest distance a point can move
    const maxDist = {
        x: options.axis.includes('x') ? pointDistance/2 : 0,
        y: options.axis.includes('y') ? pointDistance/2 : 0
    }; 

    // Move points around
    const blobTimeline = new gsap.timeline();

    const updateBlob = liquidPoints.forEach((point, index) => {
        const pointOrigin = originPoints[index];
        const duration = gsap.utils.random(1, 2);

        const tween = gsap.to(point, {
            duration,
            x: pointOrigin.x - maxDist.x/2.2,
            y: pointOrigin.y - maxDist.y/2.2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        })
        blobTimeline.add(tween, -duration);
        originPoints.push(liquidPoints);
    });
    
    // If the path data changes, update the data value of the path element 60 times a second
    gsap.ticker.add(() => {
        gsap.set(path, {
            attr: {
                // Use spline to draw a smooth curve between the points in the liquidPoints array
                d: spline(liquidPoints, options.tension, options.close)
            }
        });
    });

    // Listen for mousemove events, map the mouse position to the svg viewbox and update the mousePos point with transformed x and y values
    window.addEventListener('mousemove', (event) => {
        const {x,y} = transformCoords(event);

        mousePos.x = x;
        mousePos.y = y;

        // Check how far the mouse points is from the point's origin. If the x and y between the point's origin and mouse position are less than the x and y values assigned to options.range, then calculate the difference between the point's origin and the current mouse position. Store this as a new variable. Create a target variable which stores the point's origin minus the difference between the point's origin and mouse position. Clamp the target's x and y to the maxDist properties to keep the points from moving too far
        liquidPoints.forEach((point, index) => {
            const pointOrigin = originPoints[index];
            const distX = Math.abs(pointOrigin.x - mousePos.x);
            const distY = Math.abs(pointOrigin.y - mousePos.y);

            if (distX <= options.range.x && distY <= options.range.y) {
                const difference = {
                    x: pointOrigin.x - mousePos.x,
                    y: pointOrigin.y - mousePos.y
                };

                const target = {
                    x: pointOrigin.x + difference.x,
                    y: pointOrigin.y + difference.y
                };

                const x = gsap.utils.clamp(
                    pointOrigin.x - maxDist.x,
                    pointOrigin.x + maxDist.x,
                    target.x
                );

                const y = gsap.utils.clamp(
                    pointOrigin.y - maxDist.y,
                    pointOrigin.y + maxDist.y,
                    target.y
                );

                // Animate x and y points using gsap
                gsap.to(point, {
                    x: x,
                    y: y,
                    ease: 'sine.inOut', // use sine easing 
                    duration: 0.175,
                    onComplete() {
                        gsap.to(point, {
                            x: pointOrigin.x,
                            y: pointOrigin.y,
                            ease: 'elastic.out(1, 0.8', // once update is complete, spring the point back to its origin
                            duration: 1.25
                        });
                    }
                });

            }
        });

    });
}

// Move the blob mask around
function createLiquidBlobMask(path, options) {
    // Split the path into equidistant x y points
    const svgPoints = pointsInPath(path, options.detail);
    // Stores the original points
    let originPoints = svgPoints.map(({x,y}) => ({x,y}));
    // Stores the points that will be moving around
    const liquidPoints = svgPoints.map(({x,y}) => ({x,y}));

    // Returns the square root of the sum of squares of the arguments
    const pointDistance = Math.hypot(
        originPoints[0].x - originPoints[1].x,
        originPoints[0].y - originPoints[1].y    
    );
    // If the options include axis coordinates, set them to the point distance divided by 2. Otherwise, set them to 0. The point distance / 2 is the greatest distance a point can move
    const maxDist = {
        x: options.axis.includes('x') ? pointDistance/2.2 : 0,
        y: options.axis.includes('y') ? pointDistance/2.2 : 0
    }; 

    // Move points around
    const blobTimeline = new gsap.timeline();

    const updateBlob = liquidPoints.forEach((point, index) => {
        const pointOrigin = originPoints[index];
        const duration = gsap.utils.random(1, 2);

        const tween = gsap.to(point, {
            duration,
            x: pointOrigin.x - maxDist.x/4,
            y: pointOrigin.y - maxDist.y/4,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        })
        blobTimeline.add(tween, -duration);
        originPoints.push(liquidPoints);
    });

    // If the path data changes, update the data value of the path element 60 times a second
    gsap.ticker.add(() => {
        gsap.set(path, {
            attr: {
                // Use spline to draw a smooth curve between the points in the liquidPoints array
                d: spline(liquidPoints, options.tension, options.close)
            }
        });
    });
}

// Check the user's motion preferences and call the function if they are ok with motion. Otherwise, do nothing
const prefersReducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

if (prefersReducedMotionQuery && !prefersReducedMotionQuery.matches) {
    createLiquidPath(blob1, {
      detail: 20,
      tension: 1,
      close: true,
      range: {
        x: 30,
        y: 30
      },
      axis: ["y"]
    });

    createLiquidPath(blob2, {
        detail: 20,
        tension: 1,
        close: true,
        range: {
          x: 30,
          y: 30
        },
        axis: ["y"]
    });
}

// Functions regarding modals 

// Error Modal functions
const displayErrorModal = function (event) {
    // Add modal to screen 
    errorModalEl.classList.add("show");
    errorModalContentEl.classList.add("modal-slide-in");
    errorModalContentEl.classList.remove("modal-slide-out");
}

// Search Modal functions 
const searchBtnHandler = function (event) {
    // Reset the warning message incase no search was entered 
    warningEl.classList.add("hide");
    warningEl.classList.remove("show");

    // Add modal to screen 
    searchModalEl.classList.add("show");
    searchModalContentEl.classList.add("modal-slide-in");
    searchModalContentEl.classList.remove("modal-slide-out");

    const searchCategoryEl = document.querySelector("#search-category");

    // Add current category to search header in modal - capitilize the first letter 
    searchCategoryEl.textContent = currentContent.charAt(0).toUpperCase() + currentContent.slice(1);

}

// Function to handle a click on the Choose For Me button on the Search Modal 
const modalChooseBtnHandler = function (event) {

    // Hide modal 
    searchModalEl.classList.remove("show");
    searchModalContentEl.classList.remove("modal-slide-in");
    searchModalContentEl.classList.add("modal-slide-out");

    // Check which display is on the screen and grab content for that section 
    if (currentContent === "gif") {
        getRandomGif();
    }

    if (currentContent === "painting") {
        getArt("Painting");
    }

    if (currentContent === "quote") {
        // Insert function to call random quote
    }

    if (currentContent === "joke") {
        getjoke();
    }
}

// Function to handle a submit on the search form 
const modalSearchHandler = function (event) {

    // Grab the search input text as a tag 
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

    // Check for content of search and call appropraite function, then reset search form
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

// Mask path is here so we can access it later
let blobMaskPath;

// Creating the mask shape
const createBlobSvg = function() {
    // Variable for the namespace 
    const svgns = "http://www.w3.org/2000/svg";

    // Make the svg
    let blobSvg = document.createElementNS(svgns, "svg");
    blobSvg.setAttribute("viewBox", "0 0 800 750");
    blobSvg.setAttribute("width", "0");
    blobSvg.setAttribute("height", "0");

    const blobDefs = document.createElementNS(svgns, "defs");
    const blobMask = document.createElementNS(svgns, "clipPath");
    blobMaskPath = document.createElementNS(svgns, "path");

    blobMask.id = "blobMask";
    blobMask.classList.add("media-blob");
    blobMaskPath.setAttribute("d", "M140.992124,78.5578217 C82.1126165,116.05677 40.1082803,190.605246 29.272668,226.519652 C12.1678644,283.213159 13.1189807,384.333429 81.1767645,453.920056 C149.027465,523.294948 282.113034,534.478642 352.622397,534.478642 C423.13176,534.478642 598.569047,521.616629 668.024598,441.058043 C737.480148,360.499457 736.706244,256.098503 722.021497,194.217781 C707.336749,132.337059 670.694658,66.5526 583.348235,37.0529097 C496.001812,7.55321933 268.056449,-2.36640581 140.992124,78.5578217 Z");

    blobSvg.appendChild(blobDefs);
    blobDefs.appendChild(blobMask);
    blobMask.appendChild(blobMaskPath);

    return blobSvg;
}

// Functions related to gif generation 

// Function to grab a random gif
const getRandomGif = function (event) {
    // Set potential tags that could be searched
    const potentialTags = ["kitten", "cat", "dog", "puppy", "cute", "wholesome", "peaceful", "relaxing", "rain", "happy", "cute animal", "baby animal"];
    // Select a random tag from potential tags
    const randomSearchTag = selectRandom(potentialTags, 1);
    prevGifTag = randomSearchTag;
    // Call function to make the giphy API call 
    getGifs(randomSearchTag);
}

// Function to call giphy API to find gif of the searched random or specific tag 
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
                // Call function to display gif on content section 
                displayGifs(selectedGifs);

            })
        }
        else {
            // Problem fetching, call the error modal 
            displayErrorModal(); 
        }
    });
}

// Function to generate the gif display on the content section 
const displayGifs = function (gif) {
    currentContent = "gif";
    // Display error modal if gif is empty
    if (typeof gif[0] === "undefined") {
        displayErrorModal(); 
        return; 
    }
    // Delete old content in content section
    blobContainerEl.classList.remove("show");
    blobContainerEl.classList.add("hide");
    contentEl.textContent = "";
    contentEl.classList.add("space-top-image");

    // Generate elements to store the grabbed gif and add them to the contente section 
    const gifWrapper = document.createElement("div");  
    gifWrapper.classList = "flex justify-center media-wrapper";
    const gifImg = document.createElement("img");
    gifImg.classList.add("image-mask");
    gifImg.setAttribute("src", gif[0].images.original.url);

    gifWrapper.appendChild(gifImg);
    contentEl.appendChild(gifWrapper);

    // Append the blob
    contentEl.appendChild(createBlobSvg());

    // Check if user prefers reduced motion. If not, animate the blob
    if (prefersReducedMotionQuery && !prefersReducedMotionQuery.matches) {
        // const scaleAmount = window.innerWidth < 769 ? 0.5 : 1;

        createLiquidBlobMask(blobMaskPath, {
            detail: 20,
            tension: 1,
            close: true,
            range: {
            x: 30,
            y: 30
            },
            axis: ["y"]
        });

        gifWrapper.addEventListener('mouseover', (event) => {
            gsap.to("#blobMask", {duration: 1, scale: 2, ease: 'power3.inOut', transformOrigin: "50% 50%"});
            });
    
        gifWrapper.addEventListener('mouseout', (event) => {
        gsap.to("#blobMask", {duration: 1, scale: 1, ease: 'power3.inOut', transformOrigin: "50% 50%"});
        });
    }

    //Show buttons for navigating content 
    nextBtnEl.classList.add("show", "my-10");
    searchBtnEl.classList.remove("hide");
    searchBtnEl.classList.add("show", "my-10");
    
    // Get color 
    colorChange(); 
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
    colorChange(); 
    // Get all objects that have an image and matches the query 'Painting'
    // Use try/catch to catch any errors
    try {
        const allMuseumResponse = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&medium=Paintings&q=${searchTag}`
        );
        const museumData = await allMuseumResponse.json();

        // Get IDs of the objects
        const museumArray = museumData.objectIDs;

        // Check if no IDs returned
        if (!allMuseumResponse.ok) {
            displayErrorModal();
            return; 
        }

        // Get random ID from that array
        const museumId = museumArray[Math.floor((Math.random() * museumArray.length))];
        
        // Get object matching that ID
        const artResponse = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${museumId}`
        );
        const artData = await artResponse.json();

        // Check if no IDs returned
        if (!artResponse.ok) {
            displayErrorModal();
            return; 
        }

        // Remove loader to show image
        contentEl.removeChild(loader);

        // Append the blob
        contentEl.appendChild(createBlobSvg());

        const artSource = artData.primaryImageSmall;
        const artWrapper = document.createElement("div");
        const artImg = document.createElement("img");

        artImg.src = artSource;
        artWrapper.classList = 'media-wrapper';
        contentEl.appendChild(artWrapper);
        artWrapper.appendChild(artImg);
        contentEl.classList.add("space-top-image");
        artImg.classList.add("image-mask");

        let mqTransformOrigin;

        // Media query checking if the viewport is at least 750px
        const mediaQuery = window.matchMedia('(min-width: 750px)');

        function handleMediaChange(event) {
            if (event.matches) {
                blobMaskPath.setAttribute("transform", "scale(1)");
                blobMaskPath.setAttribute("width", "700px");
                blobMaskPath.setAttribute("height", "740px");
                mqTransformOrigin = '50% 50%';
                console.log("check1");
            } else {
                blobMaskPath.setAttribute("transform", "scale(0.5)");
                blobMaskPath.setAttribute("width", "390px");
                blobMaskPath.setAttribute("height", "332px");
                mqTransformOrigin = '25% 25%';
                console.log("check2");
            }
        }

        mediaQuery.addListener(handleMediaChange);
        handleMediaChange(mediaQuery);

        // Check if user prefers reduced motion. If not, animate the blob
        if (prefersReducedMotionQuery && !prefersReducedMotionQuery.matches) {
            createLiquidBlobMask(blobMaskPath, {
                detail: 20,
                tension: 1,
                close: true,
                range: {
                x: 30,
                y: 30
                },
                axis: ["y"]
            });

            artWrapper.addEventListener('mouseover', (event) => {
                gsap.to("#blobMask", {duration: 1, scale: 2.5, ease: 'power3.inOut', transformOrigin: mqTransformOrigin});
             });
        
             artWrapper.addEventListener('mouseout', (event) => {
                gsap.to("#blobMask", {duration: 1, scale: 1, ease: 'power3.inOut', transformOrigin: mqTransformOrigin});
             });
        }

        // Show the next button and hide the blobs
        nextBtnEl.classList.add("show", "my-10");
        nextBtnEl.textContent = `More artwork`;

        searchBtnEl.classList.remove("hide");
        searchBtnEl.classList.add("show", "my-10");

        } catch (error) {
            //console.log(`There was a problem grabbing the artwork! Error: ${error}`);
            displayErrorModal();
            return; 
        }
}

// Function to handle displaying more of currently selected content 
const nextBtnHandler = function (event) {
    
    // Check the current content and then call the appropraite function 
    if (currentContent === "gif") {
        getGifs(prevGifTag);
    }

    if (currentContent === "joke") {
        getjoke();
    }

    if (currentContent === "painting") {
        getArt("painting");
    }


    if (currentContent === "quote") {
        startQuotes();
    }
}

// Function to handle a click on the close search modal button 
const closeModalBtnHandler = function (event) {
    searchModalContentEl.classList.remove("modal-slide-in");
    searchModalContentEl.classList.add("modal-slide-out");
    searchModalEl.classList.remove("show");

}

// Function to grab a quote from the quotable API 
const startQuotes = function (event) {
    colorChange(); 
    fetch("https://api.quotable.io/random").then(function (response) {

        if (response.ok) {
            // Add blobs to the screen and fix buttons 
            blobContainerEl.classList.remove("hide");
            blobContainerEl.classList.add("show");
            searchBtnEl.classList.remove("show", "my-10");
            searchBtnEl.classList.add("hide");


            // Remove ripple from searchBtn because the ripple will replay when the hide class is removed
            if (searchBtnEl.querySelector(".ripple")) {
                searchBtnEl.querySelector(".ripple").remove();
            }

            // Pass grabbed generation into another function to generate the display 
            contentEl.textContent = "";
            currentContent = "quote";
            response.json().then(function (data) {

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
            // If problem grabbing quote, display error modal 
            displayErrorModal(); 
        }
    });
};

// Function to generate a ripple to be applied to various interactable elements
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
        circle.classList.add("light-ripple");
        const rippleLight = document.getElementsByClassName("light-ripple")[0];
        // Remove leftover ripples if there are any
        if (rippleLight) {
            rippleLight.remove();
        }
    }

    circle.classList.add("ripple");
    //const ripple = button.querySelector(".ripple");
    const ripple = button.getElementsByClassName("ripple")[0]; 
    //console.log(ripple);
    // Remove leftover ripples if there are any
    if (ripple) {
        //console.log("this is being checked")
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
    colorChange(); 
}

//call for search
async function searchJoke(searchTag) {
    colorChange(); 
    //call Api
    const jokefetch = await fetch('https://icanhazdadjoke.com/search?term=' + searchTag, {
        headers: {
            'Accept': 'application/json'
        }
    });

    const jokeContent = await jokefetch.json();
    

    var jokerandom= selectRandom(jokeContent.results,1);

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


    // Check to see if any jokes were returned 
    if (typeof jokerandom[0] === "undefined") {
        displayErrorModal();
        return; 
    }
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

    // Grab potential content options 
    const options = ["gif", "painting", "quote", "joke"];

    // Grab random option -> returns 1 element array, so grab the item at index 0
    const selected = selectRandom(options, 1)[0];
    // Call function to display selected content and change the dropdown to the option that represents the content 
    switch (selected) {
        case "gif":
            getRandomGif();
            contentOptionsEl.selectedIndex = 1;
            break;
        case "painting":
            contentOptionsEl.selectedIndex = 2;
            getArt("painting");
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

// Function to handle click on the suprise button 
const surpriseBtnHandler = function(event) {
    getSurprise(); 
}

// Function to handle click on the OK button on the error modal 
const okBtnHandler = function (event) {
    // Remove error modal
    errorModalEl.classList.remove("show");
    errorModalContentEl.classList.remove("modal-slide-in");
    errorModalContentEl.classList.add("modal-slide-out");
    // Return user to homepage
    logoBtnHandler();
}

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

// Function to delete the current playingSound array to prevent accumulation of unneccesary sounds
const clearSounds = function () {
    playingSounds = [];
}

// Function to save the current sounds that are playing and their volume 
const saveSoundSettings = function () {
    // Grab all playing audio
    const playingAudios = soundModalContentEl.querySelectorAll(".play");
    // Grab the names of the playing sounds to use to ensure that the playing audios are filled in on modal-load
    for (let i=0; i < playingAudios.length; i++) {
        //playingSounds[i] = playingAudios[i].name; 
        const soundName = playingAudios[i].name; 
        // Grab volume from volume slider
        const playingSoundVolEl = soundModalContentEl.querySelector(`#${soundName}-vol`);
        const soundVolume = playingSoundVolEl.value; 
        // Store the soundObj in the playingSounds array 
        const soundObj = {name: soundName, volume: soundVolume}; 
        playingSounds.push(soundObj); 
    }
    
}

// Function to load the sounds and their volume that should currently be playing on the webpage
const loadSoundSettings = function() {
    // Iterate through the array of objects 
    playingSounds.forEach(playingSound => {

        // Add .play class to enable button fill-in
        const playingSoundBtnEl = soundModalContentEl.querySelector(`#${playingSound.name}-btn`);
        playingSoundBtnEl.classList.add("play"); 
        const playingSoundAudioEl = soundModalContentEl.querySelector(`#${playingSound.name}-audio`);
        // Add volume and play to audio 
        const playingSoundVolumeEl = soundModalContentEl.querySelector(`#${playingSound.name}-vol`);
        playingSoundVolumeEl.value = playingSound.volume; 
        playingSoundAudioEl.volume = Number(playingSound.volume) / 100; 
        playingSoundAudioEl.play();
        playingSoundAudioEl.loop = true; 
    });
}

// Function to change the volume when the volume slider is either dragged or clicked on 
const setVolume = function (event) {
    // Get the new volume 
    const newVolume = event.target.value / 100; 
    //Find which audio was selected
    const selectedSoundId = event.target.getAttribute("id").replace('-vol',"");
    const selectedAudioEl = this.querySelector(`#${selectedSoundId}-audio`);
    // Change volume of the selected audio
    selectedAudioEl.volume = newVolume; 

}

// Function to handle enabling the audio of the sound and changing the display on button click 
const soundBtnHandler = function (event) {
    // Grab the sound button of the icon that was clicked
    const selectedSoundBtnEl = event.target.closest("button");
    const selectedSoundIconEl = selectedSoundBtnEl.querySelector("i");
    // Turn on the sound button only IF the icon was clicked, not the button space 
    if (event.target != selectedSoundIconEl) {
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

// Function to dynamically generate the the sound mixer display 
const displaySounds = function() {
    // reset modal content

    // Reset the sound mixer content 
    soundOptionsWrapperEl.textContent = "";

    // Iterate through the sound options objects array and generate buttons, audio, and volume mixers
    soundOptions.forEach(soundOption => {
        const soundButtonWrapperEl = document.createElement("div");
        soundButtonWrapperEl.classList = "flex flex-col content-center";
        
        const soundButtonEl = document.createElement("button");
        soundButtonEl.setAttribute("type","button");
        soundButtonEl.setAttribute("name", soundOption.name);
        soundButtonEl.setAttribute("id",`${soundOption.name}-btn`);
        soundButtonEl.classList = "sound-option-btn mb-8";

        const soundAudioEl = document.createElement("audio");
        soundAudioEl.setAttribute("id",`${soundOption.name}-audio`);
        soundAudioEl.setAttribute("src",`assets/videos/${soundOption.name}.mp3`);

        const soundIconEl = document.createElement("i");
        soundIconEl.classList = `${soundOption.icon} sound-option-icon`; 

        soundButtonEl.appendChild(soundAudioEl);
        soundButtonEl.appendChild(soundIconEl);

        const soundVolumeEl = document.createElement("input");
        soundVolumeEl.setAttribute("type", "range");
        soundVolumeEl.setAttribute("id",`${soundOption.name}-vol`);
        soundVolumeEl.setAttribute("aria-label",`${soundOption.name}-volume`);
        soundVolumeEl.setAttribute("name",`${soundOption.name}-volume` );
        soundVolumeEl.setAttribute("min","0");
        soundVolumeEl.setAttribute("max", "100");
        soundVolumeEl.classList = "bg-transparent mb-8";

        soundButtonWrapperEl.appendChild(soundButtonEl);
        soundButtonWrapperEl.appendChild(soundVolumeEl);

        soundOptionsWrapperEl.appendChild(soundButtonWrapperEl);

    })

    // Call function to load the current sounds that should be playing or that were playing when the mixer was last opened
    loadSoundSettings();
    // Remove the current playing sounds, as they will be re-saved when the mixer is closed to prevent overaccumulation 
    clearSounds();
}

// Function to handle changing the option in the drop-down menu of presets 
const presetSelectHandler = function () {
    // Reset which buttons are actually toggled and volume sliders
    resetSoundBtnHandler(); 
    // Grab the appropraite value and then grab the preset from localStorage
    selectedPreset = presetSelectEl.value; 
    // Grabs the preset that is selected in the preset object array 
    const desiredPreset = presets.find(preset => preset.name === selectedPreset)
    // Adds the found sounds name to the current playing sounds
    playingSounds = desiredPreset.sounds; 
    // Call function to load the current playing sounds array 
    loadSoundSettings();
    // Stop sounds from double accumulating 
    clearSounds();  
    // Resets preset dropdown 
    presetSelectEl.selectedIndex = 0;

}

// Function to populate the preset list on the sound display 
const generatePresetList = function() {
    // Adds the default option
    presetSelectEl.innerHTML = "<option value='' selected disabled hidden>preset</option>"
    // Parses through the presets object array and adds them as options to the list 
    presets.forEach(preset => {
        const optionEl = document.createElement("option");
        optionEl.setAttribute("value",preset.name); 
        optionEl.textContent = preset.name; 

        presetSelectEl.appendChild(optionEl); 
    })
}

// Function to save preset when button is clicked 
const savePresetBtnHandler = function(event) {
    // Add button animation 
    event.target.classList.add("animate-preset-btn"); 
    setTimeout(function() {savePresetBtnEl.classList.remove("animate-preset-btn")},400);
    // Check if the user has input a name for the preset
    if(presetNameInputEl.value === "") {
        presetWarningEl.textContent = "Please enter a name for the preset before submitting!"; 
        return;
    }
    // If the user enters a valid name, save the preset to localStorage
    presetWarningEl.textContent = ""; 

    saveSoundSettings();
    let presetName = presetNameInputEl.value.toLowerCase().trim(); 
    let presetSounds = playingSounds; 
    let presetObj = {name: presetName, sounds: presetSounds}; 
    
    // If same name preset exists, replace it
    if (presets.some(obj => obj.name === presetName)) {
        // Grab index of obj that already exists
        const objIndex = presets.findIndex(obj => obj.name === presetName); 
        // Replace with new obj
        presets[objIndex] = presetObj;
    }
    // Add preset to preset list
     else {
        presets.push(presetObj); 
     } 
    
   
    localStorage.setItem("presets", JSON.stringify(presets)); 
    
    loadPresets(); 
    generatePresetList(); 
    // Reset text input content
    presetNameInputEl.value = ""; 
    // Reset playingSounds to prevent wrong sounds from being saved
    playingSounds = []; 

}

// Function handler to reset the current sounds that are selected and the volumes on button click
const resetSoundBtnHandler = function() {
    // Empty currently playing sounds array
    playingSounds = [];
    // Generate display again 
    displaySounds();  
}

// Removes the presets from the list and clears localStorage
const clearPresetBtnHandler = function() {
    localStorage.removeItem("presets");
    // Grab preset from localStorage
    loadPresets(); 
     // Updates preset list
    generatePresetList(); 
}

// Function to close the sound modal on button click 
const closeSoundBtnHandler = function() {
      // Call function to save the sounds that are currently displayed 
      saveSoundSettings(); 
      // Remove Sound Modal
      soundModalEl.classList.remove("show");
      soundModalContentEl.classList.remove("modal-slide-in");
      soundModalContentEl.classList.add("modal-slide-out");
}

// Function to grab preset item in localStorage 
const loadPresets = function() {
    presets = JSON.parse(localStorage.getItem("presets"),presets); 
    // if null re-initialize as empty array
    if(!presets) {
        presets = []; 
    }
}


// Functions related to color variation
const colorChange = function() {
   
    const hour = getCurrentTime();

     //Early-hours 
     if (hour >= 0 && hour < 6) {
        time = "late-night";
    }
    // Morning-hours
    if (hour >= 6 && hour < 12) {
        time = "morning";
    }
    // Afternoon-hours
    if (hour >= 12 && hour < 18) {
        time ="afternoon";
    }

    // Evenning-hours
    if (hour >= 18 && hour < 24) {
        time = "evening";
    }

    const colorSets = [{time: "morning", colors: {background: "#FBF7F2", primary: "70, 65, 62", accent: "#F5D8B4"}},{time: "afternoon" , colors: {background: "#445F87", primary: "255, 170, 118", accent: "#FFE0BE"}}, {time: "evening", colors: {background:"#403A37", primary: "228, 122, 88", accent: "#DA6A74"}}, {time:"late-night",colors: {background: "#5E4980", primary: "236, 214, 179", accent: "#9268A1"}}];

    const desiredColorSet = colorSets.find(colorSet => colorSet.time === time);
    
    const cssRootStyles= getComputedStyle(cssRoot);
    const cssBGColor = cssRootStyles.getPropertyValue("--background");
    console.log(cssBGColor);
    cssRoot.style.setProperty(`--background`,desiredColorSet.colors.background);
    cssRoot.style.setProperty(`--primary`,desiredColorSet.colors.primary);
    cssRoot.style.setProperty(`--accent`,desiredColorSet.colors.accent);
}

// Event Listeners Below 

logoBtnEl.addEventListener("click", logoBtnHandler);

// Timeouts added so you can see the ripple effect before the function is called

okBtnEl.addEventListener("click", createRipple);
okBtnEl.addEventListener("click", function() { 
    setTimeout(okBtnHandler,300);
});


searchBtnEl.addEventListener("click", createRipple);
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

// Close modal on background click
document.addEventListener("click", function (event) {
    const displayedModal = event.target.querySelector(".modal-content"); 
    // Do nothing if the target doesn't match
    if (!event.target.matches('.modal-backdrop')) {
        return;
    }
    // If off-screen is clicked, and it is the error-modal 
    else if (event.target.getAttribute("id") === "error-modal") {
        okBtnHandler(); 
    }
    else if (event.target.getAttribute("id") === "sound-modal") {
        saveSoundSettings(); 
        event.target.classList.remove("show");
        displayedModal.classList.remove("modal-slide-in");
        displayedModal.classList.add("modal-slide-out");
        presetWarningEl.textContent = ""; 
    }
    // If off-screen is clicked for the search modal 
    else {
        event.target.classList.remove("show");
        displayedModal.classList.remove("modal-slide-in");
        displayedModal.classList.add("modal-slide-out");
    }
})

// Sound btn in navbar event listener to open up mixer 

soundBtnEl.addEventListener("click", function() {
    // Make sound modal pop-up 
    soundModalEl.classList.add("show");
    soundModalContentEl.classList.add("modal-slide-in"); 
    soundModalContentEl.classList.remove("modal-slide-out"); 
    // Display sound options 
    displaySounds();
    // Add presets to list 
    loadPresets(); 
    if (presets != "") {
        generatePresetList(); 
    }
});

// Sound Mixer Related Event Listeners 

soundOptionsWrapperEl.addEventListener("click", soundBtnHandler);

soundOptionsWrapperEl.addEventListener("input", setVolume);
soundOptionsWrapperEl.addEventListener("change", setVolume);

presetSelectEl.addEventListener("change",presetSelectHandler); 

savePresetBtnEl.addEventListener("click", savePresetBtnHandler);

clearPresetBtnEl.addEventListener("click", createRipple); 
clearPresetBtnEl.addEventListener("click", function() {
    setTimeout(clearPresetBtnHandler, 300)
}); 

resetSoundBtnEl.addEventListener("click", createRipple);
resetSoundBtnEl.addEventListener("click", function() {
    setTimeout(resetSoundBtnHandler, 300); 
});

closeSoundBtnEl.addEventListener("click", createRipple);
closeSoundBtnEl.addEventListener("click", function() {
    setTimeout(closeSoundBtnHandler, 300);
});

// On load, generate welcome message

window.onload = function () { 
    logoBtnHandler();
}
