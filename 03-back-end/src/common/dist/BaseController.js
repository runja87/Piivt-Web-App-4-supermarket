"use strict";
exports.__esModule = true;
var BaseController = /** @class */ (function () {
    function BaseController(services) {
        this.servicesInstances = services;
    }
    Object.defineProperty(BaseController.prototype, "services", {
        get: function () {
            return this.servicesInstances;
        },
        enumerable: false,
        configurable: true
    });
    return BaseController;
}());
exports["default"] = BaseController;
