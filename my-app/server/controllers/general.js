const User = require("../models/userModel.js");

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(404).json({ message: error.message }); 
    }
};


module.exports = { getUser }; 