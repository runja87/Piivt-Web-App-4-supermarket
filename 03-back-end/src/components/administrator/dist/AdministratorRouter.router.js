"use strict";
exports.__esModule = true;
var AdministratorController_controller_1 = require("./AdministratorController.controller");
var AdministratorRouter = /** @class */ (function () {
    function AdministratorRouter() {
    }
    AdministratorRouter.prototype.setupRoutes = function (application, resources) {
        var administratorControler = new AdministratorController_controller_1["default"](resources.services);
        application.get("/api/administrator", administratorControler.getAll.bind(administratorControler));
        application.get("/api/administrator/:id", administratorControler.getById.bind(administratorControler));
        application.post("/api/administrator", administratorControler.add.bind(administratorControler));
    };
    return AdministratorRouter;
}());
exports["default"] = AdministratorRouter;
