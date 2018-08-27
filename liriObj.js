//requires
require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var moment = require("moment");
//spotify constructor keys
var spotify = new Spotify(keys.spotify);
var liri_bot = {
  cmd: process.argv[2],
  arg: process.argv.slice(3).join("+"),
  textFile: "log.txt",
  switchCmd: function() {
    switch (liri_bot.cmd) {
      case 'concert-this':
        this.concertThis(liri_bot.arg);
        break;
      case 'spotify-this-song':
        this.spotifyThis(liri_bot.arg);
        break;
      case 'movie-this':
        this.movieThis(liri_bot.arg);
        break;
      case 'do-what-it-says':
        this.doWhatItSays();
        break;
      default:
        console.log("Please use a valid command.")
        return;
      }
    },
    concertThis: function() {
      var artist = this.arg;
      var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&tracker_count=10";
      request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          body = JSON.parse(body);
          for (var event in body) {
            liri_bot.display("Venue: ", body[event].venue.name);
            liri_bot.display("Location: ", body[event].venue.city + ", " + body[event].venue.region + ", " + body[event].venue.country);
            var m = moment(body[event].datetime).format('MM/DD/YYYY, h:mm a').split(", ");
            liri_bot.display("Date: ", m[0]);
            liri_bot.display("Time: ", m[1]);
            liri_bot.contentAdded();
          }
        }
      });
    },
    spotifyThis: function(){
      var song = this.arg;
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
        liri_bot.display("Artist(s) Name: ", data.artists[0].name);
        liri_bot.display("Track Name: ", data.name);
        liri_bot.display("Preview URL: ", data.preview_url);
        liri_bot.display("Album: ", data.album.name);
        liri_bot.contentAdded();
      });
    },
    movieThis: function(){
      var movieName = this.arg;
      if (!movieName) {
        movieName = "Mr.+Nobody"
      };
      var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
      request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          body = JSON.parse(body);
          liri_bot.display("Title: ", body.Title);
          liri_bot.display("Year: ", body.Year);
          liri_bot.display("IMDB Rating: ", body.imdbRating);
          if (body.Ratings[2]) {
            liri_bot.display("Rotten Tomatoes Score: ", body.Ratings[2].Value);
          }
          liri_bot.display("Country: ", body.Country);
          liri_bot.display("Language: ", body.Language);
          liri_bot.display("Plot: ", body.Plot);
          liri_bot.display("Actors: ", body.Actors);
          liri_bot.contentAdded();
        }
      });
    },
    doWhatItSays: function(){
      fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        var dataArr = data.replace(/(\r\n|\n|\r)/gm, "").split(",");
        for (var i = 0; i < dataArr.length; i += 2) {
          liri_bot.cmd = dataArr[i];
          liri_bot.arg = dataArr[i + 1].replace(/['"]+/g, '').split(' ').join("+");
          liri_bot.switchCmd();
        }
      });
    },
    display: function(description, data){
      console.log(description + data);
      this.appendFile(description + data + "\n");
    },
    appendFile: function(file) {
      fs.appendFile(this.textFile, file, function(err) {
        if (err) {
          console.log(err);
        }
        else {
          // console.log("Content Added!");
        }
      });
    },
    contentAdded: function(){
      console.log("");
      console.log("Content Added!");
      console.log("-----------------------------------");
      this.appendFile("-----------------------------------\n");
    }
}
liri_bot.switchCmd();
