# liri-node-app

#liri accepts four commands

#liri will console.log data related to user search

#liri will then appendFile using node "fs" to log.txt file

1. node liri.js concert-this <artist/band name here>
  - This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
    * Name of the venue
    * Venue location
    * Date of the Event (use moment to format this as "MM/DD/YYYY")
2. node liri.js spotify-this-song <song name here>
  - This will show the following information about the song in your terminal/bash window
  
    * Artist(s)
    * The song's name
    * A preview link of the song from Spotify
    * The album that the song is from
  
  - If no song is provided then your program will default to "The Sign" by Ace of Base.
  - You will utilize the node-spotify-api package in order to retrieve song information from the Spotify API.
3. node liri.js movie-this <movie name here>
  
   * Title of the movie.
   * Year the movie came out.
   * IMDB Rating of the movie.
   * Rotten Tomatoes Rating of the movie.
   * Country where the movie was produced.
   * Language of the movie.
   * Plot of the movie.
   * Actors in the movie.
   
  - This will output the following information to your terminal/bash window:
  - If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
  - If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
  - It's on Netflix!
  - You'll use the request package to retrieve data from the OMDB API.
4. node liri.js do-what-it-says
  - Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
  - It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
  - Feel free to change the text in that document to test out the feature for other commands.
