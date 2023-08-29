"use strict";
exports.__esModule = true;
var CategoryType;
(function (CategoryType) {
    CategoryType["RootCategories"] = "root";
    CategoryType["Products"] = "products";
    CategoryType["News"] = "news";
})(CategoryType || (CategoryType = {}));
var CategoryModel = /** @class */ (function () {
    function CategoryModel() {
        this.parentCategoryes = [];
        //product?: ProductMOdel[];
    }
    return CategoryModel;
}());
exports["default"] = CategoryModel;
