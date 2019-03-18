# Pacman PWA

Pacman game built as a Progressive Web App.

🎮 [Play Game](https://vitaliy-bobrov.github.io/pacman-pwa/)

## Install & run:

Built files are stored in a `dist` folder. To run the game, a static server is needed.

- With NodeJS:
  - Using yarn:

  ```bash
  yarn && npm start
  ```

  - Using npm:

  ```bash
  npm install && npm start
  ```

Webpack will run webpack-dev-server on `localhost:3000` with BrowserSync on `localhost:4000`.

- With Python, just run command inside `dist` folder:

```bash
python -m SimpleHTTPServer
```

- With any static server, it should serve files from `dist`

## Controls

### Keyboard
- SPACE - Start next level or restart game after win or game over.
- UP - Move up
- LEFT - Move left
- DOWN - Move down
- RIGHT - Move right

### Touch screen
- TAP - Start next level or restart game after win or game over.
- SWIPE UP - Move up
- SWIPE LEFT - Move left
- SWIPE DOWN - Move down
- SWIPE RIGHT - Move right

## Technologies
- Phaser game engine
- TypeScript
- Webpack
- Service worker with resources caching

## Features:
- Support desktop & mobile devices
- Works offline after resource cached
- Support keyboard & touch controls
- 3 levels
- 8-bit music & sounds
- Could be added on home screen on Android
- Made with Love :)
