const contentEl = document.querySelector("#content"); 
const gifBtnEl = document.querySelector("#gif-btn"); 

const selectRandom = function(array,numItems) {
    
}

const displayGifs = function(gifArray) {
    console.log(gifArray); 
}

const getGifs = function() {
    // Set potential tags that could be searched
    const potentialTags = ["kittens", "cats", "dogs", "puppies", "cute", "bees"];
    // Select random tag from potential tags
    const randomTag = potentialTags[Math.floor(Math.random()*potentialTags.length)]
    console.log(randomTag); 
    const apiUrl = `https://api.giphy.com/v1/gifs/search?q=${randomTag}&api_key=8uu014p8mspMOtSIJu7z8PtcUxdwsM9x`;

    fetch(apiUrl).then(function (response) {
        if(response.ok) {
            response.json().then(function(data){
                // Grab first 10 gifs from search, make this random? 
                const numGifs = 10; 
                // Returned object is contains a "data" key that is an array of 50 gifs
                // Grab numGifs from that array, maybe randomize
                const selectedGifs = data.data.slice(0,numGifs);
                displayGifs(selectedGifs);
            })
        }
        else {
            console.log("There was a problem finding a gif!"); 
        }
    });
}

const gifBtnHandler = function(event) {
    getGifs();
}

gifBtnEl.addEventListener("click", gifBtnHandler); 