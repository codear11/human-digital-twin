// Import Express
const express = require("express");

// Import Path
const path = require("path");

// Import File System
const fs = require("fs");

// Create Express application
const app = express();

// Server port
const PORT = 3000;


// Allow server to receive JSON
app.use(express.json());


// Serve frontend files
app.use(express.static(
    path.join(__dirname, "../frontend")
));


// ====================================================
// SAVE USER DATA
// ====================================================

app.post("/api/user", (req, res) => {

    // Location of data.json
    const filePath =
        path.join(__dirname, "data.json");


    // Read existing data
    const fileData =
        fs.readFileSync(filePath, "utf8");


    // Convert JSON into JavaScript object
    let users = JSON.parse(fileData);


    // Get data sent by frontend
    const newData = req.body;


    // Get person's name
    const userName = newData.name;


    // Check if name is available
    if (!userName) {

        return res.status(400).json({

            message: "Please enter your name first."

        });

    }


    // Create user if this person
    // does not already exist
    if (!users[userName]) {

        users[userName] = {};

    }


    // Add new information to
    // this person's existing data
    users[userName] = {

        ...users[userName],

        ...newData

    };


    // Convert data into JSON
    const updatedData =
        JSON.stringify(
            users,
            null,
            2
        );


    // Save data
    fs.writeFileSync(
        filePath,
        updatedData
    );


    // Send response
    res.json({

        message:
            `${userName}'s details saved successfully.`

    });

});


// ====================================================
// START SERVER
// ====================================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});