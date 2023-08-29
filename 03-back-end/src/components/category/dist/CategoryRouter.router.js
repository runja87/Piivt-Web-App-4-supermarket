"use strict";
exports.__esModule = true;
var CategoryController_controller_1 = require("./CategoryController.controller");
var CategoryRouter = /** @class */ (function () {
    function CategoryRouter() {
    }
    CategoryRouter.prototype.setupRoutes = function (application, resources) {
        var categoryController = new CategoryController_controller_1["default"](resources.services);
        application.get("/api/category", categoryController.getAll.bind(categoryController));
        application.get("/api/category/:id", categoryController.getById.bind(categoryController));
        application.post("/api/category", categoryController.add.bind(categoryController));
        application.put("/api/category/:cid", categoryController.edit.bind(categoryController));
        application.post("/api/category/:cid/news", categoryController.addNews.bind(categoryController));
        application.put("/api/category/:cid/news/:iid", categoryController.editNews.bind(categoryController));
        application["delete"]("/api/category/:cid/news/:iid", categoryController.deleteNews.bind(categoryController));
    };
    return CategoryRouter;
}());
exports["default"] = CategoryRouter;
