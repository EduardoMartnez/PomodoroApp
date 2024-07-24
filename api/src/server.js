
const express = require('express');

const app = express();
const PORT = process.env.PORT;
console.log("Port: " + PORT);

app.use(express.json());

app.get('/', (req,  res) => {
  res.json({your_api: 'it works'});
});


const routes = require('./routes.js');
app.use(routes);
//const frontendRoutes = require('./fileRoutes');
//app.use(frontendRoutes);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
