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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.DefaultAdministratorOptions = exports.IAdministratorAdapterOptions = void 0;
var BaseService_1 = require("../../common/BaseService");
var AdministratorModel_model_1 = require("./AdministratorModel.model");
var IAdministratorAdapterOptions = /** @class */ (function () {
    function IAdministratorAdapterOptions() {
    }
    return IAdministratorAdapterOptions;
}());
exports.IAdministratorAdapterOptions = IAdministratorAdapterOptions;
exports.DefaultAdministratorOptions = {
    removePassword: false
};
var AdministratorService = /** @class */ (function (_super) {
    __extends(AdministratorService, _super);
    function AdministratorService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdministratorService.prototype.tableName = function () {
        return "administrator";
    };
    AdministratorService.prototype.adaptToModel = function (data, options) {
        if (options === void 0) { options = exports.DefaultAdministratorOptions; }
        return __awaiter(this, void 0, Promise, function () {
            var administrator;
            return __generator(this, function (_a) {
                administrator = new AdministratorModel_model_1.AdministratorModel();
                administrator.administratorId = +(data === null || data === void 0 ? void 0 : data.administrator_id);
                administrator.username = data === null || data === void 0 ? void 0 : data.username;
                administrator.email = data === null || data === void 0 ? void 0 : data.email;
                administrator.passwordHash = data === null || data === void 0 ? void 0 : data.password_hash;
                administrator.passwordResetLink = data === null || data === void 0 ? void 0 : data.password_reset_link;
                administrator.createdAt = data === null || data === void 0 ? void 0 : data.created_at;
                administrator.isActive = Boolean(data === null || data === void 0 ? void 0 : data.is_active);
                if (options.removePassword) {
                    administrator.passwordHash = null;
                }
                return [2 /*return*/, administrator];
            });
        });
    };
    AdministratorService.prototype.add = function (data, options) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.baseAdd(data, options)];
            });
        });
    };
    AdministratorService.prototype.edit = function (id, data, options) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.baseEditById(id, data, options)];
            });
        });
    };
    return AdministratorService;
}(BaseService_1["default"]));
exports["default"] = AdministratorService;
