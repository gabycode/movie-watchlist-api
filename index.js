const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const mainContent = document.getElementById("main-content")

const apiKey = "fcd6c574"

async function loadMovies(searchTerm) {
    const url = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=${apiKey}`
    const res = await fetch(`${url}`)
    const data = await res.json()
    if(data.Search === true) {
        
    }
}

function findMovies() {
    let searchTerm = searchInput.value.trim()
    if(searchTerm > 0) {
        loadMovies(searchTerm)
    }
}

