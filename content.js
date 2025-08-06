window.WEBHOOK_CREATE_PHASE_1 = "https://hook.eu2.make.com/nvvuw23dqx14ez2iowmte56arq1ri4xq";
window.WEBHOOK_CREATE_PHASE_2 = "https://hook.eu2.make.com/g5ewyinenljbb4f84yj1mkh8xwto1wfh";
window.WEBHOOK_REFRESH_DATA = "https://hook.eu2.make.com/m2059yc72x5atvsdesflldpojs6khgyr";

// const WEBHOOK_CREATE_PHASE_1 = "https://hook.eu2.make.com/nvvuw23dqx14ez2iowmte56arq1ri4xq";
// const WEBHOOK_REFRESH_DATA = "https://hook.eu2.make.com/m2059yc72x5atvsdesflldpojs6khgyr";
// const WEBHOOK_CREATE_PHASE_2 = "https://hook.eu2.make.com/g5ewyinenljbb4f84yj1mkh8xwto1wfh"; // לשמירה אחרי עריכה


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === "AUTO_UPDATE") {
    console.log("🚀 הפעלה אוטומטית בזיהוי update=1");

    const data = await getFullProductData(true);
    data.rownumber = request.row;
    data.gid = request.gid;
    data.sheetname = request.sheetName;
    data.sheetId = request.sheetId;
    console.log(data);

    fetch(window.WEBHOOK_REFRESH_DATA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(() => {
        console.log("✅ נשלח ל־Webhook של עדכון");
        window.close();
      })
      .catch((err) => console.error("❌ שגיאה בשליחה ל־Webhook של עדכון:", err));
  }
});



function getPrice() {
  let span = null;
  span = document.querySelector('span.price--currentPriceText--V8_y_b5.pdp-comp-price-current.product-price-value');
  if (!span)
    span = document.querySelector('span[class="price-default--current--F8OlYIo"]');

  if (!span) return null;
  const price = Math.round(parseFloat(span.innerText.replace(/[^\d.]/g, '')));
  return price;
}

// function getDiscount() {
//   const discountEl = document.querySelector('span.price--discount--Y9uG2LK');
//   if (!discountEl) return null;
//   return parseInt(discountEl.innerText.replace('הנחה', '').replace('%', '').trim());
// }

function getDiscount() {
  // ניסיון ראשון – הסלקטור שלך
  const discountEl1 = document.querySelector('span.price--discount--Y9uG2LK');
  if (discountEl1) {
    const text1 = discountEl1.innerText.replace('הנחה', '').replace('%', '').trim();
    const value1 = parseInt(text1);
    if (!isNaN(value1)) return value1;
  }

  // ניסיון שני – סלקטור חלופי
  const discountEl2 = document.querySelector('.price-default--discount--TvyYuVE bdi');
  if (discountEl2) {
    const match = discountEl2.innerText.match(/(\d+)%/);
    if (match) return parseInt(match[1], 10);
  }

  return null;
}


function getDirectCommission() {
  const labels = document.querySelectorAll('.commissions .label');
  for (const label of labels) {
    if (label.innerText.includes('אומדן עמלה מקישור ישיר')) {
      const valueSpan = label.nextElementSibling;
      if (valueSpan) {
        const raw = valueSpan.innerText.replace('%', '').trim();
        const num = parseFloat(raw);
        return isNaN(num) ? null : num;
      }
    }
  }
  return null;
}

function getVideoUrl() {
  const videoEl = document.querySelector('video.video--video--bsRAdyg');
  if (videoEl) {
    const sourceEl = videoEl.querySelector('source');
    if (sourceEl && sourceEl.src) {
      let url = sourceEl.src;
      if (url.endsWith('&definition=h265')) {
        url = url.slice(0, -'&definition=h265'.length);
      }
      return url;
    }
  }
  return null;
}


// function getVideoUrl() {
//   const videoEl = document.querySelector('video.video--video--bsRAdyg');
//   if (videoEl) {
//     const sourceEl = videoEl.querySelector('source');
//     if (sourceEl && sourceEl.src) {
//       return sourceEl.src;
//     }
//   }
//   return null;
// }

