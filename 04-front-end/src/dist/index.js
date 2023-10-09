"use strict";
exports.__esModule = true;
var react_1 = require("react");
var client_1 = require("react-dom/client");
require("./index.sass");
var Application_1 = require("./components/Application/Application");
var reportWebVitals_1 = require("./common/reportWebVitals");
var root = client_1["default"].createRoot(document.getElementById('root'));
root.render(react_1["default"].createElement(react_1["default"].StrictMode, null,
    react_1["default"].createElement(Application_1["default"], null)));
reportWebVitals_1["default"](console.log);
