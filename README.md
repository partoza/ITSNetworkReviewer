# ITS Reviewer

## Share the leaderboard on your local network

Run the app with:

```bash
npm run dev
```

Vite prints both a local URL and a **Network** URL. Give the Network URL (for example,
`http://192.168.1.10:5173`) to friends connected to the same Wi-Fi or LAN. Keep this
computer and the development server running while they use the reviewer. If Windows
Firewall asks, allow Node.js on private networks.

The home screen's **Invite a player on your network** button lists the available LAN
addresses with the active port. **Send invitation** opens the browser/device share
sheet so the link can be sent through a messaging app, or copies the invitation when
native sharing is unavailable.

Quiz scores are written to `leaderboard.json`. The leaderboard refreshes from the
network every 15 seconds. Each visitor can use **Save all data** to cache every
subject, question, answer, and the latest leaderboard in browser storage. When the
reviewer content or shared scores change, the button becomes **Update cached data**.

The home screen also includes **Save for Offline Mode**. On the deployed Vercel HTTPS
site, this stores the complete built app and its learning content through a service
worker. After a new deployment, it changes to **Update offline version** so visitors
can replace the older cached copy.

Each subject now opens a dedicated overview with its question count, start action,
and independent leaderboard. Player scores are keyed by subject, so rankings do not
mix Network Security and Cybersecurity attempts.

The interface uses locally installed Tailwind CSS and shadcn-style components stored
under `src/components/ui`. No CDN is used, so the compiled styles and components are
included in the Vercel build and offline cache.

## Development

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
