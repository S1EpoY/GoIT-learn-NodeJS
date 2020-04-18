const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const apiContactsRoutes = require('./contacts/contact.routs');

dotenv.config();

const app = express();

dotenv.config();

app.use(express.json());
app.use(logger('combined'));
app.use(cors());

app.use('/api/contacts', apiContactsRoutes);

const PORT = process.env.PORT || 3000;
const MONGODB_URL = "mongodb+srv://admin:QHEmWVrvOkCkXMh5@cluster0-ok9sn.mongodb.net/db-contacts" || process.env.MONGODB_URL

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URL, { 
            useUnifiedTopology: true, 
            useNewUrlParser: true, 
            useFindAndModify: false 
        });
        
        console.log('Connected to MongoDB!');

        app.listen(PORT, (err) => {
            if (err) throw err;
            console.log(`Server is runing on port ${PORT}`)
        });
    } catch (err) {
        console.log(err)
    }
    
}

startServer();
