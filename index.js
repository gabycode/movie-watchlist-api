const searchInput = document.getElementById("search-input")
const searchForm = document.querySelector("form")
const mainContent = document.getElementById("main-content")
const searchInputValue = searchInput.value

const apiKey = "fcd6c574"

let fetchedMoviesArray = []


// I. add event to search bar(searchInput) & include function that fetchs the api data(loadMovieData)
searchForm.addEventListener('submit', e => {
    e.preventDefault()
    loadMovieData(searchInputValue)
    resetPage()

    // make a function to reset page after search
    function resetPage() {
        mainContent.innerHTML = ""
        fetchedMoviesArray = []
    }
    
})


// II. fetching the api data based on what is typed in search input
// IIa. display message in case no data is found ("e.g.movie not found")
async function loadMovieData(movie) {
    const res = await fetch(`https://www.omdbapi.com/?s=${movie}&page=1&apikey=${apiKey}`)
    const data = await res.json()
    
    // if user attempts to click search without typing value in search bar
    if(!searchInput.value) {
        mainContent.innerHTML = `<p>Please type a movie name</p>`
    } 
    // if movie name is not found display error message
    else if (data.Response === "False") {
        mainContent.innerHTML = `<p>Movie not found. Please type another</p>`
    } 
    // if movie name appears succesfully, run getMovies to get movie data
    else {
        const extractedData = data.Search.map(movie => movie.imdbId)
        getMovies(extractedData)
        searchInput.value = ''
    }
}


// III. fetch movies' id based on imdbID and push into array
async function getMovies(ids) {
    // loop through movie ids(aka extractedData)
    for(let id of ids) {
        const res = await fetch(`https://www.omdbapi.com/i=${id}&type=movie&apikey=${apiKey}`)
        const data = await res.json()
    

        // try...catch - used to push movie data into array and call displayMovies, and if not, 
        // display error message that could not find movie name
        try {
            fetchedMoviesArray.push(
                {
                    movieId: `${data.imdbID}`,
                    movieProperties: {
                        poster: `${data.Poster}`,
                        title: `${data.Title}`,
                        rating: `${data.Ratings[0].Value}`,
                        duration: `${data.Runtime}`,
                        genre: `${data.Genre}`,
                        plot: `${data.Plot}`
                    }
                }
            )
            displayMovies(fetchedMoviesArray, mainContent)
        } catch {
            mainContent.innerHTML = `<p>Oops. Couldn't find what you're looking for. Please type another search.</p>`
        }
    }     
}


// IV. display movies in the page
function displayMovies(movies, location) {
    let html =""

    // loop through movies parameter(aka fetchedMoviesArray) & display movie searches
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
                        ${isAdded(movie.id) ? 
                        `<i class="fa-solid fa-circle-plus"></i> Add to watchlist` : 
                        `<i class="fa-solid fa-circle-minus"></i> Remove from watchlist`}
                    </button>
                </div>

                <p class="desc>${movie.properties.plot}</p>
            </div>
        </div>
        <hr>        
        `
    }
    location.innerHTML = html
}