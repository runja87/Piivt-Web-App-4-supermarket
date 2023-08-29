"use strict";
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
var BaseService = /** @class */ (function () {
    function BaseService(databaseConnection) {
        this.database = databaseConnection;
    }
    Object.defineProperty(BaseService.prototype, "db", {
        get: function () {
            return this.database;
        },
        enumerable: false,
        configurable: true
    });
    BaseService.prototype.getAll = function (options) {
        var _this = this;
        var tableName = this.tableName();
        return new Promise(function (resolve, reject) {
            var sql = "SELECT * FROM `" + tableName + "`;";
            console.log(sql);
            _this.db.execute(sql)
                .then(function (_a) {
                var rows = _a[0];
                return __awaiter(_this, void 0, void 0, function () {
                    var items, _i, _b, row, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                if (rows === undefined) {
                                    return [2 /*return*/, resolve([])];
                                }
                                items = [];
                                _i = 0, _b = rows;
                                _e.label = 1;
                            case 1:
                                if (!(_i < _b.length)) return [3 /*break*/, 4];
                                row = _b[_i];
                                if (!(!('is_deleted' in row) || !row.is_deleted)) return [3 /*break*/, 3];
                                _d = (_c = items).push;
                                return [4 /*yield*/, this.adaptToModel(row, options)];
                            case 2:
                                _d.apply(_c, [_e.sent()]);
                                _e.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4:
                                resolve(items);
                                return [2 /*return*/];
                        }
                    });
                });
            })["catch"](function (error) {
                reject(error);
            });
        });
    };
    BaseService.prototype.getById = function (id, options) {
        var _this = this;
        var tableName = this.tableName();
        return new Promise(function (resolve, reject) {
            var sql = "SELECT * FROM `" + tableName + "` WHERE " + tableName + "_id = ?;";
            _this.db.execute(sql, [id])
                .then(function (_a) {
                var rows = _a[0];
                return __awaiter(_this, void 0, void 0, function () {
                    var row, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!Array.isArray(rows) || rows.length === 0) {
                                    return [2 /*return*/, resolve(null)];
                                }
                                row = rows[0];
                                if ('is_deleted' in row) {
                                    if (1 === +row.is_deleted) {
                                        return [2 /*return*/, resolve(null)];
                                    }
                                }
                                _b = resolve;
                                return [4 /*yield*/, this.adaptToModel(row, options)];
                            case 1:
                                _b.apply(void 0, [_c.sent()]);
                                return [2 /*return*/];
                        }
                    });
                });
            })["catch"](function (error) {
                reject(error);
            });
        });
    };
    BaseService.prototype.getAllByFieldNameAndValue = function (fieldName, value, options) {
        return __awaiter(this, void 0, Promise, function () {
            var tableName;
            var _this = this;
            return __generator(this, function (_a) {
                tableName = this.tableName();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var sql = "SELECT * FROM `" + tableName + "` WHERE " + fieldName + " = ?;";
                        _this.db.execute(sql, [value])
                            .then(function (_a) {
                            var rows = _a[0];
                            return __awaiter(_this, void 0, void 0, function () {
                                var items, _i, _b, row, _c, _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            if (!Array.isArray(rows) || rows.length === 0) {
                                                return [2 /*return*/, resolve([])];
                                            }
                                            items = [];
                                            _i = 0, _b = rows;
                                            _e.label = 1;
                                        case 1:
                                            if (!(_i < _b.length)) return [3 /*break*/, 4];
                                            row = _b[_i];
                                            if (!(!('is_deleted' in row) || !row.is_deleted)) return [3 /*break*/, 3];
                                            _d = (_c = items).push;
                                            return [4 /*yield*/, this.adaptToModel(row, options)];
                                        case 2:
                                            _d.apply(_c, [_e.sent()]);
                                            _e.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4:
                                            resolve(items);
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        })["catch"](function (error) {
                            reject(error);
                        });
                    })];
            });
        });
    };
    BaseService.prototype.baseAdd = function (data, options) {
        return __awaiter(this, void 0, Promise, function () {
            var tableName;
            var _this = this;
            return __generator(this, function (_a) {
                tableName = this.tableName();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var properties = Object.getOwnPropertyNames(data);
                        var sqlPairs = properties.map(function (property) { return "`" + property + "` = ?"; }).join(", ");
                        var values = properties.map(function (property) { return data[property]; });
                        var sql = "INSERT `" + tableName + "` SET " + sqlPairs + ";";
                        _this.db.execute(sql, values)
                            .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                            var info, newItemId, newItem;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        info = result;
                                        newItemId = +((_a = info[0]) === null || _a === void 0 ? void 0 : _a.insertId);
                                        return [4 /*yield*/, this.getById(newItemId, options)];
                                    case 1:
                                        newItem = _b.sent();
                                        if (newItem === null) {
                                            return [2 /*return*/, reject({ message: 'Could not add a new item into the ' + tableName + 'table!' })];
                                        }
                                        resolve(newItem);
                                        return [2 /*return*/];
                                }
                            });
                        }); })["catch"](function (error) {
                            reject(error);
                        });
                    })];
            });
        });
    };
    BaseService.prototype.baseEditById = function (id, data, options) {
        return __awaiter(this, void 0, Promise, function () {
            var tableName;
            var _this = this;
            return __generator(this, function (_a) {
                tableName = this.tableName();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var properties = Object.getOwnPropertyNames(data);
                        var sqlPairs = properties.map(function (property) { return "`" + property + "` = ?"; }).join(", ");
                        var values = properties.map(function (property) { return data[property]; });
                        values.push(id);
                        var sql = "UPDATE `" + tableName + "` SET " + sqlPairs + " WHERE `" + tableName + "_id` = ?;";
                        _this.db.execute(sql, values)
                            .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                            var info, item;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        info = result;
                                        if (((_a = info[0]) === null || _a === void 0 ? void 0 : _a.affectedRows) === 0) {
                                            return [2 /*return*/, reject({ message: 'Could not change any items in the ' + tableName + 'table!' })];
                                        }
                                        return [4 /*yield*/, this.getById(id, options)];
                                    case 1:
                                        item = _b.sent();
                                        if (item === null) {
                                            return [2 /*return*/, reject({ message: 'Could not find this item in the ' + tableName + 'table!' })];
                                        }
                                        resolve(item);
                                        return [2 /*return*/];
                                }
                            });
                        }); })["catch"](function (error) {
                            reject(error);
                        });
                    })];
            });
        });
    };
    BaseService.prototype.baseDeleteById = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var tableName;
            var _this = this;
            return __generator(this, function (_a) {
                tableName = this.tableName();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.execute("DESCRIBE " + tableName + " is_deleted")
                            .then(function (_a) {
                            var rows = _a[0];
                            if (rows.length) {
                                return _this.db.execute("UPDATE " + tableName + " SET is_deleted = 1 WHERE " + tableName + "_id = ?", [id]);
                            }
                            else {
                                return _this.db.execute("DELETE FROM " + tableName + " WHERE " + tableName + "_id = ?", [id]);
                            }
                        })
                            .then(function (_a) {
                            var result = _a[0];
                            if (result.affectedRows === 1) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        })["catch"](function (error) {
                            reject(error);
                        });
                    })];
            });
        });
    };
    return BaseService;
}());
exports["default"] = BaseService;