function getRatingFromText() {
  const strongs = document.querySelectorAll('strong');
  for (const el of strongs) {
    const text = el.innerText.trim();
    const rating = parseFloat(text);
    if (!isNaN(rating) && rating >= 0 && rating <= 5) {
      return rating;
    }
  }
  return null;
}

function getUnitsSold() {
  const el = document.querySelector('span.reviewer--sold--ytPeoEy');
  if (!el) return null;
  const raw = el.innerText.replace(/[^\d]/g, '');
  const num = parseInt(raw);
  return isNaN(num) ? null : num;
}
function getRoundedSales() {
  const el = document.querySelector('span.reviewer--sold--ytPeoEy');
  if (!el) return null;

  // חילוץ מספר בלבד מתוך הטקסט (למשל: "171 נמכרנמכר" → 171)
  const raw = el.innerText.replace(/[^\d]/g, '');
  let num = parseInt(raw);
  if (isNaN(num)) return null;

  // עיגול כלפי מטה לפי הטווח
  if (num < 500) {
    num = Math.floor(num / 10) * 10;
  } else if (num < 1000) {
    num = Math.floor(num / 100) * 100;
  } else if (num < 10000) {
    num = Math.floor(num / 1000) * 1000;
  } else if (num < 100000) {
    num = Math.floor(num / 10000) * 10000;
  } else {
    num = Math.floor(num / 100000) * 100000;
  }

  return num;
}

// המתנה אלמנט עם תוכן
// function clickGetLinkAndExtractUrl() {
//   return new Promise((resolve, reject) => {
//     const buttons = document.querySelectorAll('[class*="btn"]');
//     let targetButton = null;

//     for (const btn of buttons) {
//       if (btn.innerText && btn.innerText.includes('לקבל קישור כ')) {
//         targetButton = btn;
//         break;
//       }
//     }

//     if (!targetButton) {
//       console.warn('⚠️ לא נמצא כפתור עם הטקסט "לקבל קישור כ"');
//       return reject('כפתור לא נמצא');
//     }

//     targetButton.click();

//     let tries = 0;
//     const maxTries = 20;

//     const interval = setInterval(() => {
//       const inputs = document.querySelectorAll('[value^="https://s.click.aliexpress.com/e/"]');

//       if (inputs.length > 0) {
//         clearInterval(interval);
//         const link = inputs[0].value.trim();
//         console.log('✅ קישור שותף נמצא:', link);
//         resolve(link); // כאן הוא מחזיר את הקישור
//       }

//       tries++;
//       if (tries >= maxTries) {
//         clearInterval(interval);
//         reject('⏰ Timeout: לא נמצא קישור שותף');
//       }
//     }, 300);
//   });
// }
function clickGetLinkAndExtractUrl() {
  return new Promise((resolve, reject) => {
    const buttons = document.querySelectorAll('[class*="btn"]');
    let targetButton = null;

    for (const btn of buttons) {
      if (btn.innerText && btn.innerText.includes('לקבל קישור כ')) {
        targetButton = btn;
        break;
      }
    }

    if (!targetButton) {
      console.warn('⚠️ לא נמצא כפתור עם הטקסט "לקבל קישור כ"');
      return reject('כפתור לא נמצא');
    }

    targetButton.click();

    let tries = 0;
    const maxTries = 20;

    const interval = setInterval(() => {
      const inputs = document.querySelectorAll('[value^="https://s.click.aliexpress.com/e/"]');

      if (inputs.length > 0) {
        clearInterval(interval);
        const link = inputs[0].value.trim();
        console.log('✅ קישור שותף נמצא:', link);
        resolve(link); // כאן הוא מחזיר את הקישור
      }

      tries++;
      if (tries >= maxTries) {
        clearInterval(interval);
        reject('⏰ Timeout: לא נמצא קישור שותף');
      }
    }, 300);
  });
}


function getMainImageUrl() {
  const el = document.querySelector('.magnifier--image--RM17RL2.magnifier--zoom--zzDgZB8');
  if (!el || !el.src) return null;

  // החלפת דומיין
  let url = el.src.replace('https://ae-pic-a1.aliexpress-media.com/', 'https://ae01.alicdn.com/');

  // סיומות תמונה נפוצות
  const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

  for (const ext of extensions) {
    const index = url.indexOf(ext);
    if (index !== -1) {
      url = url.substring(0, index + ext.length);
      break;
    }
  }

  return url;
}

