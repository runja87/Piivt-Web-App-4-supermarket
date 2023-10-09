"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("./Application.sass");
function Application() {
    return (react_1["default"].createElement("div", { className: "App" },
        react_1["default"].createElement("header", { className: "App-header" },
            react_1["default"].createElement("p", null,
                "Edit ",
                react_1["default"].createElement("code", null, "src/Application.tsx"),
                " and save to reload."),
            react_1["default"].createElement("a", { className: "App-link", href: "https://reactjs.org", target: "_blank", rel: "noopener noreferrer" }, "Learn React"))));
}
exports["default"] = Application;
