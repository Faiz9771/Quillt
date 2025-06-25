const express = require('express'); // Import Express
const {getUser} = require("../controllers/general.js"); // Import the controller for handling user retrieval

const router = express.Router(); // Create a new router instance


router.get("/user/:id", getUser);

// Export the router for use in your main server file
module.exports = router;
