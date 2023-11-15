// Import packages
const express = require("express");
const home = require("./routes/home");
const cors =  require('cors');
const chapa = require('./routes/chapa')
const bodyParser = require('body-parser');
// Middlewares
const app = express();
app.use(express.json());
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const options = [
    cors({
      origin: '*',
      methods: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  ];
  
app.use(options)
app.use("/", home);
app.use("/chapa", chapa);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
