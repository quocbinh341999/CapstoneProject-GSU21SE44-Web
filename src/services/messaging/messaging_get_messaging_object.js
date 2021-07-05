import { getMessaging } from "firebase/messaging";

const messaging = getMessaging();
messaging.getToken({vapidKey: "BNN2j64Wo_Ma8G7ElOgRnFH-k9raFwK4jbdOyTJ6BkRPHrI6FXdALMMlKz93x1rSbptR7_ogIHI0yeKLRwnUxVU"});