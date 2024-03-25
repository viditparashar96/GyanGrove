"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSchema = void 0;
const mongoose_1 = require("mongoose");
exports.EventSchema = new mongoose_1.Schema({
    event_name: { type: String, required: true },
    city_name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
});
const Event = (0, mongoose_1.model)("Event", exports.EventSchema);
exports.default = Event;
