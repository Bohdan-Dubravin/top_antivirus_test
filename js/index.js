// Create a new instance of XMLHttpRequest
const xhr = new XMLHttpRequest();

// Configure it: GET-request for the URL
xhr.open("GET", "https://veryfast.io/t/front_test_api.php", true);

// Set up a function to handle the response
xhr.onload = function () {
  if (xhr.status >= 200 && xhr.status < 300) {
    // Parse and handle the response
    var data = JSON.parse(xhr.responseText);
    console.log(data);
  } else {
    console.error("Request failed. Returned status of " + xhr.status);
  }
};

// Set up a function to handle errors
xhr.onerror = function () {
  console.error("Request failed.");
};

// Send the request
xhr.send();
