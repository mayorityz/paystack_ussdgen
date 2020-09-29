const Router = require("express").Router();
const appController = require("../controller/app.controller");

Router.post("/paywithussd", appController.generateUssd);
Router.post("/webservicehook", appController.webservice);

module.exports = Router;
