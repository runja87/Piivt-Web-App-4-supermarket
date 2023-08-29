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
var BaseService_1 = require("../../common/BaseService");
var NewsModel_model_1 = require("./NewsModel.model");
var NewsAdapterOptions = /** @class */ (function () {
    function NewsAdapterOptions() {
    }
    return NewsAdapterOptions;
}());
var NewsService = /** @class */ (function (_super) {
    __extends(NewsService, _super);
    function NewsService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewsService.prototype.tableName = function () {
        return "news";
    };
    NewsService.prototype.adaptToModel = function (data) {
        return __awaiter(this, void 0, Promise, function () {
            var news;
            return __generator(this, function (_a) {
                news = new NewsModel_model_1["default"]();
                news.newsId = +(data === null || data === void 0 ? void 0 : data.news_id);
                news.title = data === null || data === void 0 ? void 0 : data.title;
                news.content = data === null || data === void 0 ? void 0 : data.content;
                news.altText = data === null || data === void 0 ? void 0 : data.alt_text;
                news.isDeleted = Boolean(data === null || data === void 0 ? void 0 : data.is_deleted);
                news.createdAt = data === null || data === void 0 ? void 0 : data.created_at;
                news.modifiedAt = data === null || data === void 0 ? void 0 : data.modified_at;
                news.categoryId = +(data === null || data === void 0 ? void 0 : data.category_id);
                return [2 /*return*/, news];
            });
        });
    };
    NewsService.prototype.getAllByCategoryId = function (categoryId, options) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getAllByFieldNameAndValue('category_id', categoryId, options)];
            });
        });
    };
    NewsService.prototype.add = function (data) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.baseAdd(data, {})];
            });
        });
    };
    NewsService.prototype.editById = function (ingredientId, data) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.baseEditById(ingredientId, data, {})];
            });
        });
    };
    NewsService.prototype.deleteById = function (newsId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.baseDeleteById(newsId)];
            });
        });
    };
    return NewsService;
}(BaseService_1["default"]));
exports["default"] = NewsService;
