import {SettingsRepository} from "../../common/repository/SettingsRepository";
import {changeServerAddress, restartWebsocket} from "./WebSocket";

SettingsRepository.getSetting("serverAddress").then(value => {
  changeServerAddress(value);
  restartWebsocket();
});
