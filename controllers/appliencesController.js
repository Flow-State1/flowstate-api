const Appliences = require('../models/Appliences');
const fs = require('fs')
let user_id = "";

const getAllAppliences = async (req, res) => {
    // Get the user Id from the file first
    function readUserFileAndProcess(callback) {
        if (fs.existsSync("./data/user.txt")) {
          fs.readFile("./data/user.txt", (err, data) => {
            if (err) {
              console.error("Error reading file:", err);
              callback(err);
              return;
            }
    
            user_id = data.toString().trim();
            console.log("User with id: ", user_id);
    
            callback(null); // Indicate success
          });
        } else {
          console.log("File not present, meaning no user, logged in");
        }
      }
      readUserFileAndProcess(async (err) => {
        if (err) {
          console.error("Error processing file:", err);
          return;
        }


    try {
        const appliences = await Appliences.find({
            user_id,
        });

        if (appliences.length === 0) {
            return res.status(404).json({
              status: 'fail',
              message: 'No appliances found',
            });
        }
      
        res.status(200).json({
            appliances: appliences,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
})
};

module.exports = { getAllAppliences };