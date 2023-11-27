/* url of song api --- https versions hopefully a little later this semester */
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

document.addEventListener("DOMContentLoaded", function () {
   // Create key and value for localStorage
   const localStorageKey = "musicData";
   const localStorageData = localStorage.getItem(localStorageKey);

   // Check if localStorageDataExists
   if(localStorageData) {
      const songs = JSON.parse(localStorageData);
      populateResults(songs);
      populateTopGenres(songs);
   // If not, fetch API   
   } else {
      fetch(api)
      .then(response => {
         if(response.ok) {
            return response.json();
         } else {
            throw new Error("Fetch API is down or unavailable.");
         }
      })
      .then(songData => {
         localStorage.setItem(localStorageKey, JSON.stringify(songData));
         const songs = JSON.parse(localStorage.getItem(localStorageKey));
         populateResults(songs);
         populateTopGenres(songs);
      })
      .catch(error => {
         console.error("Error fetching data:", error);
      });
    } 

   const homeContainer = document.querySelector("#homeContainer");
   const searchContainer = document.querySelector("#searchContainer");
   const playlistContainer = document.querySelector("#playlistContainer");
   const detailContainer = document.querySelector("#detailContainer");

   // Event delegation to hide/show views
   const header = document.querySelector("header");
   header.addEventListener("click", e => {
      if(e.target.nodeName == "BUTTON") {
         if(e.target.id == "searchButton") {
            showHideSearch(e);
         } else if(e.target.id == "playlistButton") {
            showHidePlaylist(e);
         }
      } else if(e.target.nodeName == "H1") {
         showHideHome(e);
      }
   });

   // Functions that show/hide the variou views
   function showHideHome(event) {
      if(homeContainer.className == "hide") {
         searchContainer.className = "hide";
         homeContainer.className = "show";
         playlistContainer.className = "hide";
         detailContainer.className = "hide";
      }
   }
   function showHidePlaylist(event) {
      if(playlistContainer.className == "hide") {
         searchContainer.className = "hide";
         homeContainer.className = "hide";
         playlistContainer.className = "show";
         detailContainer.className = "hide";
      }
   }
   function showHideSearch(event) {
      if(searchContainer.className == "hide") {
         searchContainer.className = "show";
         homeContainer.className = "hide";
         playlistContainer.className = "hide";
         detailContainer.className = "hide";
      }
   }

   function populateTopGenres(data) {
      const genreCounts = {};

      for(let d of data) {
         const genreName = d.genre.name;
         
      }
   }

   // Function that populates the results table with songs and displays song details on click
   function populateResults(songs) {
      const sortedSongs = songs.sort((a, b) => (a.title < b.title ? -1 : 2));
      const tableBody = document.querySelector("#songsData");

      for(s of sortedSongs) {
         const tr = document.createElement("tr");
         tr.dataset.song = s.song_id;
         
         tr.appendChild(tableColumn(s, "title"));
         tr.appendChild(tableColumn(s.artist, "name"));
         tr.appendChild(tableColumn(s.genre, "name"));
         tr.appendChild(tableColumn(s, "year"));

         tr.addEventListener("click", e => {
            tableClicks(e, songs);
         })

         tableBody.appendChild(tr);
      }
   }

   // Function that handles table clicks and displays song details
   function tableClicks(e, songs) {
      const songID = e.target.parentNode.dataset.song;
      const selectedSong = songs.find(s => s.song_id == songID);
         
      displaySong(selectedSong);

   }

   // Function that creates a table column
   function tableColumn(object, field) {
      const td = document.createElement("td");
      td.textContent = object[field];
      return td;
   }

   // Function that displays the song details
   function displaySong(song) {
      document.querySelector("#songsTable").className = "hide";
      document.querySelector("#songsDetails").className = "show";

      document.querySelector("#songTitle").textContent = song.title;
      document.querySelector("#songEnergy").textContent = song.analytics.energy;
      document.querySelector("#songDanceability").textContent = song.analytics.danceability;
      document.querySelector("#songLiveness").textContent = song.analytics.liveness;

      const closeBtn = document.querySelector("#returnButton");
      closeBtn.className = "show";

      closeBtn.addEventListener("click", e => {
         document.querySelector("#songsTable").className = "show";
         document.querySelector("#songsDetails").className = "hide";
         closeBtn.className = "hide";
      })
   }
});
