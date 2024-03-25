import { Document, Schema, model } from "mongoose";

export interface IEventModel extends Document {
  event_name: string;
  city_name: string;
  date: Date;
  time: string;
  latitude: number;
  longitude: number;
}

export const EventSchema = new Schema<IEventModel>({
  event_name: { type: String, required: true },
  city_name: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const Event = model<IEventModel>("Event", EventSchema);
export default Event;
