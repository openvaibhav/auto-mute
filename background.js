let lastActiveTabId = null;
let lastActiveWindowId = null;

function isTargetTab(tab) {
  return tab && tab.url && (tab.url.includes('youtube.com') || tab.url.includes('twitch.tv'));
}

function safeSendMessage(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, () => {
    // Suppress errors if the content script is not present
    if (chrome.runtime.lastError) {
      // Optionally log: console.debug('No receiver in tab', tabId);
    }
  });
}

async function handleTabSwitch(newTabId, newWindowId) {
  // Send blur to previous tab if it was a target site
  if (lastActiveTabId !== null && lastActiveWindowId !== null) {
    try {
      const prevTab = await chrome.tabs.get(lastActiveTabId);
      if (isTargetTab(prevTab)) {
        safeSendMessage(prevTab.id, { action: 'press_m' });
      }
    } catch (e) { /* Tab may not exist */ }
  }
  // Send focus to new tab if it is a target site
  try {
    const newTab = await chrome.tabs.get(newTabId);
    if (isTargetTab(newTab)) {
      safeSendMessage(newTab.id, { action: 'press_m' });
    }
  } catch (e) { /* Tab may not exist */ }
  // Update last active
  lastActiveTabId = newTabId;
  lastActiveWindowId = newWindowId;
}

// Listen for tab activation and window focus changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await handleTabSwitch(activeInfo.tabId, activeInfo.windowId);
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Chrome minimized: send blur to last active target tab
    if (lastActiveTabId !== null) {
      try {
        const prevTab = await chrome.tabs.get(lastActiveTabId);
        if (isTargetTab(prevTab)) {
          safeSendMessage(prevTab.id, { action: 'press_m' });
        }
      } catch (e) { /* Tab may not exist */ }
    }
    return;
  }
  const [tab] = await chrome.tabs.query({ active: true, windowId });
  if (tab) {
    await handleTabSwitch(tab.id, windowId);
  }
});

async function pressMOnAllActiveTargetTabs() {
  const windows = await chrome.windows.getAll({ populate: true });
  windows.forEach(win => {
    const activeTab = win.tabs && win.tabs.find(tab => tab.active);
    if (activeTab && isTargetTab(activeTab)) {
      safeSendMessage(activeTab.id, { action: 'press_m' });
    }
  });
}

chrome.runtime.onStartup.addListener(() => {
  pressMOnAllActiveTargetTabs();
});

chrome.runtime.onInstalled.addListener(() => {
  pressMOnAllActiveTargetTabs();
}); 