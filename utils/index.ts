import axios from "axios";
import { IEventModel } from "../models/event-model";
import { ApiError } from "./ApiError";

export const getDistance = async (
  events: IEventModel[],
  userLatitude: number,
  userLongitude: number
) => {
  const eventsWithDistance = await Promise.all(
    events.map(async (event: any) => {
      try {
        const eventLatitude = event.latitude;
        const eventLongitude = event.longitude;
        const eventDate = convertToDateStartOfMonth(
          event.date.toLocaleString()
        );
        const response = await axios.get(
          `https://gg-backend-assignment.azurewebsites.net/api/Distance?code=IAKvV2EvJa6Z6dEIUqqd7yGAu7IZ8gaH-a0QO6btjRc1AzFu8Y3IcQ==&latitude1=${userLatitude}&longitude1=${userLongitude}&latitude2=${eventLatitude}&longitude2=${eventLongitude}`
        );
        const { distance } = response.data;
        const response2 = await axios.get(
          `https://gg-backend-assignment.azurewebsites.net/api/Weather?code=KfQnTWHJbg1giyB_Q9Ih3Xu3L9QOBDTuU5zwqVikZepCAzFut3rqsg==&city=${event.city_name}&date=${eventDate}`
        );
        const { weather } = response2.data;
        return {
          event_name: event.event_name,
          city_name: event.city_name,
          date: event.date,
          weather: weather,
          distance_km: distance,
        };
      } catch (error) {
        throw new ApiError(500, "Error fetching distance or weather");
      }
    })
  );
  return eventsWithDistance;
};

function convertToDateStartOfMonth(dateString: string) {
  const parts = dateString.split(",");
  const moreparts = parts[0].split("/");
  let month = moreparts[0];
  let day = moreparts[1];
  let year = moreparts[2];
  if (parseInt(month) < 10) month = "0" + month;
  return `${year}-${month}-${day}`;
}
