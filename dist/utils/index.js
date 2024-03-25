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
exports.getDistance = void 0;
const axios_1 = __importDefault(require("axios"));
const ApiError_1 = require("./ApiError");
const getDistance = (events, userLatitude, userLongitude) => __awaiter(void 0, void 0, void 0, function* () {
    const eventsWithDistance = yield Promise.all(events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const eventLatitude = event.latitude;
            const eventLongitude = event.longitude;
            const eventDate = convertToDateStartOfMonth(event.date.toLocaleString());
            const response = yield axios_1.default.get(`https://gg-backend-assignment.azurewebsites.net/api/Distance?code=IAKvV2EvJa6Z6dEIUqqd7yGAu7IZ8gaH-a0QO6btjRc1AzFu8Y3IcQ==&latitude1=${userLatitude}&longitude1=${userLongitude}&latitude2=${eventLatitude}&longitude2=${eventLongitude}`);
            const { distance } = response.data;
            const response2 = yield axios_1.default.get(`https://gg-backend-assignment.azurewebsites.net/api/Weather?code=KfQnTWHJbg1giyB_Q9Ih3Xu3L9QOBDTuU5zwqVikZepCAzFut3rqsg==&city=${event.city_name}&date=${eventDate}`);
            const { weather } = response2.data;
            return {
                event_name: event.event_name,
                city_name: event.city_name,
                date: event.date,
                weather: weather,
                distance_km: distance,
            };
        }
        catch (error) {
            throw new ApiError_1.ApiError(500, "Error fetching distance or weather");
        }
    })));
    return eventsWithDistance;
});
exports.getDistance = getDistance;
function convertToDateStartOfMonth(dateString) {
    const parts = dateString.split(",");
    const moreparts = parts[0].split("/");
    let month = moreparts[0];
    let day = moreparts[1];
    let year = moreparts[2];
    if (parseInt(month) < 10)
        month = "0" + month;
    return `${year}-${month}-${day}`;
}
