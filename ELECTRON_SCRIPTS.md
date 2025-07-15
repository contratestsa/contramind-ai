# Electron Scripts for package.json

Since I cannot directly edit package.json, please add these lines manually to the "scripts" section:

```json
"electron:dev": "wait-on http://localhost:5000 && electron desktop/main.js",
"electron:prod": "electron desktop/main.js"
```

## Alternative Scripts (Already Created)

I've created these equivalent shell scripts that you can use immediately:

- `./electron-dev.sh` - Waits for server and starts Electron (equivalent to electron:dev)
- `./electron-prod.sh` - Starts Electron directly (equivalent to electron:prod)

## To Test

After adding the scripts to package.json, run:
```bash
npm run electron:dev
```

Or use the shell scripts directly:
```bash
./electron-dev.sh
```

Both will:
1. Wait for the server to be ready on port 5000
2. Launch the Electron window

Note: wait-on@8.0.3 is already installed in your project.