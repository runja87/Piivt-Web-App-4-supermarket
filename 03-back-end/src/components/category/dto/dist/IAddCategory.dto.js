"use strict";
exports.__esModule = true;
exports.AddCategoryValidator = void 0;
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
var CategoryType;
(function (CategoryType) {
    CategoryType["RootCategories"] = "root";
    CategoryType["Products"] = "products";
    CategoryType["News"] = "news";
})(CategoryType || (CategoryType = {}));
var AddCategoryValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 4,
            maxLength: 32
        },
        categoryType: {
            type: "string",
            "enum": ["product", "news", "root"]
        },
        parentCategoryId: {
            type: "number",
            minimum: 1
        }
    },
    required: [
        "name",
        "category_type",
        "parentCategoryId"
    ],
    additionalProperties: false
});
exports.AddCategoryValidator = AddCategoryValidator;
