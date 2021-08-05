var quoteEl = document.querySelector("#quote-btn");



var startQuotes = function(event){
    
    fetch("https://api.quotable.io/random").then(function(response){
        
        if(response.ok){
            response.json().then(function(data){
             console.log(data);
             


            })
        }else{
        alert("link not working")
        }
    });
};











quoteEl.addEventListener("click", startQuotes);