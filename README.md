# PostToP (chrome extension)

PostToP is a chrome extension that extracts the currently playing video's data from [Youtube](https://youtube.com) & [Youtube Music](https://music.youtube.com) and sends it to the [PostToP server](https://github.com/GitDevla/postToP-Server) through Websocket.

The server filters out music videos and stores in a database for later use.

## Features

- [x] Youtube support
- [x] Youtube Music support
- [ ] Extract data like:
  - [x] Song's title
  - [x] Song's ID
  - [x] Artist name
  - [x] Artist ID
  - [x] Cover art
  - [x] Playing|Paused state
  - [x] Seekbar position
  - [x] Duration
  - [ ] Playlist name
  - [ ] Playlist ID
- [x] Send listened music to the server
- [ ] Send currently playing music to the server
- [x] Filter out music videos
- [x] Basic authentication
- [x] ass design

## Installation

1. Clone the repository
2. run `npm install` in the root directory
3. run `npm run build` in the root directory
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable developer mode
6. Click `Load unpacked` and select the `dist` directory
