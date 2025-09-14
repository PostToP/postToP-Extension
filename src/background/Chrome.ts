import {chromeReceiveMessageFactory, chromeSendMessageFactory} from "../common/Chrome";

export const chromeSendMessage = chromeSendMessageFactory("BACKGROUND");
export const chromeReceiveMessage = chromeReceiveMessageFactory("BACKGROUND");
