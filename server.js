const express = require('express');
const fs = require('fs');
// const readFromFile = require('./utils/readfromfile.js')
const app = express();
const path = require('path');
const notes = require("./db/notes.json");
const uuid = require('./helpers/uuid');


const PORT = process.env.PORT || 3000;

app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, `public/index.html`))
});

app.get("/notes", (req,res)=>{
    res.sendFile(path.join(__dirname, `public/notes.html`))
});

//api route to get all notes
app.get("/api/notes", (req,res)=>{
    res.json(JSON.parse(fs.readFileSync('./db/notes.json', 'utf8')))
});

//api route for adding (POST) a new note (works adding post requests thru Insomnia)
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received to add a new note
    console.info(`${req.method} request received to add a review`);
  
    // Destructuring assignment for the items in req.body
    const {title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        review_id: uuid(),
      };
  
      // Obtain existing reviews
      fs.readFile('./db/notes.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new review
          parsedNotes.push(newNote);
  
          // Write updated reviews back to the file
          fs.writeFile(
            './db/notes.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
});