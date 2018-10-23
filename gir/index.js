// Required modules
const dotenv = require('dotenv').config();
const fs = require("fs");
const request = require('request');
const moment = require('moment');
const keys = require("./keys");
const Spotify = require('node-spotify-api');

// Parameters passed after application is acticated
const action = process.argv[2];
var searchValue = "";


// Combine search terms into one string
for (var i = 3; i < process.argv.length; i++) {
    searchValue += process.argv[i] + " ";
};


    switch (action) {
  
      case 'concert-this':
        bandsInTown(searchValue);                   
        break;                          
  
      case 'spotify-this-song':
        spotSong(searchValue);
        break;
  
      case 'movie-this':
        movieInfo(searchValue);
        break;
  
      case 'do-what-it-says':
        getRandom();
        break;
  
        default:                            
        console.log("Invalid Instruction! Try a valid command");
        break;
  
    }


  
  function bandsInTown(){
    let bands = keys.bands;

    let queryUrl = "https://rest.bandsintown.com/artists/" + searchValue.trim() + "/events?app_id=" + bands + "&date=upcoming";


request(queryUrl, function(error, response, body) {

  if (!error && response.statusCode === 200) {

    var JS = JSON.parse(body);
    for (i = 0; i < JS.length; i++)
    {
      var dTime = JS[i].datetime;
        var month = dTime.substring(5,7);
        var year = dTime.substring(0,4);
        var day = dTime.substring(8,10);
        var dateForm = month + "/" + day + "/" + year
  
      console.log("\n---------------------------------------------------\n");

        
      console.log("Date: " + dateForm);
      console.log("Name: " + JS[i].venue.name);
      console.log("City: " + JS[i].venue.city);
      if (JS[i].venue.region !== "")
      {
        console.log("Country: " + JS[i].venue.region);
      }
      console.log("Country: " + JS[i].venue.country);
      console.log("\n---------------------------------------------------\n");

    }
  }
});
}

function spotSong(searchValue) {
    let spotify = new Spotify(keys.spotify);

    var searchLimit = 1
  if (searchValue == "") {
    searchValue = "The Sign ace of base";
  } 

  spotify.search({
        type: 'track',
        query: searchValue,
        limit: searchLimit
  }, function(error, data) {
    if (error) {
      console.log('Error occurred: ' + error);
      return;
    } else {
      console.log("\n---------------------------------------------------\n");
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song: " + data.tracks.items[0].name);
      console.log("Preview: " + data.tracks.items[0].preview_url);
      console.log("Album: " + data.tracks.items[0].album.name);
      console.log("\n---------------------------------------------------\n");
      
    }
  });
};
function movieInfo(searchValue) {
    let omdb = keys.omdb;


  if (searchValue === "") {
    searchValue = "Mr. Nobody";
  } 

  var queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=" + omdb;
  
  request(queryUrl, function(err, res, body) {
  	var bodyOf = JSON.parse(body);
    if (!err && res.statusCode === 200) {
      console.log("\n---------------------------------------------------\n");
      console.log("Title: " + bodyOf.Title);
      console.log("Release Year: " + bodyOf.Year);
      console.log("IMDB Rating: " + bodyOf.imdbRating);
      console.log("Rotten Tomatoes Rating: " + bodyOf.Ratings[[1]].Value); 
      console.log("Country: " + bodyOf.Country);
      console.log("Language: " + bodyOf.Language);
      console.log("Plot: " + bodyOf.Plot);
      console.log("Actors: " + bodyOf.Actors);
      console.log("\n---------------------------------------------------\n");
    }
  });
};

function getRandom() {
fs.readFile('random.txt', "utf8", function(error, data){

    if (error) {
        return console.log(error);
      }

  
    var dataArr = data.split(",");
    
    if (dataArr[0] === "spotify-this-song") 
    {
      spotSong(dataArr[1]);
    } 
    else if (dataArr[0] === "concert-this") 
    { 
      if (dataArr[1].charAt(1) === "'")
      {
      	var dLength = dataArr[1].length - 1;
      	var data = dataArr[1].substring(2,dLength);
      	console.log(datsa);
      	bandsInTown(data);
      }
      else
      {
	      var bandName = dataArr[1].trim();
	      console.log(bandName);
	      bandsInTown(bandName);
	  }
  	  
    } 
    else if(dataArr[0] === "movie-this") 
    {
      var movie_name = dataArr[1].trim().slice(1, -1);
      movieInfo(movie_name);
    } 
  
    });
};