export class AuthRepository {
  static getAuthToken(): Promise<string | null> {
    return new Promise(resolve => {
      chrome.storage.local.get("authToken", result => {
        resolve(result.authToken || null);
      });
    });
  }

  static saveAuthToken(token: string): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.set({authToken: token}, () => {
        resolve();
      });
    });
  }

  static removeAuthToken(): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.remove("authToken", () => {
        resolve();
      });
    });
  }
}
