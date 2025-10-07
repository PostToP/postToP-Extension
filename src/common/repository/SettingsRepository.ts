interface Settings {
  serverAddress: string;
  yt: boolean;
  ytmusic: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  serverAddress: "localhost:8000",
  yt: false,
  ytmusic: false,
};

export class SettingsRepository {
  static getSettings(): Promise<Settings> {
    return new Promise(resolve => {
      chrome.storage.local.get(["settings"], result => {
        const stored = result.settings || {};
        const merged = {...DEFAULT_SETTINGS, ...stored};
        resolve(merged);

        if (!result.settings) {
          chrome.storage.local.set({settings: merged});
        }
      });
    });
  }

  static saveSettings(settings: Settings): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.set({settings}, () => {
        resolve();
      });
    });
  }

  static async getSetting<K extends keyof Settings>(key: K): Promise<Settings[K]> {
    const settings = await SettingsRepository.getSettings();
    return settings[key];
  }

  static async setSetting<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> {
    const settings = await SettingsRepository.getSettings();
    settings[key] = value;
    return SettingsRepository.saveSettings(settings);
  }

  static async listenToSettingChanges<K extends keyof Settings>(
    key: K,
    callback: (newValue: Settings[K], oldValue: Settings[K]) => void,
  ): Promise<void> {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace !== "local") return;
      if (changes.settings) {
        const oldSettings = changes.settings.oldValue || {};
        const newSettings = changes.settings.newValue || {};
        if (oldSettings[key] !== newSettings[key]) {
          callback(newSettings[key], oldSettings[key]);
        }
      }
    });
  }
}
