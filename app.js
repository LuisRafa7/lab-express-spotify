require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

console.log(`´process key: ${process.env.CLIENT_ID}`);
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("homepage.hbs");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.search)
    .then((data) => {
      let artistResult = data.body.artists.items;
      res.render("artist-search.hbs", {
        artistResult,
        search: req.query.search,
      });
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      let albumsResult = data.body.items;
      res.render("albums.hbs", {
        albumsResult,
      });
    })
    .catch((err) => console.error(err));
});

app.get("/track/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      console.log("Track", data.body);
      let trackResult = data.body.items;
      res.render("track.hbs", {
        trackResult,
      });
    })
    .catch((err) => console.error(err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
