# ProxiSpeak Frontend Starter

A responsive React + Vite frontend starter for ProxiSpeak. It includes a dark interface, prompt starters, typed input, browser speech-to-text (where supported), browser text-to-speech, voice-style controls, and copy-to-clipboard.

> Important: the live URL returned `503 Service Unavailable` when checked, so this interface is a fresh starter—not a verified recreation of the existing website. The sample response is local/demo behavior and is not connected to the backend yet.

## Run locally

1. Install Node.js (LTS).
2. Extract this folder and open it in VS Code.
3. In the terminal, run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL shown by Vite (usually `http://localhost:5173`).

## Connect your backend

Create `.env` from `.env.example` and set `VITE_API_BASE_URL` to your backend URL. Then update the `send` function in `src/App.jsx` to call the actual API route and use its response. The API endpoint and request/response format are intentionally not guessed because the deployed site was unavailable during inspection.

## Build

```bash
npm run build
```

The production output is created in `dist/`.

## Push to GitHub

Create a repository on GitHub, then run these commands from this folder (replace the URL with your own repository URL):

```bash
git init
git add .
git commit -m "Add ProxiSpeak frontend"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Do not commit secrets or private API keys. The `.env.example` file is safe to commit; a real `.env` file should remain local.
