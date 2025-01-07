import express from 'express';
import bodyparser from 'body-parser';
import axios from 'axios';

const app = express()
const port = 3000;
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

const API_URL = "https://v2.jokeapi.dev"

app.get('/', async (req, res) => {
    try {
        const results = await axios.get(`${API_URL}/categories`);
        res.render('index.ejs', results.data);
    } catch (error) {
        console.log(error.response);
    }
})

app.get('/fetch/:cat', async (req, res) => {
    try {
        var typ = "single";
        if (req.params.cat == "Spooky" || req.params.cat == "Christmas") {
            typ = "twopart";
        }
        const results = await axios.get(`${API_URL}/joke/${req.params.cat}`, {
            params: {
                type: typ,
                amount: 1,
            }
        });
        res.render("joke.ejs", results.data);
    } catch (error) {
        console.log(error.response);
    }
})


app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
});
