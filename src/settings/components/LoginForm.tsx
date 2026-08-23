import {useEffect, useState} from "preact/compat";
import {AuthRepository} from "../../common/repository/AuthRepository";
import {SettingsRepository} from "../../common/repository/SettingsRepository";
import {serverFetch} from "../../common/serverUrl";
import {chromeSendMessage} from "../Chrome";

async function sendLoginRequest(username: string, password: string) {
  const address = await SettingsRepository.getSetting("serverAddress");
  const body = JSON.stringify({
    username: username,
    password: password,
  });

  const res = await serverFetch(address, "/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });
  if (!res.ok) {
    throw new Error(`Login failed: ${res.statusText}`);
  }
  const data = await res.json();
  await AuthRepository.saveAuthToken(data.token);
}

export function LoginForm() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    AuthRepository.getAuthToken().then(token => {
      if (token) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  function logOut() {
    AuthRepository.removeAuthToken().then(() => {
      setLoggedIn(false);
      alert("Logged out successfully!");
      chromeSendMessage("RESTART_WEBSOCKET");
    });
  }

  function handleLoginSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;
    sendLoginRequest(username, password)
      .then(() => {
        setLoggedIn(true);
        alert("Login successful!");
        chromeSendMessage("RESTART_WEBSOCKET");
      })
      .catch(error => {
        console.error("Login error:", error);
        alert(`Login failed: ${error.message}`);
      });
  }

  return (
    <div className="flex flex-col gap-3 text-sm text-text-primary">
      {loggedIn ? (
        <div className="flex items-center justify-between gap-3">
          <div className="text-text-secondary">Logged in</div>
          <button
            type="button"
            className="px-3 py-1.5 text-sm rounded-md bg-[var(--color-accent-tertiary)] text-[var(--color-background)] hover:cursor-pointer"
            onClick={logOut}>
            Log out
          </button>
        </div>
      ) : (
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-text-secondary">Username</span>
            <input
              className="px-3 py-2 rounded-md bg-surface border border-border text-text-primary"
              type="text"
              name="username"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-text-secondary">Password</span>
            <input
              className="px-3 py-2 rounded-md bg-surface border border-border text-text-primary"
              type="password"
              name="password"
              required
            />
          </label>

          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 rounded-md text-sm font-medium bg-[var(--color-accent-primary)] text-[var(--color-background)] hover:cursor-pointer">
            Login
          </button>
        </form>
      )}
    </div>
  );
}
