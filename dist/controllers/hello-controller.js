"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello_world = void 0;
const asycnHandler_1 = require("../utils/asycnHandler");
exports.hello_world = (0, asycnHandler_1.asyncHandler)((req, res) => {
    res.send("Hello World!!!!");
});
