document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await fetchData();
    document.title = data?.result?.title || "McAfee® Total Protection";
    showOffers(data.result.elements);
  } catch (error) {}
});

async function fetchData() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "https://veryfast.io/t/front_test_api.php", true);

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(new Error("Request failed. Returned status of " + xhr.status));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Request failed."));
    };

    xhr.send();
  });
}

function showOffers(data) {
  const list = document.querySelector(".content__list");

  data?.forEach((element) => {
    const { name_prod, license_name, amount, is_best, price_key, is_disabled, link } = element;

    const licensePeriod = license_name.toLowerCase().includes("month") ? "mo" : "per year";
    const discount = Number(price_key.replace(/[^0-9]/g, ""));

    const listItem = document.createElement("li");
    listItem.classList.add("content__item");

    listItem.innerHTML = `
        <div class="content__price-container">
        ${discount ? '<img class="content__discount-img" src="./img/50OFF.svg" alt="discount" />' : ""}
        ${is_best ? '<span class="content__best-product">Best value</span>' : ""}
          <p class="content__price">$${amount} <span>/${licensePeriod}</span></p>
        </div>
        <div class="content__description">
          <p class="content__name">${name_prod}</p>
          <p class="content__period">${license_name}</p>
        </div>
        <a style="${
          is_disabled && "pointer-events: none"
        }" href="${link}" download="${name_prod}" class="content__button">
          download <img src="./img/download.svg" alt="download">
        </a>
    `;
    list.appendChild(listItem);
  });
}

var userAgent = navigator.userAgent;

// Regular expression to match browsers
var browser;
if (/Firefox\//.test(userAgent)) {
  browser = "Firefox";
} else if (/Chrome\//.test(userAgent)) {
  browser = "Chrome";
} else if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) {
  browser = "Safari";
} else if (/MSIE|Trident\//.test(userAgent)) {
  browser = "Internet Explorer";
} else if (/Edge\//.test(userAgent)) {
  browser = "Edge";
} else {
  browser = "Unknown browser";
}

// Output the detected browser
console.log(browser);
// {
//   "product_key": "mcafee_total_1_1",
//   "price_key": "test",
//   "is_best": true,
//   "is_checked": true,
//   "is_disabled": false,
//   "is_addon": false,
//   "name_display": "McAfee® Total Protection 1-Year / 1-Device",
//   "name_prod": "McAfee® Total Protection",
//   "license_name": "1-Year / 1-Device",
//   "amount": "1.02",
//   "link": "https://sadownload.mcafee.com/products/sa/website/WebAdvisorInstaller.exe"
// }
