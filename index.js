const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./src/config/serverConfig');
const apiRoutes = require('./src/routes/index');

const setupAndStartServer = () => {

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));

    app.use('/api',apiRoutes);

    app.listen(PORT , () => {

        console.log(`Server Started at Port ${PORT}`);
    })

}

setupAndStartServer();