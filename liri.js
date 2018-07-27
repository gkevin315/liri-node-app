require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");
var liriArgument = process.argv[2];
var twitter = require("twitter");
var client = new twitter(keys.twitter);
var spotify = require("node-spotify-api");
var spotify = new spotify(keys.spotify);
var request = require("request");
var movieName = process.argv[3];
var liriReturn = process.argv[2];

var infoEntered = process.argv;
var action = process.argv[2];

var title = ""
if (process.argv[3] !== undefined) {
    for (i = 3; i < infoEntered.length; i++) {
        title += infoEntered[i] + " ";
    };
};

switch (action) {
    case "movie-this":
        movie();
        break;

    case "spotify-this-song":
        spotifyTitle();
        break;

    case "my-tweets":
        tweets();
        break;

    case "do-what-it-says":
        doIt();
        break;

    default:
        var logDefault = "";
        console.log(logDefault);
        fs.appendFile("log.txt", logDefault, function (err) {
            if (err) {
                return console.log(err);
            };
        });
};

function movie() {
    if (process.argv[3] === undefined) {
        title = "Mr.+Nobody";
        movieInfo();
    } else if (title !== undefined) {
        titleSplit = title.split(" ");
        title = titleSplit.join("+");
        movieInfo();
    };
};

function movieInfo() {
    var queryURL = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";

    request(queryURL, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            if (body) {
                var data = JSON.parse(body);
                if (data.Error == 'Movie not found!') {
                    var logNoMovies = "\n********************************** MOVIE THIS **********************************\nOMDB could not find any movies that matched that title.  Please try again.\n********************************************************************************\n";
                    console.log(logNoMovies);
                    fs.appendFile("log.txt", logNoMovies, function (err) {
                        if (err) {
                            return console.log("No movie by that title data did not append to log.txt file.");
                        };
                    });
                } else if (data.Ratings.length < 2) {
                    var logMovies = "\n********************************** MOVIE THIS **********************************\nTitle: " + data.Title +
                        "\nRelease Year: " + data.Year +
                        "\nIMDB Rating: " + data.imdbRating +
                        "\nRotten Tomatoes Rating: No Rotten Tomatoes Rating\nCountry movie produced in: " + data.Country +
                        "\nLanguage: " + data.Language +
                        "\nPlot: " + data.Plot +
                        "\nActors: " + data.Actors + "\n********************************************************************************\n";
                    console.log(logMovies);
                    fs.appendFile("log.txt", logMovies, function (err) {
                        if (err) {
                            return console.log("Movie data did not append to log.txt file.");
                        };
                    });
                    return
                } else if (data.Ratings[1].Value !== undefined) {
                    var logMovies =
                        "\n********************************** MOVIE THIS **********************************\nTitle: " + data.Title +
                        "\nRelease Year: " + data.Year +
                        "\nIMDB Rating: " + data.imdbRating +
                        "\nRotten Tomatoes Rating: " + data.Ratings[1].Value +
                        "\nCountry movie produced in: " + data.Country +
                        "\nLanguage: " + data.Language + "\nPlot: " + data.Plot +
                        "\nActors: " + data.Actors + "";
                    console.log(logMovies);
                    fs.appendFile("log.txt", logMovies, function (err) {
                        if (err) {
                            return console.log("Movie data did not append to log.txt file.");
                        };
                    });
                };
            };
        };
        if (error) {
            var logMovieError = "OMDBapi response error. Please try again.\n"
            console.log(logMovieError)
            fs.appendFile("log.txt", logMovieError, function (err) {
                if (err) {
                    return console.log("OMDBapi response error message did not append to log.txt file.");
                };
            });
        };

    });
}

function spotifyTitle() {
    if (process.argv[3] === undefined) {
        title = "The%20Sign%20Ace%20of%20Base";
        spotifyInfo();
    } else if (title !== undefined) {
        titleSplit = title.split(" ");
        title = titleSplit.join("%20");
        spotifyInfo();
    };
};

function spotifyInfo() {
    spotify.search({
        type: 'track',
        query: title,
        limit: 1,
    }, function (err, data) {
        if (data) {
            var info = data.tracks.items
            var logSpotify =
                "\n****************************** SPOTIFY THIS SONG *******************************\nArtist: " + info[0].artists[0].name +
                "\nSong title: " + info[0].name +
                "\nAlbum name: " + info[0].album.name +
                "\nURL Preview: " + info[0].preview_url +
                "\n********************************************************************************\n";
            console.log(logSpotify)
            fs.appendFile("log.txt", logSpotify, function (err) {
                if (err) {
                    return console.log("Spotify song data was not appended to the log.txt file.");
                };
            });
        } else if (err) {
            var logNoSpotify =
                "\n****************************** SPOTIFY THIS SONG *******************************\nSpotify could not find a song with that title. Please try Again.\n********************************************************************************\n";
            console.log(logNoSpotify);
            fs.appendFile("log.txt", logNoSpotify, function (err) {
                if (err) {
                    return console.log("Spotify no song data found was not appended to the log.txt file.");
                };
            });
        };
    });
};

function tweets() {

    var params = {
        screen_name: 'projectnodeliri',
        count: 20
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            var logTweetHeader = ("\n********************************** MY TWEETS ***********************************");
            console.log(logTweetHeader)
            fs.appendFile("log.txt", logTweetHeader + "\n", function (err) {
                if (err) {
                    return console.log("Twitter header was not appended to the log.txt file.");
                }
            });
            for (i = 0; i < tweets.length; i++) {
                var logTweets = i + 1 + ". Tweet: " + tweets[i].text + "\n    Created: " + tweets[i].created_at;
                console.log(logTweets);
                // add tweets to log.txt file
                fs.appendFile("log.txt", logTweets + "\n********************************************************************************\n", function (err) {
                    if (err) {
                        return console.log("Twitter data was not appended to the log.txt file.");
                    };
                });
                console.log("********************************************************************************");
            };
        };
    });
};

function doIt() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            var logDoIt = ("\n************************** Do-What-It-Says *****************************\nThere was a problem reading the random.txt file. Please try again.\n********************************************************************************");
            return console.log(logDoIt);
            fs.appendFile("log.txt", logDoIt, function (err) {
                if (err) {
                    return console.log("do-what-it-says data was not appended to the log.txt file.");
                };
            });
        };

        var output = data.split(",");
        action = output[0];
        process.argv[3] = output[1];
        title = process.argv[3];

        if (action === 'spotify-this-song') {
            spotifyTitle();
        };
    });
};