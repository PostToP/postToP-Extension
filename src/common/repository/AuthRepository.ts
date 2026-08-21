import {browser} from "../browser";

export class AuthRepository {
  static async getAuthToken(): Promise<string | null> {
    const {authToken} = (await browser.storage.local.get("authToken")) as {authToken?: string};
    return authToken || null;
  }

  static saveAuthToken(token: string): Promise<void> {
    return browser.storage.local.set({authToken: token});
  }

  static removeAuthToken(): Promise<void> {
    return browser.storage.local.remove("authToken");
  }
}