//מחזיר SellpointsText
function extractSellpointsText() {
  const listItems = document.querySelectorAll('ul.seo-sellpoints--sellerPoint--RcmFO_y li pre');
  const texts = [...listItems].map(el => el.innerText.trim());
  return texts.join(' ');
}
//מחזיר מפרט
function extractFullSpecificationText() {
  const container = document.querySelector('div.specification--wrap--lxVQ2tj');
  if (!container) return null;

  return container.innerText.trim();
}
//מחזיר את סקירה כללית
function extractFullProductDescriptionText() {
  const container = document.querySelector('#product-description');
  if (!container) return null;

  // חילוץ כל הטקסט הנראה לעין כולל כל תתי-האלמנטים
  return container.innerText.trim();
}

function clickAllShowMoreButtons() {
  const buttons = document.querySelectorAll('button');

  buttons.forEach(btn => {
    const text = btn.innerText.trim();
    if (
      text === 'להציג יותר' &&
      (
        btn.classList.contains('specification--btn--Y4pYc4b') ||
        btn.classList.contains('extend--btn--TWsP5SV')
      )
    ) {
      console.log('🔘 לוחץ על כפתור:', btn);
      btn.click();
    }
  });
}

function getDescription() {
  clickAllShowMoreButtons();
  return extractSellpointsText() + "\n" + extractFullSpecificationText() + "\n" + extractFullProductDescriptionText();
}

function extractShippingInfoText() {
  const container = document.querySelector('.dynamic-shipping-line.dynamic-shipping-titleLayout');
  if (!container) return null;

  // חילוץ כל הטקסט הנראה, ללא התמונות
  return [...container.childNodes]
    .filter(node => node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE)
    .map(node => node.innerText || node.textContent || '')
    .join(' ')
    .replace(/\s+/g, ' ') // מנקה רווחים מיותרים
    .trim();
}

