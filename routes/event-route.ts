import express from "express";
import { createEvent, getEvents } from "../controllers/event-controller";
const router = express.Router();

router.route("/add").post(createEvent);
router.route("/find").get(getEvents);
module.exports = router;
