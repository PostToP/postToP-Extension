import {SettingsRepository} from "../../common/repository/SettingsRepository";
import {changeServerAddress, restartWebsocket} from "./WebSocket";

SettingsRepository.getSetting("serverAddress").then(value => {
  if (value) {
    changeServerAddress(value);
    restartWebsocket();
  }
});
