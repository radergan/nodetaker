const express = require('express');
const path = require('path');
const fs = require('fs');
const { json } = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

app.get("/api/notes", function (req, res) {
    fs.readFile('./db/db.json', 'utf8', function (error, data) {
        if(error) throw error;
        let json = JSON.parse(data);
        res.json(json);
    })
});

app.post("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", function (error, data) {
        if(error) throw error;
        let json = JSON.parse(data)
        let newId = 1;
        if(json.length > 0){
           newId = (parseInt(json[json.length - 1].id + 1));
        }
        json.push({id: newId, title: req.body.title, text: req.body.text});
        fs.writeFile("./db/db.json", JSON.stringify(json), function(error){
            if (error) throw error;
            console.log(`New note added successfully with ID = ${newId}.`);
        })
    });
    res.json(req.body);
});

app.delete("/api/notes/:id", function (req, res) {
    let note_id = req.params.id;
    fs.readFile('./db/db.json', 'utf8', function (error, data) {
        if(error) throw error;
        let json = JSON.parse(data);
        let minus_deleted_one = json.filter(function(item) { 
            return item.id != note_id;  
        });
        console.log(minus_deleted_one);
        fs.writeFile("./db/db.json", JSON.stringify(minus_deleted_one), function(error){
            if (error) throw error;
            console.log(`Note with ID = ${note_id} was removed.`);
        })
    })
    res.json(req.body);
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
