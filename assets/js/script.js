const quoteEl = document.querySelector("#quote-btn");
const contentEl = document.querySelector("#content"); 
const gifBtnEl = document.querySelector("#gif-btn");
const nextBtnEl = document.querySelector("#next-btn"); 
const gifModalEl = document.querySelector("#gifModal"); 
const closeModalBtnEl = document.querySelector("#close-modal-btn"); 
const gifChooseBtnEl = document.querySelector("#gif-choose-btn");
const gifSearchBtnEl = document.querySelector("#gif-search-btn"); 
const gifSearchFormEl = document.querySelector("#gif-search-form");  
let nextBtnType = "";
let prevGifTag = ""; 

 

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
    nextBtnType = "gif"; 
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
    nextBtnEl.textContent = `More ${searchTag} gifs`;
    const apiUrl = `https://api.giphy.com/v1/gifs/search?q=${searchTag}&api_key=8uu014p8mspMOtSIJu7z8PtcUxdwsM9x`;

    fetch(apiUrl).then(function (response) {
        if(response.ok) {
            response.json().then(function(data){
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


const gifChooseBtnHandler = function(event) {
    // Set potential tags that could be searched
    const potentialTags = ["kitten", "cat", "dog", "puppy", "cute", "wholesome"];
    // Select a random tag from potential tags
    const randomSearchTag = selectRandom(potentialTags,1);
    prevGifTag = randomSearchTag;  
    getGifs(randomSearchTag); 
    gifModalEl.style.display= "none"; 
}

const gifModalHandler = function(event) {
    gifModalEl.style.display = "block"; 
}

const gifSearchHandler = function(event) {
    event.preventDefault(); 
    const gifSearchInputEl = document.querySelector("#gif-search-input"); 
    // Insert something to verify if the search is blank 
    const searchTag = gifSearchInputEl.value.trim(); 
    prevGifTag = searchTag; 
    getGifs(searchTag); 
    gifModalEl.style.display = "none"; 
    gifSearchFormEl.reset(); 
}

const nextBtnHandler = function(event) {

    if (nextBtnType === "gif") {
        getGifs(prevGifTag); 
    }

    if (nextBtnType === "joke") {
        // Insert function to fetch joke
    }

    if (nextBtnType === "museum") {
        // Insert function to get museum fact
    }

    if (nextBtnType === "quote") {
        startQuotes();
    }
}

const closeModalBtnHandler = function(event) {
    gifModalEl.style.display= "none"; 
}

const startQuotes = function(event){
    
    fetch("https://api.quotable.io/random").then(function(response){
        
        if(response.ok){
            contentEl.textContent = ""; 
            nextBtnType = "quote";
            response.json().then(function(data){
            //  console.log(data);
            // alert("quotes Working!")
            // console.log(data.content)
            
             const quoteArea = document.createElement("div");
             quoteArea.classList = "card";

             const quoteTitle = document.createElement("div");
             quoteTitle.classList="card-header";
             quoteTitle.textContent="Destressing Quotes";
             quoteArea.appendChild(quoteTitle);

             const cardBody =document.createElement("div");
             cardBody.classList ="card-body";
             
             const blockQuote = document.createElement("blockquote");
             blockQuote.classList="blockquote mb-0";

             const randomQuote= document.createElement("p")
             randomQuote.textContent = data.content;
             blockQuote.appendChild(randomQuote);
            
             const footerQuote = document.createElement("footer");
             footerQuote.classList ="blockquote-footer";
             footerQuote.textContent = data.author;
             blockQuote.appendChild(footerQuote);

             cardBody.appendChild(blockQuote);
             quoteArea.appendChild(cardBody);
             contentEl.appendChild(quoteArea);
            })
        }else{
        alert("link not working")
        }
    });
};



gifBtnEl.addEventListener("click",gifModalHandler); 
gifChooseBtnEl.addEventListener("click", gifChooseBtnHandler);
gifSearchFormEl.addEventListener("submit", gifSearchHandler);
nextBtnEl.addEventListener("click", nextBtnHandler);   
closeModalBtnEl.addEventListener("click",closeModalBtnHandler); 
quoteEl.addEventListener("click", startQuotes);