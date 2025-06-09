# Auto Mute on Tab Switch (YouTube & Twitch)

This Chrome extension automatically simulates pressing the `m` key on YouTube and Twitch tabs when you:
- Switch away from or back to the tab
- Minimize or restore Chrome
- Reopen Chrome (browser restart)

This is useful for auto-muting/unmuting video players when you leave or return to a tab.

## Features
- Supports YouTube and Twitch by default
- Only triggers on tab switch, minimize/restore, or browser startup (not on page reload)
- Easy to customize for more sites

## Installation
1. **Clone or download this repository.**
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the extension folder.

## Usage
- Open YouTube or Twitch in a tab.
- When you switch away from the tab, minimize Chrome, or restore/reopen Chrome, the extension will simulate pressing `m` (mute/unmute) on the video player.
- Works for multiple windows and tabs.

## Permissions
- `tabs`, `scripting`: Needed to detect tab/window changes and inject the keypress.
- Host permissions for YouTube and Twitch.

## Customization
To add more sites:
1. Edit `manifest.json`:
   - Add your site's match pattern to the `matches` and `host_permissions` arrays.
2. Edit `background.js`:
   - Update the `isTargetTab` function to include your site's domain.

Example:
```js
function isTargetTab(tab) {
  return tab && tab.url && (
    tab.url.includes('youtube.com') ||
    tab.url.includes('twitch.tv') ||
    tab.url.includes('YOUR_SITE.com')
  );
}
```

## How it Works
- The extension injects a content script into YouTube and Twitch tabs.
- The background script listens for tab/window events and sends a message to the content script to simulate the `m` keypress.
- The content script dispatches the keypress event to the page.

## License
MIT 