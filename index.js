const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const apiContactsRoutes = require('./api/routs/contacts');

const argv = require('yargs').argv;
const { invokeAction } = require('./contacts');

const app = express();

dotenv.config();

app.use(express.json());
app.use(logger('combined'));
app.use(cors());

app.use('/api', apiContactsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is runing on port ${PORT}`)
});


invokeAction(argv);