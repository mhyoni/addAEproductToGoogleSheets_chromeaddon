function getPrice() {
  const span = document.querySelector('span.price--currentPriceText--V8_y_b5.pdp-comp-price-current.product-price-value');
  if (!span) return null;
  const price = Math.round(parseFloat(span.innerText.replace(/[^\d.]/g, '')));
  return price;
}

function getDiscount() {
  const discountEl = document.querySelector('span.price--discount--Y9uG2LK');
  if (!discountEl) return null;
  return parseInt(discountEl.innerText.replace('הנחה', '').replace('%', '').trim());
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
async function getFullProductData() {
  const data = {};
  const nameEl = document.querySelector('h1[data-pl="product-title"]');
  data.product_name = nameEl ? nameEl.innerText.trim() : null;
  data.desc = getDescription();

  data.rating = getRatingFromText();
  // data.sales = getUnitsSold();
  data.sales = getRoundedSales();
  data.shipping = getFormattedShippingInfo();
  data.price = getPrice();
  data.discount = getDiscount();
  data.commission = getDirectCommission();
  data.video = getVideoUrl();
  data.img = getMainImageUrl();
  try {
    data.affiliate_link = await clickGetLinkAndExtractUrl(); // תחכה כאן עד שמתקבל קישור
  } catch (err) {
    console.warn('❌ לא הצלחנו לקבל את הקישור השותף:', err);
    data.affiliate_link = null;
  }

  return data;
}



// הרצה והצגה
(async () => {
  const data = await getFullProductData();
  // data.desc = data.desc.replace(/\n/g, "\\n");
  data.desc = data.desc
  .replace(/\n/g, "\\n")        // מעברי שורה → תו `\n`
  .replace(/"/g, '\\"')         // גרשיים כפולים → `\"`
  .replace(/\r/g, "")          // הסרת carriage return אם יש
  .trim();

  console.log('📦 כל הנתונים:', JSON.stringify(data, null, 2));
  sendToWebhook(data);
})();


function sendToWebhook(data) {
  const url = 'https://hook.eu2.make.com/nvvuw23dqx14ez2iowmte56arq1ri4xq';

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

