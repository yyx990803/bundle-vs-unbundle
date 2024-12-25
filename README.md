# Comparing bundled vs unbundled perf

## How to Run

```bash
npm run build
npm run dev
```

Compare `localhost:4000` and `localhost:4000/bundled.html`

## Details

Running build generates:

- 5000 modules under `src/esm`
- 5 levels deep import chain, with each level importing 1k modules in parallel.
- Also generates `src/esm/bundled.js`
- You can change the total number of modules by running e.g. `npm run build -- 3000`

Running dev starts a Node.js http2 server with self-signed cert, with `maxConcurrentStreams` set to 1,000.
