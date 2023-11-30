/* url of song api --- https versions hopefully a little later this semester */
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

document.addEventListener("DOMContentLoaded", function () {
   // Create key and value for localStorage
   const localStorageKey = "musicData";
   const localStorageData = localStorage.getItem(localStorageKey);
   let playlistArray = [];

   // Check if localStorageDataExists
   if(localStorageData) {
      const songs = JSON.parse(localStorageData);
      const fixedSongs = songs.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 2));
      handleProgram(fixedSongs);
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
         const fixedSongs = songs.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 2));
         handleProgram(fixedSongs);
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

   // Functions that show/hide the various views
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

   // Function that populates the Top Genres column
   function populateTopGenres(data) {
      // Using set to find all unique genre names, retrieved from: https://www.w3schools.com/js/js_object_sets.asp
      const uniqueGenres = new Set(data.map(d => d.genre.name));
      const genresArray = [];

      for(let u of uniqueGenres) {
         const found = data.filter(d => d.genre.name == u);
         const foundLength = found.length;
         const genreObject = {genre: u, songCount: foundLength};
         genresArray.push(genreObject);
      }
      genresArray.sort((a, b) => b.songCount - a.songCount);
      
      const topGenres = document.querySelector("#topGenres");

      for(let x = 0; x < 15; x++) {
         const li = document.createElement("li");
         const a = document.createElement("a");
         a.dataset.genre = genresArray[x].genre;
         a.textContent = genresArray[x].genre;

         li.appendChild(a);
         topGenres.appendChild(li);
      }

      topGenres.addEventListener("click", e => {
         if(e.target.nodeName == "A") {
            displayGenreFromHome(e, data);
         }
      })
   }
   // Function that populates the Top Artists column
   function populateTopArtists(data) {
      const uniqueArtists = new Set(data.map(d => d.artist.name));
      const artistsArray = [];

      for(let u of uniqueArtists) {
         const found = data.filter(d => d.artist.name == u);
         const foundLength = found.length;
         const genreObject = {artist: u, songCount: foundLength};
         artistsArray.push(genreObject);
      }
      artistsArray.sort((a, b) => b.songCount - a.songCount);
      
      const topArtists = document.querySelector("#topArtists");

      for(let x = 0; x < 15; x++) {
         const li = document.createElement("li");
         const a = document.createElement("a");
         a.dataset.artist = artistsArray[x].artist;
         a.textContent = artistsArray[x].artist;

         li.appendChild(a);
         topArtists.appendChild(li);
      }

      topArtists.addEventListener("click", e => {
         if(e.target.nodeName == "A") {
            displayArtistFromHome(e, data);
         }
      })
   }
   // Function that populates the Most Popular Songs column
   function populateTopSongs(data) {
      const sortedSongs = [];

      for(let d of data) {
         const songObject = {song: d.title, popularity: d.details.popularity};
         sortedSongs.push(songObject);
      }
      sortedSongs.sort((a, b) => b.popularity - a.popularity);
      
      const topSongs = document.querySelector("#popularSongs");
      
      for(let x = 0; x < 15; x++) {
         const li = document.createElement("li");
         const a = document.createElement("a");
         a.dataset.title = sortedSongs[x].song;
         a.textContent = sortedSongs[x].song;

         li.appendChild(a);
         topSongs.appendChild(li);
      }

      topSongs.addEventListener("click", e => {
         if(e.target.nodeName == "A") {
            displaySongFromHome(e, data);
         }
      })
   }
   // Function that populates the results table with songs and displays song details on click
   function populateResults(songs, playlistArray) {
      const tableBody = document.querySelector("#songsData");
      tableBody.innerHTML = "";

      for(s of songs) {
         const tr = document.createElement("tr");
         tr.dataset.song = s.song_id;

         const button = document.createElement("button");
         button.dataset.song = s.song_id;
         button.textContent = "Add";
         
         
         tr.appendChild(tableColumn(s, "title"));
         tr.appendChild(tableColumn(s.artist, "name"));
         tr.appendChild(tableColumn(s.genre, "name"));
         tr.appendChild(tableColumn(s, "year"));
         tr.appendChild(tableColumn(s.details, "popularity"));
         tr.appendChild(button);

         tr.addEventListener("click", e => {
            if(e.target.nodeName == "TD") {
               tableClicks(e, songs);
            } else if(e.target.nodeName == "BUTTON") {
               const songID = e.target.dataset.song;
               const foundSong = songs.find(s => s.song_id == songID);
               playlistArray.push(foundSong);
               populatePlaylist(playlistArray);
               popup2 = document.querySelector("#popup2");
               popup2.className = "show";

               setTimeout(function() {
                  popup2.className = "hide";
               }, 3000);
            }
         }) 

         tableBody.appendChild(tr);
      }
   }
   // Function that populates the search column with the various artists and genres
   function populateSearch(songs) {
      const artistSelect = document.querySelector("#artistSelect");
      const genreSelect = document.querySelector("#genreSelect");

      const uniqueArtists = new Set(songs.map(s => s.artist.name));
      const uniqueGenres = new Set(songs.map(s => s.genre.name));

      for(let a of uniqueArtists) {
         const optionArtist = document.createElement("option");
         optionArtist.value = a;
         optionArtist.textContent = a;

         artistSelect.appendChild(optionArtist);
      }

      for(let g of uniqueGenres) {
         const optionGenre = document.createElement("option");
         optionGenre.value = g;
         optionGenre.textContent = g;

         genreSelect.appendChild(optionGenre);
      }
   }

   // Function that populates the playlist column with the added songs
   function populatePlaylist(songs) {
      const playlistData = document.querySelector("#playlistData");
      const songsNumber = document.querySelector("#songsNumber");
      playlistData.innerHTML = "";

      for(s of songs) {
         const tr = document.createElement("tr");
         tr.dataset.song = s.song_id;

         songsNumber.textContent = `# of songs: ${playlistArray.length}`;

         const button = document.createElement("button");
         button.dataset.song = s.song_id;
         button.textContent = "Remove";
         
         tr.appendChild(tableColumn(s, "title"));
         tr.appendChild(tableColumn(s.artist, "name"));
         tr.appendChild(tableColumn(s.genre, "name"));
         tr.appendChild(tableColumn(s, "year"));
         tr.appendChild(tableColumn(s.details, "popularity"));
         tr.appendChild(button);

         playlistData.appendChild(tr);

         tr.addEventListener("click", e => {
            if(e.target.nodeName == "TD") {
               const songID = e.target.parentNode.dataset.song;
               displaySongFromPlaylist(songID, songs);
            }
         })
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
      document.querySelector("#searchContainer").className = "hide";
      document.querySelector("#detailContainer").className = "show";

      displayDetails(song);
   }
   // Function that displays the song details when selected from Home view
   function displaySongFromHome(e, data) {
      title = e.target.dataset.title;
      const foundSong = data.find(d => d.title == title);

      document.querySelector("#homeContainer").className = "hide";
      document.querySelector("#detailContainer").className = "show";

      displayDetails(foundSong);      
   }

   // Function that displays songs when clicked from the playlist
   function displaySongFromPlaylist(e, data) {
      console.log(e);
      const foundSong = data.find(d => d.song_id == e);

      document.querySelector("#playlistContainer").className = "hide";
      document.querySelector("#detailContainer").className = "show";

      console.log(foundSong);
      displayDetails(foundSong);
   }

   // Function that displays the selected genre when selected from Home view
   function displayGenreFromHome(e, data) {
      genre = e.target.dataset.genre;
      const genreArray = data.filter(d => d.genre.name == genre);

      document.querySelector("#homeContainer").className = "hide";
      document.querySelector("#searchContainer").className = "show";
      
      populateResults(genreArray, playlistArray);
      sort(genreArray);
   }
   // Function that displays the selected artist when selected from Home view
   function displayArtistFromHome(e, data) {
      artist = e.target.dataset.artist;
      const artistArray = data.filter(d => d.artist.name == artist);

      document.querySelector("#homeContainer").className = "hide";
      document.querySelector("#searchContainer").className = "show";
      
      populateResults(artistArray, playlistArray);
      sort(artistArray);
   }
   // Function that fills table in Song Details view
   function displayDetails(song) {
      document.querySelector("#songTitleHome").textContent = song.title;
      document.querySelector("#songEnergyHome").textContent = song.analytics.energy;
      document.querySelector("#songDanceabilityHome").textContent = song.analytics.danceability;
      document.querySelector("#songLivenessHome").textContent = song.analytics.liveness;
      document.querySelector("#songValenceHome").textContent = song.analytics.valence;
      document.querySelector("#songAcousticnessHome").textContent = song.analytics.acousticness;
      document.querySelector("#songSpeechinessHome").textContent = song.analytics.speechiness;
      document.querySelector("#bpmHome").textContent = song.details.bpm;
      document.querySelector("#popularityHome").textContent = song.details.popularity;
      document.querySelector("#loudnessHome").textContent = song.details.loudness;
      document.querySelector("#durationHome").textContent = song.details.duration;

      const btnClose = document.querySelector("#returnButtonHome");
      btnClose.className = "show";

      btnClose.addEventListener("click", e => {
         document.querySelector("#searchContainer").className = "show";
         document.querySelector("#detailContainer").className = "hide";
         btnClose.className = "hide";
      })

      displayRadarChart(song);
   }

   // Function that displays radar chart
   // Got some help from: https://www.tutorialspoint.com/chartjs/chartjs_radar_chart.htm
   function displayRadarChart(song) {
      const radarCanvas = document.getElementById("radarChart");
      
      Chart.getChart(radarCanvas)?.destroy();
   
      // Extract relevant data for the radar chart
      const labels = ["Energy", "Danceability", "Liveness", "Valence", "Acousticness", "Speechiness"];
      const data = [
         song.analytics.energy,
         song.analytics.danceability,
         song.analytics.liveness,
         song.analytics.valence,
         song.analytics.acousticness,
         song.analytics.speechiness,
      ];
   
      // Create radar chart
      new Chart(radarCanvas, {
         type: "radar",
         data: {
            labels: labels,
            datasets: [{
               label: "Song Details",
               data: data,
               backgroundColor: "rgba(75, 192, 192, 0.2)",
               borderColor: "rgba(75, 192, 192, 1)",
               borderWidth: 2,
               pointBackgroundColor: "rgba(75, 192, 192, 1)",
            }],
         },
         options: {
            responsive: true,
            maintainAspectRatio: false,
            height: 500,
            width: 500,
            scale: {
               ticks: {
                  beginAtZero: true,
                  max: 1,
               },
            },
         },
      });
   }

   // Function to sort the results table in the Search view
   function sort(data) {
      const songData = document.querySelector("#songsData");
      const tr = document.querySelector("#songsContainer");

      tr.addEventListener("click", e => {
         if(e.target.id == "title") {
            const sortedSongs = data.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 2));
            songData.innerHTML = "";

            populateResults(sortedSongs, playlistArray);
         } else if(e.target.id == "artist") {
            const sortedArtists = data.sort((a, b) => (a.artist.name.toLowerCase() < b.artist.name.toLowerCase() ? -1 : 2));
            songData.innerHTML = "";

            populateResults(sortedArtists, playlistArray);
         } else if(e.target.id == "year") {
            const sortedYear = data.sort((a, b) => b.year - a.year);
            songData.innerHTML = "";

            populateResults(sortedYear, playlistArray);
         } else if(e.target.id == "genre") {
            const sortedGenres = data.sort((a, b) => (a.genre.name.toLowerCase() < b.genre.name.toLowerCase() ? -1 : 2));
            songData.innerHTML = "";

            populateResults(sortedGenres, playlistArray);
         } else if(e.target.id == "popularity") {
            const sortedPopularity = data.sort((a, b) => b.details.popularity - a.details.popularity);
            songData.innerHTML = "";

            populateResults(sortedPopularity, playlistArray);
         } else if(e.target.nodeName == "BUTTON") {

         }
      })

      
   }
   // Function that handles all searching 
   function search(data) {
      const titleRadio = document.querySelector("#titleRadio");
      const titleName = document.querySelector("#titleName");
      const searchColumn = document.querySelector("#searchColumn");
      const artistSelect = document.querySelector("#artistSelect");
      const genreSelect = document.querySelector("#genreSelect");
      
      titleRadio.checked = true;
      titleName.disabled = false;
      artistSelect.disabled = true;
      genreSelect.disabled = true;

      searchColumn.addEventListener("click", e => {
         if(e.target.id == "titleRadio") {
            titleName.disabled = false;
            artistSelect.disabled = true;
            genreSelect.disabled = true;
         } else if(e.target.id == "artistRadio") {
            artistSelect.disabled = false;
            titleName.disabled = true;
            genreSelect.disabled = true;
         } else if(e.target.id == "genreRadio") {
            genreSelect.disabled = false;
            artistSelect.disabled = true;
            titleName.disabled = true;
         }
      })

      searchColumn.addEventListener("click", e => {
         if(e.target.id == "clearButton") {
            populateResults(data, playlistArray);
            sort(data);
            titleName.value = "";
            genreSelect.value = "";
            artistSelect.value = "";
         } else if(e.target.id == "filterButton") {
            if(titleName.disabled == false) {
               const userChoice = titleName.value.toLowerCase();
               const selectedSong = data.filter(d => d.title.toLowerCase() == userChoice);
               populateResults(selectedSong, playlistArray);
               sort(selectedSong);
               if(userChoice == "") {
                  populateResults(data, playlistArray);
                  sort(data);
               }
            } else if(artistSelect.disabled == false) {
               // Retrieve value of selected option, retrieved from: https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript
               const userOption = artistSelect.options[artistSelect.selectedIndex].value.toLowerCase();
               const selectedArtist = data.filter(d => d.artist.name.toLowerCase() == userOption);
               populateResults(selectedArtist, playlistArray);
               sort(selectedArtist);
            } else if(genreSelect.disabled == false) {
               const userOption = genreSelect.options[genreSelect.selectedIndex].value.toLowerCase();
               const selectedGenre = data.filter(d => d.genre.name.toLowerCase() == userOption);
               populateResults(selectedGenre, playlistArray);
               sort(selectedGenre);
            }
         }
      })
   }

   // Function to popup the when mousing over the credits button
   function credits() {
      const nav = document.querySelector("nav");
      const popup = document.querySelector("#popup");
      nav.addEventListener("mouseover", e => {
         if(e.target.id == "creditsButton") {
            popup.className = "show";
            setTimeout(() => {
               popup.className = "hide";
            }, 5000);
         }
      })
   }

   // Function to remove songs from the playlist 
   function remove(songs) {
      const playlistData = document.querySelector("#playlistData");
      const playlistColumn = document.querySelector("#playlistColumn");
      
      playlistData.addEventListener("click", e => {
         if(e.target.nodeName == "BUTTON") {
            const songID = e.target.dataset.song;
            const foundSong = songs.find(s => s.song_id == songID);
            const songIndex = playlistArray.indexOf(foundSong);
            playlistArray.splice(songIndex, 1);
            populatePlaylist(playlistArray);
            popup3 = document.querySelector("#popup3");
            popup3.className = "show";

            setTimeout(function() {
               popup3.className = "hide";
            }, 3000);
         }
      })
      // Doesn't work unfortunately, breaks code
     /* playlistColumn.addEventListener("click", e => {
         if(e.target.id == "clearPlaylist") {
            playlistArray = [];
            populatePlaylist(playlistArray);
         }
      })*/

   }

   // Function that handles all other functions. Runs on page load.
   function handleProgram(data) {
      populateResults(data, playlistArray);
      populateSearch(data);
      populateTopGenres(data);
      populateTopArtists(data);
      populateTopSongs(data);
      sort(data);
      search(data);
      remove(playlistArray, data);
      credits();
   }
});
