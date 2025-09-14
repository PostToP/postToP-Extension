import {chromeReceiveMessageFactory, chromeSendMessageFactory} from "../common/Chrome";

export const chromeSendMessage = chromeSendMessageFactory("SETTINGS");
export const chromeReceiveMessage = chromeReceiveMessageFactory("SETTINGS");
