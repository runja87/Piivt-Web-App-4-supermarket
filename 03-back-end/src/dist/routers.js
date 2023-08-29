"use strict";
exports.__esModule = true;
var AdministratorRouter_router_1 = require("./components/administrator/AdministratorRouter.router");
var CategoryRouter_router_1 = require("./components/category/CategoryRouter.router");
var AplicationRouters = [
    new CategoryRouter_router_1["default"](),
    new AdministratorRouter_router_1["default"](),
];
exports["default"] = AplicationRouters;
