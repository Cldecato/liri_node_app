require("dotenv").config();

var request = require("request");
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var keys = require("./keys.js");    
var fs = require('fs');

var spot = new spotify(keys.spotify);
var client = new twitter(keys.twitter);

var args = process.argv;
var searchSong = '';
var searchMovie = '';

function run(input) {
    switch (input[2]) {
        case "twitter":
            getTweets();
            break;
        case "spotify":
            getSong(input);
            break;
        case "movie":
            getMovie(input);
            break;
        case "random":
            readText();
            break;
        default:
            console.log("Type a command in ya dummy.");
            break;
    }
}

function getTweets() {
    var params = {screen_name: 'dumdumaccount1', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log('Error occurred: ' + error);
        } 
        for (var i = 0; i < tweets.length; i++) {
            console.log(`------------------------------`);          
            console.log(`dumdumaccount1 Tweet #${i + 1}`); 
            console.log(`${tweets[i].text}`);
            console.log(`${tweets[i].created_at}`);                  
            console.log(`------------------------------`);
        }
    });
}

function getSong(input) {
    if (!input[3]) {
        searchSong = "The Sign";
    } else {
        for (var i = 3; i < input.length; i++) {
            if (i > 3 && i < input.length) {
                searchSong = searchSong + "+" + input[i];
            } else {
                searchSong += input[i];
            }
        }
    }
    spot.search({
            type: "track",
            query: searchSong,
            limit: 3
        },
        function (err, data) {
            if (err) {
                return console.log(`Error occurred: ${err}`);
            }
            var results = data.tracks.items;
            for (key in results) {
                console.log(`------------------------------`);
                console.log(`Artist: ${results[key].artists[0].name}`);
                console.log(`Song Name: ${results[key].name}`);
                console.log(`Album Name: ${results[key].album.name}`);
                console.log(`Spotify Link: ${results[key].external_urls.spotify}`);
            }
        }
    );
}

function getMovie(input) {
    if (!args[3]) {
        searchMovie = "Mr Nobody";
    } else {
        for (var i = 3; i < input.length; i++) {
            if (i > 3 && i < input.length) {
                searchMovie = searchMovie + "+" + input[i];
            } else {
                searchMovie += input[i];
            }
        }
    }
    var queryUrl =
        "http://www.omdbapi.com/?t=" +
        searchMovie +
        "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (err, response, body) {
        if (err) {
            return console.log(`Error occurred: ${err}`);
        }
        console.log(`------------------------------`);
        console.log(`Movie Title: ${JSON.parse(body).Title}`);
        console.log(`Release Year: ${JSON.parse(body).Year}`);
        console.log(`${JSON.parse(body).Ratings[0].Source} Rating: ${JSON.parse(body).Ratings[0].Value}`);
        console.log(`${JSON.parse(body).Ratings[1].Source} Rating: ${JSON.parse(body).Ratings[1].Value}`);
        console.log(`Country Movie was Produced: ${JSON.parse(body).Country}`);
        console.log(`Language: ${JSON.parse(body).Language}`);
        console.log(`Actors: ${JSON.parse(body).Actors}`);
        console.log(`Plot: ${JSON.parse(body).Plot}`);
        console.log(`------------------------------`);
    });
}

function readText() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(`Error occurred: ${err}`);
        }
        console.log(`You are running: ${data}`);
        var dataArr = data.split(",");
        var random = ['/usr/local/bin/node', '/Users/Corey1/Desktop/codingBootcamp/homework/liri_node_app/liri.js'];
        random.push(dataArr[0]);
        random.push(dataArr[1]);
        run(random);
    });
}

run(args);