//requires
require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);
//command line agument variables
var cmd = process.argv[2];
var arg = process.argv.slice(3).join("+");
var textFile = "log.txt";
commandSwitch(cmd, arg);
//main command switch statement function
function commandSwitch(cmd, arg) {
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
    default:
      console.log("Please use a valid command.")
      return;
  }
}
// call main switch statement function
//concert-this function
function concertThis(arg) {
  var artist = arg;
  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&tracker_count=10";
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body);
      for (var event in body) {
        display("Venue: ", body[event].venue.name);
        display("Location: ", body[event].venue.city + ", " + body[event].venue.region + ", " + body[event].venue.country);
        var m = moment(body[event].datetime).format('MM/DD/YYYY, h:mm a').split(", ");
        display("Date: ", m[0]);
        display("Time: ", m[1]);
        contentAdded();
      }
    }
  });
}
//spotify-this function
function spotifyThis(arg) {
  var song = arg;
  if (!song) {
    song = "The+Sign";
    console.log(song);
  }
  spotify.search({
    type: 'track',
    query: song
  }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    data = data.tracks.items[0];
    // console.log(data);
    display("Artist(s) Name: ", data.artists[0].name);
    display("Track Name: ", data.name);
    display("Preview URL: ", data.preview_url);
    display("Album: ", data.album.name);
    contentAdded();
  });
}
// movie-this function
function movieThis(arg) {
  var movieName = arg;
  if (!movieName) {
    movieName = "Mr.+Nobody"
  };
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body);
      display("Title: ", body.Title);
      display("Year: ", body.Year);
      display("IMDB Rating: ", body.imdbRating);
      if (body.Ratings[2]) {
        display("Rotten Tomatoes Score: ", body.Ratings[2].Value);
      }
      display("Country: ", body.Country);
      display("Language: ", body.Language);
      display("Plot: ", body.Plot);
      display("Actors: ", body.Actors);
      contentAdded();
    }
  });
}
// do-what-it-says function
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.replace(/(\r\n|\n|\r)/gm, "").split(",");
    for (var i = 0; i < dataArr.length; i += 2) {
      var cmd = dataArr[i];
      var arg = dataArr[i + 1].replace(/['"]+/g, '').split(' ').join("+");
      commandSwitch(cmd, arg);
    }
  });
}
// console.log / appendFile function
function display(description, data) {
  console.log(description + data);
  appendFile(description + data + "\n");
}

function contentAdded() {
  console.log("");
  console.log("Content Added!");
  console.log("-----------------------------------\n");
  appendFile("-----------------------------------\n");
}
//appendFile function
function appendFile(arg) {
  fs.appendFile(textFile, arg, function(err) {
    if (err) {
      console.log(err);
    } else {}
  });
}
