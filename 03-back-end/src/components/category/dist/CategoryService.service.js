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
exports.DefaultCategoryAdapterOptions = void 0;
var CategoryModel_model_1 = require("./CategoryModel.model");
var NewsService_service_1 = require("../news/NewsService.service");
var BaseService_1 = require("../../common/BaseService");
var DefaultCategoryAdapterOptions = {
    loadNews: false,
    loadProducts: false
};
exports.DefaultCategoryAdapterOptions = DefaultCategoryAdapterOptions;
var CategoryService = /** @class */ (function (_super) {
    __extends(CategoryService, _super);
    function CategoryService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CategoryService.prototype.tableName = function () {
        return "category";
    };
    CategoryService.prototype.adaptToModel = function (data, options) {
        if (options === void 0) { options = DefaultCategoryAdapterOptions; }
        return __awaiter(this, void 0, Promise, function () {
            var category, newsService, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        category = new CategoryModel_model_1["default"]();
                        category.categoryId = +(data === null || data === void 0 ? void 0 : data.category_id);
                        category.name = data === null || data === void 0 ? void 0 : data.name;
                        category.categoryType = data === null || data === void 0 ? void 0 : data.category_type;
                        category.isDeleted = Boolean(data === null || data === void 0 ? void 0 : data.is_deleted);
                        category.parentCategoryId = +(data === null || data === void 0 ? void 0 : data.category__id);
                        if (!options.loadNews) return [3 /*break*/, 2];
                        newsService = new NewsService_service_1["default"](this.db);
                        // const categoryService: CategoryService = new CategoryService(this.db);
                        //category.parentCategoryes = await categoryService.getAllByFieldNameAndValue('category_id', category.parentCategoryId, options);
                        _a = category;
                        return [4 /*yield*/, newsService.getAllByCategoryId(category.categoryId, options)];
                    case 1:
                        // const categoryService: CategoryService = new CategoryService(this.db);
                        //category.parentCategoryes = await categoryService.getAllByFieldNameAndValue('category_id', category.parentCategoryId, options);
                        _a.news = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, category];
                }
            });
        });
    };
    CategoryService.prototype.add = function (data, options) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.baseAdd(data, options)];
            });
        });
    };
    CategoryService.prototype.editById = function (categoryId, data, options) {
        if (options === void 0) { options = DefaultCategoryAdapterOptions; }
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.baseEditById(categoryId, data, options)];
            });
        });
    };
    return CategoryService;
}(BaseService_1["default"]));
exports["default"] = CategoryService;
