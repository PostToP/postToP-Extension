import {render} from "preact";
import {LoginForm} from "./components/LoginForm";
import {SettingsForm} from "./components/SettingsForm";

function App() {
  return (
    <>
      <h1>Hi from react</h1>
      <LoginForm />
      <details>
        <summary>Settings</summary>
        <SettingsForm />
      </details>
    </>
  );
}

render(<App />, document.getElementById("root") || document.body);
