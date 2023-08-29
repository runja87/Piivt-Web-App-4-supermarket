"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var BaseController_1 = require("../../common/BaseController");
var bcrypt = require("bcrypt");
var IAddAdministrator_dto_1 = require("./dto/IAddAdministrator.dto");
var AdministratorController = /** @class */ (function (_super) {
    __extends(AdministratorController, _super);
    function AdministratorController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdministratorController.prototype.getAll = function (req, res) {
        this.services.administrator.getAll({ removePassword: true })
            .then(function (result) {
            res.send(result);
        })["catch"](function (error) {
            res.status(500).send(error === null || error === void 0 ? void 0 : error.message);
        });
    };
    AdministratorController.prototype.getById = function (req, res) {
        var _a;
        var id = +((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
        this.services.administrator.getById(id, { removePassword: true })
            .then(function (result) {
            if (result === null) {
                return res.status(404).send('Administrator not found!');
            }
            res.send(result);
        })["catch"](function (error) {
            res.status(500).send(error === null || error === void 0 ? void 0 : error.message);
        });
    };
    AdministratorController.prototype.add = function (req, res) {
        var body = req.body;
        if (!IAddAdministrator_dto_1.AddAdministratorValidator(body)) {
            return res.status(400).send(IAddAdministrator_dto_1.AddAdministratorValidator.errors);
        }
        var passwordHash = bcrypt.hashSync(body.password_hash, 10);
        this.services.administrator.add({ username: body.username, email: body.email, password_hash: passwordHash }, { removePassword: false })
            .then(function (result) {
            res.send(result);
        })["catch"](function (error) {
            res.status(500).send(error === null || error === void 0 ? void 0 : error.message);
        });
    };
    return AdministratorController;
}(BaseController_1["default"]));
exports["default"] = AdministratorController;
