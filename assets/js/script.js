const contentEl = document.querySelector("#content"); 
const gifBtnEl = document.querySelector("#gif-btn");
const nextBtnEl = document.querySelector("#next-btn"); 
const gifModalEl = document.querySelector("#gifModal"); 
const gifChooseBtnEl = document.querySelector("#gif-choose-btn");
const gifSearchBtnEl = document.querySelector("#gif-search-btn"); 
const gifSearchFormEl = document.querySelector("#gif-search-form");  
 

const selectRandom = function(array,numItems) {
    let random = [];
    for(let i=0; random.length < numItems; i++) {
        let randomItem = array[Math.floor(Math.random()*array.length)]; 
        if(!random.includes(randomItem)) {
            random.push(randomItem);
        }
    }
    return random; 
}

const displayGifs = function(gifArray) {
    // Delete old content in content section
    contentEl.textContent = ""; 
    // Create div to contain grid of 4 columns , thus '3 rows' for 12 items
    const gridEl = document.createElement("div"); 
    gridEl.classList = "grid grid-cols-4 justify-items-center gap-5 bg-green-50";
    // Populate grid of taken in array
    for(let i=0; i < gifArray.length; i++) {
        // Create div to hold each gif img element
        const imgWrapperEl = document.createElement("div"); 
        imgWrapperEl.classList = "col-span-1 p-8 bg-green-200 rounded"; 
        // Create image for each gif and add to img-wrapper
        const imgEl = document.createElement("img"); 
        imgEl.setAttribute("src",gifArray[i].images.original.url); 
        imgEl.setAttribute("alt","");
        imgEl.classList = "w-80 h-80 rounded"; 
        imgWrapperEl.appendChild(imgEl);
        // Add image-wrapper to grid
        gridEl.appendChild(imgWrapperEl); 
    }
    // Add grid to content section
    contentEl.appendChild(gridEl); 
}

const getGifs = function(searchTag) {
    const apiUrl = `https://api.giphy.com/v1/gifs/search?q=${searchTag}&api_key=8uu014p8mspMOtSIJu7z8PtcUxdwsM9x`;

    fetch(apiUrl).then(function (response) {
        if(response.ok) {
            response.json().then(function(data){
                // Grab 10 random gifs from the retrieved gif array 
                const numGifs = 12; 
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



const gifChooseBtnHandler = function(event) {
    // Set potential tags that could be searched
    const potentialTags = ["kittens", "cats", "dogs", "puppies", "cute", "bees"];
    // Select a random tag from potential tags
    const randomSearchTag = selectRandom(potentialTags,1); 
    getGifs(randomSearchTag); 
    gifModalEl.style.display= "none"; 
}

const gifModalHandler = function(event) {
    gifModalEl.style.display = "block"; 
}

const gifInputHandler = function(event) {
    event.preventDefault();
    // const searchTag = gifSearchInputEl.value.trim(); 
    // console.log(searchTag); 
    // getGifs(searchTag); 
    //gifModalEl.style.display= "none"; 
}

const gifSearchHandler = function(event) {
    event.preventDefault(); 
    const gifSearchInputEl = document.querySelector("#gif-search-input");  
    const searchTag = gifSearchInputEl.value.trim(); 
    getGifs(searchTag); 
    gifModalEl.style.display = "none"; 
    gifSearchFormEl.reset(); 
}


gifBtnEl.addEventListener("click",gifModalHandler); 
gifChooseBtnEl.addEventListener("click",gifChooseBtnHandler);
gifSearchFormEl.addEventListener("submit", gifSearchHandler);  
