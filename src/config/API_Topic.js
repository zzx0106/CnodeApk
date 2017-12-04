import { get, post } from "../utils/HttpUtils";
import { moment } from "../utils/tool";

export function createTopic(params) {
  return post("/topics", params);
}

export function updateTopic(params) {
  return post("/topics/update", params);
}
