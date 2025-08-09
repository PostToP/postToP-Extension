import { useEffect, useState } from "preact/hooks";
import { getServerAddress } from "../utils";

async function sendLoginRequest(username: string, password: string) {
    const address = await getServerAddress();
    const url = `http://${address}/auth`;
    const body = JSON.stringify({
        username: username,
        password: password,
    });

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: body,
    })
    if (!res.ok) {
        throw new Error("Login failed: " + res.statusText);
    }
    const data = await res.json();
    chrome.storage.local.set({ authToken: data.token });
}

export function LoginForm() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        chrome.storage.local.get("authToken", (result) => {
            if (result.authToken) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        });
    }, []);

    function logOut() {
        chrome.storage.local.remove("authToken", () => {
            setLoggedIn(false);
            alert("Logged out successfully!");
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
            })
            .catch((error) => {
                console.error("Login error:", error);
                alert("Login failed: " + error.message);
            });
    }

    return <>{loggedIn ? <p>Logged in as TODO <button onClick={logOut}>Log out</button></p> : <form onSubmit={handleLoginSubmit}>
        <p>Username: <input type="text" name="username"></input></p>
        <p>Password: <input type="password" name="password"></input></p>
        <p><button type="submit">Login</button></p>
    </form>}</>
}