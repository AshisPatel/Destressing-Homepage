# Project-1-DS-Homepage

## Description

![Preview of destressing homepage functionality, including sound mixer, gifs, artwork, quotes, jokes, suprise button, and home screen](https://github.com/AshisPatel/Project-1-DS-Homepage/blob/main/assets/videos/DS-Preview.gif)

The Destressing Home Page is a responsive webpage that is intended to be visited by a user who needs to take a small break and unwind. Upon arrival to the webpage, the user is greeted with a dynamic time-based welcome message and color theme. The website allows you to view gifs, artwork, quotes, and jokes. The content for the gifs, artwork, and quotes is normally delivered at random but the user can choose to search for specific tags if they would like. Additionally, the user can create ambient sound mixes (and save presets to localStorage) to listen to while they have the page open. 

## Features & Functionality

### Welcome Page

The welcome page displays both a header and a sub-header message. The header message varies with the time of the day. The sub-header message is displayed based on random selection from a pre-set array of options. For the header, the hour ranges are the following: 0-6 = Late-night, 6-12 = Morning, 12-18 = Afternoon, and 18-24 = Evening. These times are grabbed from the user's browser using the 'Date' functionality. 

#### Navbar

The navbar has a home button to return to the welcome page on the left-side and on the right-side are the webpage content options. The user can click on the music icon to open up the sound mixer, select a content option from the select menu, or choose a random piece of content to see by clicking on the suprise button. 

### Sound Mixer

The sound mixer is opened as a modal whenever the user clicks on the music button. The user can toggle on as many sounds as they would like and adjust the volume for each individual sound that is playing. Combinations of sound presets can be saved by entering a name in the “Save Preset Text Input” and clicking on the “Save Preset Button”. This will store the preset to the user’s localStorage and add it to the “Select Preset List”. Presets can be edited by saving over a pre-existing preset with the same name. 

All presets can be cleared from the list and user’s localStorage by clicking the “Clear Presets” button on the modal. Additionally, clicking on the “Reset” button will remove all currently selected sounds and return all sound volumes to the default value of 50. The “Close” button will close the moda*l. All sounds that were playing when the modal is closed will continue to play in the background. When the user re-opens the modal, the sounds will continue to play but will restart from the beginning of their tracks. Furthermore, all the sounds will loop indefinitely!  

**SN: All modals, including the sound modal, can be closed by clicking off the modal.* 
** *SN: All audio files come from ![Zapsplat](https://www.zapsplat.com/).*


### Content Options

For all content options, there is a "more content" button that can be clicked to show the user more of that specific type of content. For the gifs, artwork, and jokes content there is a search button available for the user.

The search button opens up the search modal which can be used to search tags for the specific type of content you are viewing. E.g. if you are viewing artwork and you click the "search" button, you can search a tag to find artwork related to that tag. In order to click on the search button, the user must populate the search text. If an invalid tag is input where no content can be found, then an error modal will pop-up. Once the error modal is closed, the user will be returned to the home page. There is also a "Choose For Me" button in the search modal that will select a random piece of content from the previous selection for the user.


#### **Gifs**

The gif option pulls a gif from the Giphy API based on a provided search tag. When the gif option is selected, a random gif from a predetermined array of “wholesome” search tags. The user can change the gifs being displayed by using the search button to search a specific tag or the choose for me button to grab another random “wholesome” search tag. 

#### **Artwork**

The artwork pulls from the Metropolitan Museum API and, by default, the page displays a random image from the museum’s painting collection. While the content is being pulled from the API, a loading spinner will display so that the page is not blank. When the image loads, it is masked with a blob clip path that will expand when hovered. 


#### **Quotes**

The Quotable API provides hundreds of quotes from different authors. Random quotes will be displayed when “quotes” is selected in the drop down box. In order for the user to view another quote, clicking on the “More Quotes” button is required.

#### **Jokes**

Random jokes are pulled from the I Can Haz Dad Jokes API. Clicking on the “More Jokes” button will display another random joke. The search button opens up the search modal where the user can enter a search term to pull a joke related to that term. Also, the “Choose For Me” button in the search modal will show a random joke.

### Styling / Themes 

The colors on the website change based on the time of day. These colors are designed to evoke a sense of calm and reflect the types of colors typically associated with the morning, afternoon, or evening. Animated blob shapes on the page also add playfulness to the site.

## Website

https://ashispatel.github.io/Project-1-DS-Homepage/

## Built With

* HTML
* CSS
* Javascript

### Technologies Used

* Tailwind CSS ([Link](https://tailwindcss.com/docs))
* FontAwesome ([Link](https://fontawesome.com/))
* Giphy API ([Link](https://developers.giphy.com/))
* I Can Haz Dad Jokes API ([Link](https://icanhazdadjoke.com/api))
* Quotable API ([Link](https://github.com/lukePeavey/quotable))
* Metropolitan Museum API ([Link](https://metmuseum.github.io/))

## End Note - A Thank You To The Reader