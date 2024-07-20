const mongoose = require('mongoose');

async function connect(MONGO_URL){
    try{
        await mongoose.connect(MONGO_URL ,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("connect successfully");
    } catch(error){
        console.log("connect failure!");
    }

}

module.exports = connect