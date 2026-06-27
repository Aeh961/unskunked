import { Status } from "@/src/data/types";

export function getStatusLabel(status: Status) {
  if (status === "open") return "Open";
  if (status === "closed") return "Closed";
  return "Restricted";
}

export function isFishable(status: Status) {
  return status === "open" || status === "restricted";
}

export function getStatusTone(status: Status) {
  if (status === "open") return "good";
  if (status === "closed") return "bad";
  return "caution";
}
