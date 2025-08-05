import { render } from "preact";
import { LoginForm } from "./components/LoginForm";
import { CurrentlyPlayingData } from "./components/CurrentlyPlaying";
import { SettingsForm } from "./components/SettingsForm";

function App() {
    return (
        <>
            <LoginForm />
            <details>
                <summary>Settings</summary>
                <SettingsForm />
            </details>
            <CurrentlyPlayingData />
        </>
    );
}


render(<App />, document.getElementById('root')!);