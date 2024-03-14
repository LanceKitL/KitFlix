import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 5000;
const host = '192.168.100.248';

let genresList;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');



//function for GenreList
async function getGenreList() {
    try {
        const genreListUrl = await axios.get("http://127.0.0.1:3000/anime/gogoanime/genre/list")
        genresList = genreListUrl.data;
        // console.log(genresList);
    } catch (error) {
        console.log(error)
    }
}


//FOR ANIME
app.get("/", async (req, res) => {

    const searchItem = req.body.search;
    try {
        //TOP-AIRING ANIMES
        const url = await axios.get("http://127.0.0.1:3000/anime/gogoanime/top-airing");
        const item = url.data;

        //GETTING THE GENRE-LIST
        await getGenreList();

        // Set selectedGenre to an empty string if not defined
        const selectedGenre = req.params.id || '';

        res.render("index", { item: item, searchItem: searchItem, genresList, selectedGenre }); // Pass items to the EJS template
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});



app.post("/submit", async (req, res) => {
    const searchItem = req.body.search;
    if (searchItem) {
        try {
            const url = await axios.get(`http://127.0.0.1:3000/anime/gogoanime/${searchItem}`);
            const item = url.data;

            // Fetch the genre list
            await getGenreList();

            // Assuming you want to pass a selectedGenre, adjust this according to your logic
            const selectedGenre = req.params.id || ''; // Make sure to capture 'id' properly

            // Render the 'index' template with the fetched data
            res.render("index", { item: item, searchItem: searchItem, genresList, selectedGenre });
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    } else {
        // Redirect to the home page if searchItem is not provided
        res.redirect("/");
    }
});


//items streaming page
app.get('/stream/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(`ID: ${id}`)
        const url = await axios.get(`http://127.0.0.1:3000/anime/gogoanime/info/${id}`);
        const item = url.data;
        // console.log(item)
        res.render('stream', { item: item });
    } catch (error) {
        console.log(error)
        res.redirect("/");

    }

});

//displaying genre
app.get("/genre/:id", async (req, res) => {
    try {
        const searchItem = req.body.search;
        const selectedGenre = req.params.id;
        const url = await axios.get(`http://127.0.0.1:3000/anime/gogoanime/genre/${selectedGenre}`)
        const item = url.data;
        // console.log(item);
        //Fetch genres
        await getGenreList()

        res.render("index", { item: item, searchItem: searchItem, genresList, selectedGenre });
    } catch (error) {
        console.log("error fetching data");
        console.log("Redirecting!");
        setTimeout(function () {
            selectedGenre == "";
            res.redirect("/");
        }, 2000)
    }

})


//
app.get("/movies", async (req, res) => {
    try {
        const url = await axios.get(`http://127.0.0.1:3000/movies/flixhq/info`);
        const item = url.data;
        console.log(item)


        res.render("movies");

    } catch (error) {

    }
})



app.listen(port, () => {
    console.log(`Server is running on port https://${host}:${port}/`);
});