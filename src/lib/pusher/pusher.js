import Echo from "laravel-echo";
import Pusher from "pusher-js";

import { CONFIG } from "src/global-config";


window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: CONFIG.pusher.key,
  cluster: CONFIG.pusher.cluster,
  forceTLS: true,
  encrypted: true,
});

export const echoInstance = echo;
