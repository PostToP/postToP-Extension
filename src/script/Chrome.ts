import {chromeReceiveMessageFactory, chromeSendMessageFactory} from "../common/Chrome";

export const chromeSendMessage = chromeSendMessageFactory("CONTENT_SCRIPT");
export const chromeReceiveMessage = chromeReceiveMessageFactory("CONTENT_SCRIPT");
