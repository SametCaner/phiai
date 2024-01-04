const express = require("express");
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("index");
});
app.get("/about", (req, res) => {
    res.render("about");
} );
app.get("/contact", (req, res) => {
    res.render("contact");
} );

const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));