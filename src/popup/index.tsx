import { render } from "preact";
import { LoginForm } from "./components/LoginForm";
import { CurrentlyPlayingData } from "./components/CurrentlyPlaying";
import { SettingsForm } from "./components/SettingsForm";

function App() {
    return (
        <>
            <LoginForm />
            <SettingsForm />
            <CurrentlyPlayingData />
        </>
    );
}


render(<App />, document.getElementById('root')!);