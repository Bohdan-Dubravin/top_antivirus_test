document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await fetchData();
    document.title = data?.result?.title || "McAfee® Total Protection";
    showOffers(data.result.elements);
    createJsonLD(data.result);
  } catch (error) {}
});

//get data used AJAX instead of fetch because of test description
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

//show offers list
function showOffers(data) {
  const list = document.querySelector(".content__list");
  const loader = document.querySelector(".loader");

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
          <p class="content__price">$${amount} <span class="content__price-period">/${licensePeriod}</span> ${
      discount ? `<span class="content__discount">$${Math.floor((amount / discount) * 100)}.99 </span>` : ""
    }</p> 
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
    listItem.querySelector(".content__button").addEventListener("click", () => {
      displayDownloadsPlace();
    });

    list.appendChild(listItem);

    list.classList.remove("d-none");
    loader.classList.add("d-none");
  });
}

//display button near downloads however in modern chrome browser button is also at the top
function displayDownloadsPlace() {
  if (isMobileDevice()) return;
  const browser = getBrowser();
  setTimeout(() => {
    if (browser === "Chrome") {
      const downloadsPointer = document.querySelector(".bottom-arrow");
      downloadsPointer.classList.remove("d-none");
    } else {
      const downloadsPointer = document.querySelector(".top-arrow");
      downloadsPointer.classList.remove("d-none");
    }
  }, 1500);
}

//get browse type
function getBrowser() {
  const userAgent = navigator.userAgent;
  return /Firefox\//.test(userAgent)
    ? "Firefox"
    : /Chrome\//.test(userAgent)
    ? "Chrome"
    : /Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)
    ? "Safari"
    : /MSIE|Trident\//.test(userAgent)
    ? "Internet Explorer"
    : /Edge\//.test(userAgent)
    ? "Edge"
    : "Unknown browser";
}

// detect if mobile
function isMobileDevice() {
  return navigator.userAgentData.mobile;
}

// ceo optimization get request
function createJsonLD(data) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.title,
    offers: data.elements.map((element) => ({
      "@type": "Offer",
      url: element.link,
      priceCurrency: "USD",
      price: element.amount,
      availability: "https://schema.org/InStock",
      name: element.name_display,
      sku: element.product_key,
      description: `${element.name_prod} - ${element.license_name}`,
    })),
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}
