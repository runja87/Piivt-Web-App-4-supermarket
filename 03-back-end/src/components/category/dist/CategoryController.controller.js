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
var CategoryService_service_1 = require("./CategoryService.service");
var IAddNews_dto_1 = require("../news/dto/IAddNews.dto");
var IAddCategory_dto_1 = require("../category/dto/IAddCategory.dto");
var IEditCategory_dto_1 = require("./dto/IEditCategory.dto");
var IEditNews_dto_1 = require("../news/dto/IEditNews.dto");
var BaseController_1 = require("../../common/BaseController");
var CategoryController = /** @class */ (function (_super) {
    __extends(CategoryController, _super);
    function CategoryController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CategoryController.prototype.getAll = function (req, res) {
        this.services.category.getAll(CategoryService_service_1.DefaultCategoryAdapterOptions)
            .then(function (result) {
            res.send(result);
        })["catch"](function (error) {
            res.status(500).send(error === null || error === void 0 ? void 0 : error.message);
        });
    };
    CategoryController.prototype.getById = function (req, res) {
        var _a;
        var id = +((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
        this.services.category.getById(id, { loadNews: true, loadProducts: false })
            .then(function (result) {
            if (result === null) {
                return res.sendStatus(404);
            }
            res.send(result);
        })["catch"](function (error) {
            res.status(500).send(error === null || error === void 0 ? void 0 : error.message);
        });
    };
    CategoryController.prototype.add = function (req, res) {
        var data = req.body;
        if (!IAddCategory_dto_1.AddCategoryValidator(data)) {
            return res.status(400).send(IAddCategory_dto_1.AddCategoryValidator.errors);
        }
        this.services.category.add({ name: data.name, category_type: data.category_type, category__id: data.category__id }, { loadNews: false, loadProducts: false })
            .then(function (result) {
            res.send(result);
        })["catch"](function (error) {
            res.status(400).send(error === null || error === void 0 ? void 0 : error.message);
        });
    };
    CategoryController.prototype.edit = function (req, res) {
        var _this = this;
        var _a;
        var id = +((_a = req.params) === null || _a === void 0 ? void 0 : _a.cid);
        var data = req.body;
        if (!IEditCategory_dto_1.EditCategoryValidator(data)) {
            return res.status(400).send(IEditCategory_dto_1.EditCategoryValidator.errors);
        }
        this.services.category.getById(id, { loadNews: false, loadProducts: false })
            .then(function (result) {
            if (result === null) {
                return res.sendStatus(404);
            }
            _this.services.category.editById(id, { name: data.name, category_type: data.category_type, category__id: data.category__id }, { loadNews: true, loadProducts: false })
                .then(function (result) {
                res.send(result);
            })["catch"](function (error) {
                res.status(400).send(error === null || error === void 0 ? void 0 : error.message);
            });
        })["catch"](function (error) {
            res.status(500).send(error === null || error === void 0 ? void 0 : error.message);
        });
    };
    CategoryController.prototype.addNews = function (req, res) {
        var _this = this;
        var _a;
        var categoryId = +((_a = req.params) === null || _a === void 0 ? void 0 : _a.cid);
        var data = req.body;
        if (!IAddNews_dto_1.AddNewsValidator(data)) {
            return res.status(400).send(IAddNews_dto_1.AddNewsValidator.errors);
        }
        this.services.category.getById(categoryId, { loadNews: false, loadProducts: false })
            .then(function (result) {
            if (result === null) {
                return res.sendStatus(404);
            }
            _this.services.news.add({ title: data.title, content: data.content, alt_text: data.alt_text, category_id: categoryId })
                .then(function (result) {
                res.send(result);
            })["catch"](function (error) {
                res.status(400).send(error === null || error === void 0 ? void 0 : error.message);
            });
        })["catch"](function (error) {
            res.status(500).send(error === null || error === void 0 ? void 0 : error.message);
        });
    };
    CategoryController.prototype.editNews = function (req, res) {
        var _this = this;
        var _a, _b;
        var categoryId = +((_a = req.params) === null || _a === void 0 ? void 0 : _a.cid);
        var newsId = +((_b = req.params) === null || _b === void 0 ? void 0 : _b.iid);
        var data = req.body;
        if (!IEditNews_dto_1.EditNewsValidator(data)) {
            return res.status(400).send(IEditNews_dto_1.EditNewsValidator.errors);
        }
        this.services.news.getById(categoryId, { loadNews: false, loadProducts: false })
            .then(function (result) {
            if (result === null) {
                return res.status(404).send('Category not found!');
            }
            _this.services.news.getById(newsId, {})
                .then(function (result) {
                if (result === null) {
                    return res.status(404).send('News not found!');
                }
                if (result.title === data.title) {
                    return res.status(400).send('There is already have a same title in this category!');
                }
                if (result.categoryId !== categoryId) {
                    return res.status(400).send('This news does not belong to this category!');
                }
                _this.services.news.editById(newsId, { title: data.title, content: data.content, alt_text: data.alt_text, category_id: categoryId })
                    .then(function (result) {
                    res.send(result);
                });
            });
        })["catch"](function (error) {
            res.status(500).send(error === null || error === void 0 ? void 0 : error.message);
        });
    };
    CategoryController.prototype.deleteNews = function (req, res) {
        var _this = this;
        var _a, _b;
        var categoryId = +((_a = req.params) === null || _a === void 0 ? void 0 : _a.cid);
        var newsId = +((_b = req.params) === null || _b === void 0 ? void 0 : _b.iid);
        this.services.news.getById(newsId, {})
            .then(function (result) {
            if (result === null) {
                return res.status(404).send('News not found!');
            }
            if (result.categoryId !== categoryId) {
                return res.status(400).send('This news does not belong to this category!');
            }
            _this.services.news.deleteById(newsId)
                .then(function (result) {
                res.send('This news has been deleted!  ');
            })["catch"](function (error) {
                res.status(500).send(error === null || error === void 0 ? void 0 : error.message);
            });
        })["catch"](function (error) {
            res.status(500).send(error === null || error === void 0 ? void 0 : error.message);
        })["catch"](function (error) {
            res.status(500).send(error === null || error === void 0 ? void 0 : error.message);
        });
    };
    return CategoryController;
}(BaseController_1["default"]));
exports["default"] = CategoryController;
