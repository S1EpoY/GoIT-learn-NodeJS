const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const apiContactsRoutes = require('./contacts/contact.router');
const userRoutes = require('./users/user.router');
const userAuthRoutes = require('./users/user.auth.router');

const app = express();

dotenv.config();

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(logger('combined'));
app.use(cors());

app.use('/api/contacts', apiContactsRoutes);
app.use('/auth', userAuthRoutes);
app.use('/users', userRoutes);    

const PORT = process.env.PORT;

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { 
            useUnifiedTopology: true, 
            useNewUrlParser: true,
            useCreateIndex: true, 
            useFindAndModify: false 
        });
        
        console.log('Connected to MongoDB!');

        app.listen(PORT, (err) => {
            if (err) throw err;
            console.log(`Server is runing on port ${PORT}`)
        });
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    
}

startServer();