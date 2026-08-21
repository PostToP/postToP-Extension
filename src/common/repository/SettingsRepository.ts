import {browser} from "../browser";

interface Settings {
  serverAddress: string;
  yt: boolean;
  ytmusic: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  serverAddress: "posttopserver.devla.dev",
  yt: true,
  ytmusic: true,
};

export class SettingsRepository {
  static async getSettings(): Promise<Settings> {
    const {settings} = (await browser.storage.local.get(["settings"])) as {settings?: Partial<Settings>};
    const merged = {...DEFAULT_SETTINGS, ...settings};

    if (!settings) await browser.storage.local.set({settings: merged});

    return merged;
  }

  static saveSettings(settings: Settings): Promise<void> {
    return browser.storage.local.set({settings});
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
    browser.storage.onChanged.addListener((changes, namespace) => {
      if (namespace !== "local") return;
      if (changes.settings) {
        const oldSettings: Partial<Settings> = changes.settings.oldValue || {};
        const newSettings: Partial<Settings> = changes.settings.newValue || {};
        if (oldSettings[key] !== newSettings[key]) {
          callback(newSettings[key] as Settings[K], oldSettings[key] as Settings[K]);
        }
      }
    });
  }

  static async observeSetting<K extends keyof Settings>(key: K): Promise<Settings[K]> {
    return new Promise((resolve, reject) => {
      SettingsRepository.getSetting(key)
        .then(value => {
          resolve(value);
        })
        .catch(err => {
          reject(err);
        });

      SettingsRepository.listenToSettingChanges(key, (newValue, oldValue) => {
        resolve(newValue);
      });
    });
  }
}
