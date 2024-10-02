function checkIfUrlIsApartmentsDotComListing(tabs) {
  if (tabs.length === 0) {
    return false; // No tabs available
  }

  const url = new URL(tabs[0].url);
  const hostname = url.hostname; // Get the hostname
  const path = url.pathname.replace(/\/$/, ""); // Get the pathname
  const pathSegments = path.split("/"); // Split the path into segments

  // Check if the hostname matches the expected value
  const expectedHostname = "www.apartments.com"; // Adjust this as needed

  if (hostname === expectedHostname) {
    // Get the last segment of the path
    const lastSegment = pathSegments[pathSegments.length - 1];
    // Check if the last segment is a 7-character string
    if (lastSegment.length === 7 && lastSegment !== "studios") {
      return true; // The URL is valid if it matches the criteria
    }
  }
  return false;
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  // check if the URL is for an apartment listing on apartments.com
  const unsupportedUrlSection = document.getElementById(
    "unsupportedUrlSection"
  );
  const supportedUrlSection = document.getElementById("supportedUrlSection");
  const statusSpinnerContainer = document.getElementById(
    "statusSpinnerContainer"
  );
  const flagsListGroup = document.getElementById("flagsListGroup");
  if (checkIfUrlIsApartmentsDotComListing(tabs)) {
    unsupportedUrlSection.classList.add("d-none");
    supportedUrlSection.classList.remove("d-none");
    statusSpinnerContainer.classList.remove("d-none");
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "redFlagCheck" },
      (response) => {
        statusSpinnerContainer.classList.add("d-none");
        flagsListGroup.classList.remove("d-none");
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError.message);
          document.getElementById("errorMsg").textContent =
            "Error: " + chrome.runtime.lastError.message;
        } else {
          const listGroup = document.getElementById("flagsListGroup");
          // Loop through the response dictionary
          for (const [key, value] of Object.entries(response)) {
            // Find the list item in the popup with the ID matching the key
            const item = document.getElementById(key);

            if (item) {
              const greenFlagElement = item.querySelector(".green-flag"); // Get the green flag span
              const redFlagElement = item.querySelector(".red-flag"); // Get the red flag span

              // Reset all flags to hidden
              if (greenFlagElement) {
                greenFlagElement.classList.add("d-none");
              }
              redFlagElement.classList.add("d-none");
              console.log(value);
              // Show or hide based on the value
              if (value === "green-flag") {
                if (greenFlagElement) {
                  greenFlagElement.classList.remove("d-none");
                } else {
                  item.remove();
                }
              } else if (value === "red-flag") {
                redFlagElement.classList.remove("d-none");
                // dynamically remove from current position and push to top of list-group
                listGroup.removeChild(item);
                listGroup.insertBefore(item, listGroup.firstChild);
              } else if (value === "unsure") {
                item.remove();
              }
            }
          }
        }
      }
    );
  } else {
    unsupportedUrlSection.classList.remove("d-none");
    supportedUrlSection.classList.add("d-none");
  }
});
