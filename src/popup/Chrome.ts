import { chromeReceiveMessageFactory, chromeSendMessageFactory } from "../common/Chrome";

export const chromeSendMessage = chromeSendMessageFactory("POPUP");
export const chromeReceiveMessage = chromeReceiveMessageFactory("POPUP");