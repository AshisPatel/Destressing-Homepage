const jokeContentEL= document.getElementById("joke-content");
const jokeSubmitbtnEl=document.getElementById("joke-submitbtn");
const jokeRandombtnEl=document.getElementById("joke-randombtn");



jokeRandombtnEl.addEventListener('click',generatejoke);
generatejoke();
async function generatejoke(){
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






