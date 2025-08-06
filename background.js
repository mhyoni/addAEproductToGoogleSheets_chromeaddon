chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => runManualExtraction()
  });
});


// chrome.action.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ['content.js']
//   });
// });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const url = new URL(tab.url);
    const params = url.searchParams;

    if (params.get("update") === "1") {
      const sheetId = params.get("id") || "";
      const row = params.get("row") || "";
      const gid = params.get("gid") || "";
      const sheetName = decodeURIComponent(params.get("sheetName") || "");

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tabId, {
          type: "AUTO_UPDATE",
          sheetId,
          row,
          gid,
          sheetName
        });
      });
    }
  }
});
