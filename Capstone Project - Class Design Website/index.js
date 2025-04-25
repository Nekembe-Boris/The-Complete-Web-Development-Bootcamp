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

app.get("/projects", (req, res) => {
    res.render("projects.ejs");
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/project-category/:type", (req, res) => {
    const query = req.params.type;

    fs.readdir(`./public/images/projects/${query}`, (err, files) => {
        if (err) throw err;

        const data = {
            proNames: files,
            proType: query,
            proDetails: {},
            images: []
        };

        const imagePromises = files.map(file => {
            return new Promise((resolve, reject) => {
                fs.readdir(`./public/images/projects/${query}/${file}`, (err, fil) => {
                    if (err) return reject(err);
                    // Add the first image or handle if no images exist
                    if (fil.length > 0) {
                        resolve(fil);  // Resolve with the first image
                    } else {
                        resolve(null);  // Resolve with null if no images found
                    }
                });
            });
        });

            // Wait for all promises to resolve
        Promise.all(imagePromises)
            .then(images => {
                data.images = images.filter(img => img !== null); // Filter out any null values

                // get all descriptions of projects under this category
                let rawdata = fs.readFileSync(__dirname + '/public/json/project_details.json', 'utf-8');
                let details = JSON.parse(rawdata);
                data.proDetails = details[query];

                res.render("mutable.ejs", data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error reading images');
            });

    });
})



app.listen(port, () => {
    console.log(`App is listening on ${port}`);
});
