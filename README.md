# DimHeader

Chrome extension for adding and overriding HTTP request headers.

## Features

- Add any number of custom request headers
- Override existing headers (e.g. `Authorization`, `User-Agent`, `Accept-Language`)
- Toggle individual headers on/off without deleting them
- Master switch to disable all headers at once
- Settings are synced via `chrome.storage.sync`
- All changes apply instantly — no page reload required

## Installation

### From CRX file

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Drag and drop `dimheader.crx` onto the page
4. Confirm installation

### From source (unpacked)

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dimheader` folder

## Usage

1. Click the DimHeader icon in the Chrome toolbar
2. Click **Добавить заголовок** to add a new header row
3. Enter the header name (e.g. `Authorization`) and value (e.g. `Bearer token123`)
4. The header is applied immediately to all subsequent requests
5. Use the toggle on the left of each row to temporarily disable a header
6. Use the master toggle (top right) to disable all headers at once

## File Structure

```
dimheader/
├── manifest.json     # Extension manifest (Manifest V3)
├── background.js     # Service worker — applies rules via declarativeNetRequest
├── popup.html        # Popup UI markup
├── popup.css         # Styles
├── popup.js          # Popup logic
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Permissions

| Permission | Reason |
|---|---|
| `declarativeNetRequest` | Modify request headers |
| `storage` | Save header configuration |
| `activeTab` | Access current tab context |
| `<all_urls>` | Apply headers to all URLs |

## Building CRX

Requires Google Chrome and OpenSSL.

```bash
# Generate key (first time only)
openssl genrsa -out dimheader.pem 2048

# Pack extension
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --pack-extension=./dimheader \
  --pack-extension-key=./dimheader.pem
```

Output: `dimheader.crx`

> Keep `dimheader.pem` safe — it's required to publish updates with the same extension ID.
