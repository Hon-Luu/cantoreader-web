# cantoreader-web

倉頡打字 — the CantoReader Cangjie typing course as a web game.

**This repo holds built artifacts only.** Source lives in the private
`Hon-Luu/cantoreader-app` repo under `web/`; the Deploy workflow here checks
it out read-only (secret `APP_REPO_TOKEN`), emits the data bundle with
`build_reader.py --web-out`, runs the test suite (station-id and RNG parity
fixtures are deploy gates), builds, and commits the result to `main`, which
GitHub Pages serves.

Site: https://hon-luu.github.io/cantoreader-web/
