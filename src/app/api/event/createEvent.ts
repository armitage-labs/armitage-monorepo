import { Event } from "@prisma/client";
import prisma from "db";

export enum EventName {
  REQUEST_CALCULATION,
}

export async function createEvent(
  userId: string,
  eventName: EventName,
  eventData: any,
): Promise<Event> {
  return prisma.event.create({
    data: {
      user_id: userId,
      event_name: EventName[eventName],
      event_data: eventData,
    },
  });
}