function getFormattedShippingInfo() {
  const container = document.querySelector('.dynamic-shipping-line.dynamic-shipping-titleLayout');
  if (!container) return null;

  const rawText = [...container.childNodes]
    .filter(node => node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE)
    .map(node => node.innerText || node.textContent || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // אם יש סימן ₪ – המשלוח בתשלום

  if (rawText.includes('חינם ברכישה מעל'))
    return '📦 משלוח חינם מעל 42 ₪';
  else if (rawText.includes('איסוף חינם'))
    return '📦 משלוח חינם';
  else if (rawText.includes('משלוח חינם') && rawText.includes('מ Israel'))
    return '📦 משלוח חינם ומהיר מהמחסן בארץ';
  else if (rawText.includes('משלוח חינם'))
    return '📦 משלוח חינם';
  else if (rawText.includes('₪'))
    return '';
  return '';// ברירת מחדל
}

// פונקציה ראשית שמחזירה את כל המידע
async function getFullProductData(update = false) {
  const data = {};
  if (!update) {
    const nameEl = document.querySelector('h1[data-pl="product-title"]');
    data.product_name = nameEl ? nameEl.innerText.trim() : null;
    data.desc = getDescription();
    try {
      data.affiliate_link = await clickGetLinkAndExtractUrl(); // תחכה כאן עד שמתקבל קישור
    } catch (err) {
      console.warn('❌ לא הצלחנו לקבל את הקישור השותף:', err);
      data.affiliate_link = null;
    }
  }

  data.rating = getRatingFromText();
  // data.sales = getUnitsSold();
  data.sales = getRoundedSales();
  data.shipping = getFormattedShippingInfo();
  data.price = getPrice();
  data.discount = getDiscount();
  data.commission = getDirectCommission();
  data.video = getVideoUrl();
  data.img = getMainImageUrl();

  return data;
}



// הרצה והצגה
async function runManualExtraction() {
  const data = await getFullProductData();
  data.desc = data.desc
    .replace(/\n/g, "\\n")
    .replace(/"/g, '\\"')
    .replace(/\r/g, "")
    .trim();

  console.log('📦 כל הנתונים:', JSON.stringify(data, null, 2));
  sendToWebhook(data);
}

// (async () => {
//   const data = await getFullProductData();
//   // data.desc = data.desc.replace(/\n/g, "\\n");
//   data.desc = data.desc
//     .replace(/\n/g, "\\n")        // מעברי שורה → תו `\n`
//     .replace(/"/g, '\\"')         // גרשיים כפולים → `\"`
//     .replace(/\r/g, "")          // הסרת carriage return אם יש
//     .trim();

//   console.log('📦 כל הנתונים:', JSON.stringify(data, null, 2));
//   sendToWebhook(data);
// })();

simple = false;
function sendToWebhook(data) {
  if (simple) {
    const url = 'https://hook.eu2.make.com/jmow52wzuan9e9kcdm8m32afq9wprxxu';
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(response => {
        const closeButton = document.querySelector('.next-balloon-close');
        if (closeButton) {
          closeButton.click(); // לוחץ עליו
        } else {
          console.warn('❌ לא נמצא האלמנט עם next-balloon-close');
        }

        alert(response.value); // ok
        console.log(response.value); // 123.45
      })

      .catch(error => {
        console.error('❌ שגיאה בשליחת הנתונים ל־Make:', error);
      });
  }

  else {
    fetch(window.WEBHOOK_CREATE_PHASE_1, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(gptData => {
        // debugger;
        showEditForm(gptData); // מציג את הטופס לעריכה
      })
      .catch(err => {
        console.error("❌ שגיאה בקבלת התשובה מ־Make:", err);
        alert("לא התקבלה תשובה מ־Make");
      });
  }
}


//המשך עם טופס לעריכת כותרת ותיאור מצאט גפט
function showEditForm(gptData) {
  // gptData = JSON.parse(gptData);
  // הסרת טופס קודם אם קיים
  const oldForm = document.getElementById("alix-editor-popup");
  if (oldForm) oldForm.remove();

  // יצירת אלמנט
  const div = document.createElement("div");
  div.innerHTML = `<div id="alix-editor-popup" style="position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
background: white; z-index: 9999; padding: 20px; border: 2px solid #999; box-shadow: 0 0 10px rgba(0,0,0,0.3); max-width: 600px; width: 90%;">
  <h2 style="margin-top: 0; font-size: 18px;">✍️ ערוך לפני שליחה</h2>
  <label style="font-weight: bold;">שורה:</label><br/>
  <input id="alix-row" type="text" style="width: 100%; background: darkblue; color: yellow; padding: 10px; border-radius: 10px; margin-bottom: 10px;"><br/>
  <label style="font-weight: bold;">כותרת:</label><br/>
  <input id="alix-title" type="text" style="width: 100%; background: darkblue; color: yellow; padding: 10px; border-radius: 10px; margin-bottom: 10px;"><br/>
  <label style="font-weight: bold;">תיאור:</label><br/>
  <textarea id="alix-desc" rows="6" style="width: 100%; background: darkblue; color: yellow; padding: 10px; border-radius: 10px;"></textarea><br/>
  <button id="alix-submit" style="margin-top: 10px; padding: 6px 12px; background-color: #4CAF50; color: white; border: none;">שמור ושלח</button>
  <button id="alix-cancel" style="margin-top: 10px; padding: 6px 12px; background-color: #ccc; border: none;">ביטול</button>
</div>`;

  document.body.appendChild(div);

  // מילוי שדות
  document.getElementById("alix-title").value = gptData.title || "";
  document.getElementById("alix-desc").value = `\n${gptData.description}` || "";
  document.getElementById("alix-row").value = gptData.rownumber || "";

  // האזנה ללחצנים
  document.getElementById("alix-submit").onclick = () => {
    const updated = {
      title: document.getElementById("alix-title").value.trim(),
      description: document.getElementById("alix-desc").value.trim(),
      rownumber: document.getElementById("alix-row").value.trim()
    };

    fetch(window.WEBHOOK_CREATE_PHASE_2, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    })
      .then(res => res.json())
      .then(response => {
        div.remove();

        alert(response.value); // ok
        console.log(response.value); // 123.45
      })
      // .then(() => {
      //   alert("✅ נשמר בהצלחה!");
      //   div.remove();
      // })
      .catch((err) => {
        console.error("❌ שגיאה בשליחה:", err);
        alert("שגיאה בשליחה ל-Make");
      });
  };

  document.getElementById("alix-cancel").onclick = () => div.remove();
}
