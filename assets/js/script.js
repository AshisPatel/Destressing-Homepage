const jokeContentEL= document.getElementById("joke-content");
const jokeSubmitbtnEl=document.getElementById("joke-submitbtn");
const jokeRandombtnEl=document.getElementById("joke-randombtn");
const jokeSearchEl= document.getElementById("joke-search").value;




jokeRandombtnEl.addEventListener('click',generatejoke);

var generatejoke = async function(){
    //call Api
    const jokefetch= await fetch('https://icanhazdadjoke.com/',{
        headers:{
            'Accept': 'application/json'
        }
    });

    const jokeContent =await jokefetch.json();

    console.log(jokeContent.joke);
    //Passing joke on screen
    jokeContentEL.innerHTML=jokeContent.joke;  
}
generatejoke();

//search bar 
const jokeSearchBar= function(val){
    val.preventDefault()
    const searchvalue= val.target.value;
    generatesearchjoke(searchvalue)
        

}
const generatesearchjoke=async function (searchvalue){
    const jokefetch= await fetch('https://icanhazdadjoke.com/search?term='+searchvalue,{
        headers:{
            'Accept': 'application/json'
        }
    });

    const jokeContent =await jokefetch.json();

    console.log(jokeContent.joke);
    //Passing joke on screen
    jokeContentEL.innerHTML=jokeContent.joke;  

}






