chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const url = new URL(tab.url);
    const params = url.searchParams;

    // אם יש update=1 ⇒ מצב עדכון
    if (params.get("update") === "1") {
      const sheetId = params.get("id") || "";
      const row = params.get("row") || "";
      const gid = params.get("gid") || "";
      const sheetName = decodeURIComponent(params.get("sheetName") || "");
      const chatgpt = params.get("chatgpt") || "";

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }, () => {
        // המתנה קצרה לפני שליחת ההודעה
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, {
            type: "AUTO_UPDATE",
            sheetId,
            row,
            gid,
            sheetName,
            chatgpt
          });
        }, 500); // חצי שנייה – לרוב מספיק
      });

    } else {
      // אחרת – טוען את content.js אבל לא מריץ כלום
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });
    }
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { type: "MANUAL_EXTRACTION" });
});
