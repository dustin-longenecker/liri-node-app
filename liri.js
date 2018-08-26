//requires
require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var moment = require("moment");

//spotify constructor keys
var spotify = new Spotify(keys.spotify);

//command line agument variables
var command = process.argv[2];
var argument = process.argv.slice(3).join("+");

//main command switch statement function
function commandSwitch(cmd, arg){
  switch (cmd) {
      case 'concert-this':
        concertThis(arg);
      break;
      case 'spotify-this-song':
        spotifyThis(arg);
      break;
      case 'movie-this':
        movieThis(arg);
      break;
      case 'do-what-it-says':
        doWhatItSays();
      break;
  }
}
// call main switch statement function
commandSwitch(command, argument);
//concert-this function
function concertThis(arg){
  var artist = arg;
  var queryUrl ="https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  var concert = [];
  request(queryUrl, function(error, response, body){
    if (!error && response.statusCode === 200) {
      // console.log("Title: " + JSON.parse(body).Title);
      // console.log(JSON.parse(body));
      // console.log(JSON.parse(body)[0].venue.name);
      body = JSON.parse(body);
      for (var event in body){
        console.log("Venue: " + body[event].venue.name)

        appendFile("Venue: " + body[event].venue.name + "\n");
        console.log("Location: " + body[event].
        venue.city + ", " + body[event].venue.country);
        appendFile("Location: " + body[event].
        venue.city + ", " + body[event].venue.country + "\n");
        // console.log("Date: " + body[event].datetime);
        var m = moment(body[event].datetime).format('MM DD YYYY');
        // , h:mm:ss a
        // console.log(m);
        m = m.split(" ").join("/");
        // console.log(m);
        // m[0] = m[0].split(" ").join("/");
        // appendFile("DateTime:  " + m[0] + ", " + m[1] + "\n");
        appendFile("Date: " + m + "\n");
        console.log("Date: " + m);
      }
    }
  })
}
//spotify-this function
function spotifyThis(arg){
  var song = arg;
  if(!song){
    song = "The+Sign";
    console.log(song);
  }
  spotify.search({ type: 'track', query: song }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
// console.log(data);
console.log("Artist(s) Name: " + data.tracks.items[0].artists[0].name);
console.log("Track Name: " + data.tracks.items[0].name);
console.log("Preview URL: " + data.tracks.items[0].preview_url);
console.log("Album: " + data.tracks.items[0].album.name);
appendFile("Artist(s) Name: " + data.tracks.items[0].artists[0].name + "\n");
appendFile("Track Name: " + data.tracks.items[0].name + "\n");
appendFile("Preview URL: " + data.tracks.items[0].preview_url + "\n");
appendFile("Album: " + data.tracks.items[0].album.name + "\n");

});
}
// movie-this function
function movieThis(arg){
  var movieName = arg;
  if(!movieName){movieName="Mr.+Nobody"};
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body){
    if (!error && response.statusCode === 200) {
      console.log("Title: " + JSON.parse(body).Title);
      appendFile("Title: " + JSON.parse(body).Title + "\n");

      console.log("Year: " + JSON.parse(body).Year);
      appendFile("Year: " + JSON.parse(body).Year + "\n");

      console.log("imdbRating: " + JSON.parse(body).imdbRating);
      appendFile("imdbRating: " + JSON.parse(body).imdbRating + "\n");

      if(JSON.parse(body).Ratings[2]){
      console.log("Rotten Tomatoes Score: " + JSON.parse(body).Ratings[2].Value);
      appendFile("Rotten Tomatoes Score: " + JSON.parse(body).Ratings[2].Value + "\n");

      }
      console.log("Country: " + JSON.parse(body).Country);
      appendFile("Country: " + JSON.parse(body).Country + "\n");

      console.log("Language: " + JSON.parse(body).Language);
      appendFile("Language: " + JSON.parse(body).Language + "\n");

      console.log("Plot: " + JSON.parse(body).Plot);
      appendFile("Plot: " + JSON.parse(body).Plot + "\n");

      console.log("Actors: " + JSON.parse(body).Actors);
      appendFile("Actors: " + JSON.parse(body).Actors + "\n");


    }
  })
}
// do-what-it-says function
function doWhatItSays(){
  fs.readFile("random.txt", "utf8", function(error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
    // We will then print the contents of data
    console.log(data);
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
    var cmd = dataArr[0];
    var arg = dataArr[1];
    arg = arg.replace(/['"]+/g, '');
    // We will then re-display the content as an array for later use.
    console.log(dataArr);
    arg = arg.split(' ').join("+");
    console.log(arg);
    commandSwitch(cmd, arg);
  });

}



// Next, we store the text file filename given to us from the command line.
var textFile = "log.txt";
function appendFile(arg){
  fs.appendFile(textFile, arg, function(err) {

    // If an error was experienced we will log it.
    if (err) {
      console.log(err);
    }

    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
    else {
      console.log("Content Added!");
    }

  });
}

// Next, we append the contents "Hello Kitty" into the file.
// If the file didn't exist, then it gets created on the fly.
