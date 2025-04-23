import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


app.get("/data", (req, res) => {
    fs.readdir("./public/images/background", (err, files) => {
        if (err) throw err;
        res.send(files);
    });
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});


app.listen(port, () => {
    console.log(`App is listening on ${port}`);
});
