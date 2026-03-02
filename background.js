chrome.storage.onChanged.addListener((changes) => {
  if (changes.headers || changes.enabled) {
    applyRules();
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ headers: [], enabled: true }, () => {
    applyRules();
  });
});

async function applyRules() {
  const { headers = [], enabled = true } = await chrome.storage.sync.get({
    headers: [],
    enabled: true,
  });

  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingIds = existingRules.map((r) => r.id);

  if (existingIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds,
    });
  }

  if (!enabled) return;

  const activeHeaders = headers.filter(
    (h) => h.enabled && h.name.trim() && h.value.trim()
  );

  if (activeHeaders.length === 0) return;

  const requestHeaders = activeHeaders.map((h) => ({
    header: h.name.trim(),
    operation: "set",
    value: h.value.trim(),
  }));

  const rule = {
    id: 1,
    priority: 1,
    action: {
      type: "modifyHeaders",
      requestHeaders,
    },
    condition: {
      urlFilter: "*",
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "image",
        "font",
        "object",
        "xmlhttprequest",
        "ping",
        "csp_report",
        "media",
        "websocket",
        "webtransport",
        "webbundle",
        "other",
      ],
    },
  };

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [rule],
  });
}
