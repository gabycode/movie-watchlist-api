const watchlist = document.getElementById("watchlist")
const watchlistArray = []
const watchlistFetched = []

const apiKey = "fcd6c574"

// I. Check localStorage state. If empty, call getMovieList. If otherwise, display message.
if(localStorage.length > 0) {
    getStorageKeys()
    getMovieList(watchlistArray)
} else {
    watchlist.innerHTML = `
    <h2 class="msg">Your watchlist is looking a little empty...</h2>
    <h2 class="msg-add"><a href="index.html"><i class="fa-solid fa-circle-plus"></i>Let's add some movies!</a></h2>
    `
}


// II. get localStorage keys and push into array
function getStorageKeys() {
    for(let i=0; i < localStorage.length; i++) {
        watchlistArray.push(localStorage.getItem( localStorage.key(i) ))
    }
}


// III. fetch items
async function getMovieList(ids) {
    for(let id of ids) {
        const res = await fetch(`https://www.omdbapi.com/?i=${id}&type=movie&apikey=${apiKey}`)
        const data = await res.json()

    try {
            watchlistFetched.push(
                {
                    id: `${data.imdbID}`,
                    properties: {
                        poster: `${data.Poster}`,
                        title: `${data.Title}`,
                        rating: `${data.Ratings[0].Value}`,
                        duration: `${data.Runtime}`,
                        genre: `${data.Genre}`,
                        plot: `${data.Plot}`
                    }
                }
            )
            displayWatchlist(watchlistFetched, watchlist)
            console.log(watchlistFetched)
        } catch {
            watchlist.innerHTML = `<p class="error">Oops. Couldn't find what you're looking for. Please type another search.</p>`
        }
    }
}


// IV. display watchlist
function displayWatchlist(movies, location) {
    let html = ""

    for(let movie of movies) {
        html += `
        <div class="movie-element">
            <img src="${movie.properties.poster === "N/A" ? './img/No_Img_Avail.jpg' : movie.properties.poster}" alt="Poster of ${movie.properties.title}">

            <div class="movie-desc">
                <div class="title-rating">
                    <h2>${movie.properties.title}</h2>
                    <p class="rating"><i class="fa-solid fa-star"></i>${movie.properties.rating.slice(0, 3)}</p>
                </div>

                <div class="time-genre-add">
                    <p>${movie.properties.duration}</p>
                    <p>${movie.properties.genre}</p>
                    <button class="watchlist" id="${movie.id}">
                        <i class="fa-solid fa-circle-minus"></i> Remove from watchlist
                    </button>
                </div>

                <div class="desc">
                    <p>${movie.properties.plot}</p>
                </div>
            </div>
        </div>
        <hr> 
        `
    }
    location.innerHTML = html
    const watchlistBtn = document.querySelectorAll(".watchlist")
    watchlistBtn.forEach(button => {
        button.addEventListener('click', removeFromWatchlist)
    })
}


// V. click -remove to remove items from watchlist & reload page
function removeFromWatchlist() {
    localStorage.removeItem(this.id)
    this.innerHTML = `<i class="fa-solid fa-circle-plus"></i> Removing from watchlist...`
    this.removeEventListener('click', removeFromWatchlist)
    location.reload()
}