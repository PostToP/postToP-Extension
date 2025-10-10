import {useEffect, useState} from "preact/compat";
import {authClient} from "../../common/auth";

export function LoginForm() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    authClient.getSession().then(session => {
      if (session.data?.session) setUser(session);
    });
  }, []);

  function logOut() {
    authClient.signOut();
    setUser(null);
  }

  function handleLoginSubmit() {
    const currentURL = new URL(window.location.href);
    authClient.signIn.social({
      provider: "google",
      scopes: ["openid", "email", "profile", "https://www.googleapis.com/auth/youtube.readonly"],
      callbackURL: currentURL.origin + currentURL.pathname,
    });
  }

  return (
    <>
      {user ? (
        <p>
          Logged in as {user.data.user.name}.{" "}
          <button type="button" onClick={logOut}>
            Log out
          </button>
        </p>
      ) : (
        <button type="button" onClick={handleLoginSubmit}>
          Sign in with Google
        </button>
      )}
    </>
  );
}
