import console from "console";
import { Request, Response } from "express";
import Event from "../models/event-model";
import { getDistance } from "../utils";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asycnHandler";

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const { event_name, city_name, date, time, latitude, longitude } = req.body;
  console.log(req.body);
  //   Checking if all fields are provided
  if (
    [event_name, city_name, date, time, latitude, longitude].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //   Checking if the event and the date already exists
  const eventExists = await Event.findOne({
    $and: [
      { event_name: new RegExp(`^${event_name}$`, "i") },
      { date },
      { city_name: new RegExp(`^${city_name}$`, "i") },
    ],
  });
  if (eventExists) throw new ApiError(400, "Event already exists at same date");

  //   Creating a new event
  const event = new Event({
    event_name,
    city_name,
    date,
    time,
    latitude,
    longitude,
  });

  await event.save();
  res.status(201).json(new ApiResponse(201, "Event created", event));
});

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const { latitude, longitude, date, page = 1 }: any = req.query;
  const pageSize = 10;

  if (!latitude || !longitude || !date) {
    throw new ApiError(400, "Latitude, Longitude and Date are required");
  }

  const dateParts = date.split("/");
  const queryDate = new Date(
    parseInt(dateParts[2]),
    parseInt(dateParts[0]) - 1,
    parseInt(dateParts[1])
  );

  const endDate = new Date(queryDate);
  endDate.setDate(endDate.getDate() + 14);

  const query = {
    date: { $gte: queryDate, $lte: endDate },
  };

  const totalEvents = await Event.countDocuments(
    date && longitude && latitude ? query : {}
  );

  const events = await Event.find(date && longitude && latitude ? query : {})
    .sort({ date: 1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  const totalPages = Math.ceil(totalEvents / pageSize);

  // Call the function to fetch distances
  const eventsWithDistanceAndWeather = await getDistance(
    events,
    latitude,
    longitude
  );

  const data = {
    events: eventsWithDistanceAndWeather,
    page,
    pageSize,
    totalEvents,
    totalPages,
  };

  res.status(200).json(new ApiResponse(200, "Events found", data));
});
