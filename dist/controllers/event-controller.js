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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = exports.createEvent = void 0;
const console_1 = __importDefault(require("console"));
const event_model_1 = __importDefault(require("../models/event-model"));
const utils_1 = require("../utils");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asycnHandler_1 = require("../utils/asycnHandler");
exports.createEvent = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { event_name, city_name, date, time, latitude, longitude } = req.body;
    console_1.default.log(req.body);
    //   Checking if all fields are provided
    if ([event_name, city_name, date, time, latitude, longitude].some((field) => field.trim() === "")) {
        throw new ApiError_1.ApiError(400, "All fields are required");
    }
    //   Checking if the event and the date already exists
    const eventExists = yield event_model_1.default.findOne({
        $and: [
            { event_name: new RegExp(`^${event_name}$`, "i") },
            { date },
            { city_name: new RegExp(`^${city_name}$`, "i") },
        ],
    });
    if (eventExists)
        throw new ApiError_1.ApiError(400, "Event already exists at same date");
    //   Creating a new event
    const event = new event_model_1.default({
        event_name,
        city_name,
        date,
        time,
        latitude,
        longitude,
    });
    yield event.save();
    res.status(201).json(new ApiResponse_1.ApiResponse(201, "Event created", event));
}));
exports.getEvents = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { latitude, longitude, date, page = 1 } = req.query;
    const pageSize = 10;
    if (!latitude || !longitude || !date) {
        throw new ApiError_1.ApiError(400, "Latitude, Longitude and Date are required");
    }
    const dateParts = date.split("/");
    const queryDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[0]) - 1, parseInt(dateParts[1]));
    const endDate = new Date(queryDate);
    endDate.setDate(endDate.getDate() + 14);
    const query = {
        date: { $gte: queryDate, $lte: endDate },
    };
    const totalEvents = yield event_model_1.default.countDocuments(date && longitude && latitude ? query : {});
    const events = yield event_model_1.default.find(date && longitude && latitude ? query : {})
        .sort({ date: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);
    const totalPages = Math.ceil(totalEvents / pageSize);
    // Call the function to fetch distances
    const eventsWithDistanceAndWeather = yield (0, utils_1.getDistance)(events, latitude, longitude);
    const data = {
        events: eventsWithDistanceAndWeather,
        page,
        pageSize,
        totalEvents,
        totalPages,
    };
    res.status(200).json(new ApiResponse_1.ApiResponse(200, "Events found", data));
}));
