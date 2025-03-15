const express = require("express");
const fs = require("fs"); //dosya sistemi için
const path = require("path");
const bodyParser = require("body-parser"); //gelen isteklerin body kısmını json olarak işlemek için

const app = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, "db.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.set("view engine", "ejs"); //dinamik html oluşturmak için

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH)); //json okuyan fonksiyon
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

app.get("/", (req, res) => {
    const db = readDB();
    res.render("todos", { todos: db.todos });
}); //todos.ejs 'ye todos listesini gönderiyor

app.get("/todos", (req, res) => {
    res.json(readDB().todos);
}); //json olarak tüm taskları döndürüyor

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`)); //sunucuyu çalıştır
