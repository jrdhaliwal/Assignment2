


/* url of song api --- https versions hopefully a little later this semester */	
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

 

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/
document.addEventListener("DOMContentLoaded", function() {
   const homeContainer = document.querySelector("#homeContainer");
   const searchContainer = document.querySelector("#searchContainer");
   const playlistContainer = document.querySelector("#playlistContainer")
   const detailContainer = document.querySelector("#detailContainer")

   const logo = document.querySelector("#logo");
   const searchButton = document.querySelector("#searchButton");
   const playlistButton = document.querySelector("#playlistButton");
   const detailButton = document.querySelector("#detailButton");

   logo.addEventListener("click", function(e) {
      if(e.target.nodeName == "H1") {
         showHideHome(e);
      }
   })

   searchButton.addEventListener("click", function(e) {
      if(e.target.nodeName == "BUTTON") {
         showHideSearch(e);
      }
   })

   playlistButton.addEventListener("click", function(e) {
      if(e.target.nodeName == "BUTTON") {
         showHidePlaylist(e);
      }
   })

   detailButton.addEventListener("click", function(e) {
      if(e.target.nodeName == "BUTTON") {
         showHideDetails(e);
      }
   })

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

   function showHideDetails(event) {
      if(detailContainer.className == "hide") {
         searchContainer.className = "hide";
         homeContainer.className = "hide";
         playlistContainer.className = "hide";
         detailContainer.className = "show";
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
})
