const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const mainContent = document.getElementById("main-content")

searchBtn.addEventListener('click', () => {
    mainContent.innerHTML = ""
    getMovieData().then(movieList => {
        for(let movie in movieList) {
        console.log("hi")
        }
    })
})

async function getMovieData(e) {
    e.preventDefault
    const searchValue = searchInput.value

    const res = await fetch("http://www.omdbapi.com/?apikey=fcd6c574&s=${searchValue}")
    const movies = await res.json()
    return movies
}