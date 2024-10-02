function hasRentSpecials() {
  // If the section doesn't exist, return "green-flag"
  const rentSpecialsSection = document.getElementById("rentSpecialsSection");

  if (rentSpecialsSection) {
    // Select all <p> elements under rentSpecialsSection that do not have the class 'storyicon'
    const paragraphs =
      rentSpecialsSection.querySelectorAll("p:not(.storyicon)");

    // Check each paragraph for the trigger phrases
    for (const paragraph of paragraphs) {
      const text = paragraph.textContent.toLowerCase().trim();

      if (
        text.includes("move-in special") ||
        text.includes("free") ||
        text.includes("discount") ||
        text.includes("half") ||
        text.includes("gift") ||
        text.includes("concession")
      ) {
        return "red-flag"; // Return red-flag if any condition is met
      }
    }
  }

  return "green-flag"; // Return green-flag if no conditions are met
}

function hasRentListed() {
  const rentInfoDetailElement = document.querySelector(".rentInfoDetail");

  if (rentInfoDetailElement) {
    const text = rentInfoDetailElement.textContent.trim();

    // Check if the text contains "Call for Rent" (case-insensitive)
    if (text.toLowerCase().includes("call for rent".toLowerCase())) {
      return "red-flag"; // Return "red-flag" if the text contains "Call for Rent"
    } else {
      return "green-flag"; // Return "green-flag" otherwise
    }
  } else {
    return "red-flag";
  }
}

function checkSquareFootage() {
  const rentInfoDetailElements = document.querySelectorAll(".rentInfoDetail");

  // Check if there are any rentInfoDetail elements
  if (rentInfoDetailElements.length > 0) {
    const lastElement =
      rentInfoDetailElements[rentInfoDetailElements.length - 1];
    const text = lastElement.textContent.trim();

    // Check if the text is not empty (contains non-whitespace characters)
    if (text.length > 0) {
      return text; // Return "green-flag" if there's content
    }
  }
  return false;
}

function isUnitNumberBasementOrFirstFloor(unitNum) {
  // Case 1: If the unit number is 3 or 4 digits and starts with "M"

  if (/^M\d{2,3}[A-Za-z]?$/.test(unitNum)) {
    return "red-flag";
  }

  // Case 2: If the unit number contains only digits and is 3 digits starting with "1"
  if (/^\d{3}$/.test(unitNum) && unitNum.startsWith("1")) {
    return "red-flag";
  }

  // Case 3: If the unit number is 3 digits and does not start with "1"
  if (/^\d{3}$/.test(unitNum) && !unitNum.startsWith("1")) {
    return "green-flag";
  }

  // Case 4: If the unit number is 4 digits and does not start with "M"
  if (/^\d{4}$/.test(unitNum)) {
    return "green-flag";
  }

  // Case 5: If the unit number is 2 characters, and the first one is "1"
  if (/^1[A-Za-z0-9]$/.test(unitNum)) {
    return "red-flag";
  }

  // If none of the cases match, return "unsure"
  return "unsure";
}

function getLastWord(propertyText) {
  const words = propertyText.trim().split(" ");
  return words[words.length - 1];
}

function checkSingleUnit() {
  const propertyName = document.getElementById("propertyName");
  // checks if the apartments.com listing is for a building or for a single unit
  if (
    propertyName.textContent.trim().toLowerCase().includes("unit".toLowerCase())
  ) {
    return { singleUnit: true, unitNum: getLastWord(propertyName.textContent) };
  } else {
    if (!document.getElementById("pricingView")) {
      return { singleUnit: true, unitNum: "" };
    }
  }
  return { singleUnit: false, unitNum: null };
}

function checkMultipleUnits() {
  const numOfVisibleUnitGridItems = Array.from(
    document.querySelectorAll(".pricingGridItem")
  ).filter((item) => {
    const rect = item.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }).length;
  return numOfVisibleUnitGridItems > 0;
}

function checkUnitListed() {
  //checks if there is an explicit unit number listed
  const propertyName = document.getElementById("propertyName");
  if (
    propertyName.textContent.trim().toLowerCase().includes("unit".toLowerCase())
  ) {
    return "green-flag";
  } else {
    const unitGridItems = document.querySelectorAll(".unitGridContainer");
    if (unitGridItems.length > 0) {
      return "green-flag";
    }
  }
  return "red-flag";
}

function getUnitNumFromGridContainer() {
  const visibleUnitGridItems = Array.from(
    document.querySelectorAll(".unitGridContainer")
  ).filter((item) => {
    const rect = item.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });

  if (visibleUnitGridItems.length == 1) {
    // Find the unitColumn inside the first unitGridContainer
    const unitBtn = visibleUnitGridItems[0].querySelector(".unitBtn");
    if (unitBtn) {
      const spans = unitBtn.querySelectorAll("span");
      // Check for at least two spans and return the second one's text
      if (spans.length >= 2) {
        return spans[1].textContent.trim();
      }
    }
  }
  return null;
}

function hasPhotosSimilarUnitText() {
  // checks for this text in description or about:
  // Pictures, layout, and finishes may differ or be of a similar unit available within the building.
  // Photos may be of a similar unit
  const searchText = "similar unit";

  // Select the elements with the relevant classes
  const unitDetailElement = document.querySelector(".unitDetailContainer");
  const disclaimerElement = document.querySelector(".disclaimerInfoSection");
  const descriptionElement = document.querySelector(".descriptionSection");
  const descriptionContainer = document.querySelector(
    ".unitDescriptionContainer"
  );

  // Helper function to check for the search text within an element's text content
  const containsSimilarUnitText = (element) => {
    return (
      element &&
      element.textContent.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // Check each section for the specified text
  if (
    containsSimilarUnitText(unitDetailElement) ||
    containsSimilarUnitText(disclaimerElement) ||
    containsSimilarUnitText(descriptionElement) ||
    containsSimilarUnitText(descriptionContainer)
  ) {
    return "red-flag"; // Return "red-flag" if any of the elements contain the text
  }

  return "green-flag"; // Otherwise, return "green-flag"
}

function isSquareFootageLow(squareFootageString, bedrooms) {
  try {
    // Strip out everything that is not numeric from the square footage string
    const squareFootage = parseInt(squareFootageString.replace(/\D/g, ""));

    if (isNaN(squareFootage)) {
      return "unsure";
    }

    if (!bedrooms) {
      // Get number of bedrooms from class priceBedRangeInfoInnerContainer and child with class rentInfoDetail
      const bedroomElement = document.querySelector(
        ".priceBedRangeInfo li.column:nth-of-type(2) .rentInfoDetail"
      );

      if (!bedroomElement) {
        return "unsure";
      }
      bedrooms = bedroomElement.innerText.toLowerCase();
    }

    // If studio, set number of beds to 1
    if (bedrooms.includes("studio")) {
      bedrooms = 1;
    } else {
      // Otherwise, strip out everything that is not numeric and take that as the number of beds
      bedrooms = parseInt(bedrooms.replace(/\D/g, ""));
    }

    if (isNaN(bedrooms) || bedrooms === 0) {
      return "unsure";
    }

    // Calculate square footage per bedroom
    const squareFeetPerBedroom = squareFootage / bedrooms;
    // If less than 300 sq ft per bedroom, return "red-flag"
    if (squareFeetPerBedroom < 326) {
      return "red-flag";
    }

    // If square footage per bedroom is 300 or more, return "green-flag"
    return "green-flag";
  } catch (error) {
    return "unsure";
  }
}

function isOnBusyStreet(isSingleUnitListing) {
  try {
    // Check if the city is "Chicago" based on the breadcrumbs-container
    const cityElement = document.querySelector(
      '#breadcrumbs-container .crumb [data-type="city"]'
    );

    if (
      !cityElement ||
      cityElement.innerText.trim().toLowerCase() !== "chicago"
    ) {
      return "unsure";
    }

    let addressElement;

    // If it's a single unit listing, get the address from the element with id 'propertyName'
    if (isSingleUnitListing) {
      addressElement = document.getElementById("propertyName");
    } else {
      // Otherwise, get the address from the class propertyAddressContainer and child with delivery-address class
      addressElement = document.querySelector(
        ".propertyAddressContainer .delivery-address"
      );
    }
    if (!addressElement) {
      return "unsure";
    }

    // Get the address string and split it into words
    const address = addressElement.innerText.trim().split(" ");

    // Ensure the address has at least three parts
    if (address.length < 3) {
      return "unsure";
    }

    // Get the third word from the address string
    const thirdWord = address[2];

    // If the third word is numeric or a single character, return "unsure"
    if (!isNaN(thirdWord) || thirdWord.length === 1) {
      return "unsure";
    }

    // Hardcoded list of busy streets
    const busyStreets = [
      "Western",
      "Ashland",
      "Chicago",
      "Roosevelt",
      "Cicero",
      "Pulaski",
      "North",
      "Halsted",
      "Michigan",
      "State",
      "LaSalle",
      "Belmont",
      "Irving",
      "Division",
      "Milwaukee",
      "Sheridan",
      "Broadway",
      "Diversey",
      "Cermak",
      "Montrose",
      "Ridge",
      "Peterson",
      "Hollywood",
    ];

    // Check if the third word matches any busy street (case insensitive)
    if (
      busyStreets.some(
        (street) => street.toLowerCase() === thirdWord.toLowerCase()
      )
    ) {
      return "red-flag";
    }

    // If no match found, return "unsure"
    return "unsure";
  } catch (error) {
    return "unsure";
  }
}

function getUnitNumAndSquareFootageAndNumBedsFromFirstPricingGridItem() {
  let unitNum = "";
  let squareFootage = "";
  let numBeds = "";

  // Check if there is a visible element with class pricingGridItem
  const pricingGridItem = document.querySelector(".pricingGridItem");
  if (
    !pricingGridItem ||
    pricingGridItem.getBoundingClientRect().width === 0 ||
    pricingGridItem.getBoundingClientRect().height === 0
  ) {
    return { unitNum: unitNum, squareFootage: squareFootage, numBeds: numBeds };
  }

  // Check for visible unitGridContainer elements
  const visibleUnitGridContainers = Array.from(
    pricingGridItem.querySelectorAll(".unitGridContainer")
  ).filter((item) => {
    const rect = item.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0; // Check if the item is visible
  });

  if (visibleUnitGridContainers.length > 0) {
    const unitGridContainer = visibleUnitGridContainers[0]; // Get the first visible unitGridContainer

    // Get the first child with class unitContainer
    const unitContainer = unitGridContainer.querySelector(".unitContainer");
    if (unitContainer) {
      // Go to the item with class unitColumn > unitBtn > second span (without class screenReaderOnly)
      const unitSpan = unitContainer.querySelector(
        ".unitColumn .unitBtn span:not(.screenReaderOnly):nth-of-type(2)"
      );
      if (unitSpan) {
        unitNum = unitSpan.innerText.trim(); // Get the text inside the second span
      }

      // Go to the item with class sqftColumn > second span (without class screenReaderOnly)
      const sqftSpan = unitContainer.querySelector(
        ".sqftColumn span:not(.screenReaderOnly):nth-of-type(2)"
      );
      if (sqftSpan) {
        squareFootage = sqftSpan.innerText.trim(); // Get the text inside the second span
      }
    }

    const detailsLabel = pricingGridItem.querySelector(".detailsLabel");
    if (detailsLabel) {
      const detailsTextWrapper = detailsLabel.querySelector(
        ".detailsTextWrapper"
      );
      if (detailsTextWrapper) {
        const firstSpan = detailsTextWrapper.querySelector("span:first-child");
        if (firstSpan) {
          numBeds = firstSpan.innerText.trim(); // Get the text inside the first span
        }
      }
    }
  } else {
    // If unitGridContainer is not present, handle using modelName and detailsLabel structure
    const modelNameElement = pricingGridItem.querySelector(".modelName");
    if (modelNameElement) {
      unitNum = modelNameElement.innerText.trim(); // Get the text inside modelName
    }

    const detailsLabel = pricingGridItem.querySelector(".detailsLabel");
    if (detailsLabel) {
      const detailsTextWrapper = detailsLabel.querySelector(
        ".detailsTextWrapper"
      );
      if (detailsTextWrapper) {
        const firstSpan = detailsTextWrapper.querySelector("span:first-child");
        if (firstSpan) {
          numBeds = firstSpan.innerText.trim(); // Get the text inside the first span
        }
        const lastSpan = detailsTextWrapper.querySelector("span:last-child");
        if (lastSpan) {
          squareFootage = lastSpan.innerText.trim(); // Get the text inside the last span
        }
      }
    }
  }

  return { unitNum: unitNum, squareFootage: squareFootage, numBeds: numBeds };
}

function checkIfUnitNumIsActualUnitNum(unitNum) {
  // Return false if unitNum is empty
  if (unitNum === "") {
    return false;
  }

  // Return false if unitNum contains spaces
  if (unitNum.includes(" ")) {
    return false;
  }

  // Remove non-alphanumeric characters and check length
  const strippedUnitNum = unitNum.replace(/[^a-zA-Z0-9]/g, "");
  if (strippedUnitNum.length > 6) {
    return false;
  }

  // If all conditions are met, return true
  return true;
}

function wasLastUpdatedWeekPlusAgo() {
  const lastUpdated = document.querySelector(".lastUpdated");
  if (lastUpdated) {
    const subSpan = lastUpdated.querySelector("span");

    if (subSpan) {
      // Get the text content of the sub-span
      const lastUpdatedText = subSpan.textContent.trim().toLowerCase();
      if (
        lastUpdatedText.includes("Week".toLowerCase()) ||
        lastUpdatedText.includes("Weeks".toLowerCase())
      ) {
        return "red-flag";
      }
    }
  }
  return "green-flag";
}

function checkRedFlagsMain() {
  const singleUnitResponse = checkSingleUnit();
  const squareFootageFromTopContainer = checkSquareFootage();
  let hasSquareFootage;
  let hasUnitNumberListed = "red-flag";

  let isGroundFloorOrBasement = "unsure";
  let hasLowSquareFootage = "unsure";
  let unitNum;

  if (squareFootageFromTopContainer === false) {
    hasSquareFootage = "red-flag";
  } else {
    hasSquareFootage = "green-flag";
  }

  const isSingleUnitListing = singleUnitResponse.singleUnit;
  if (isSingleUnitListing) {
    unitNum = singleUnitResponse.unitNum;
    if (checkIfUnitNumIsActualUnitNum(unitNum)) {
      hasUnitNumberListed = "green-flag";
      isGroundFloorOrBasement = isUnitNumberBasementOrFirstFloor(unitNum);
    }

    hasLowSquareFootage = isSquareFootageLow(
      squareFootageFromTopContainer,
      false
    );
  } else {
    if (checkMultipleUnits()) {
      const multipleUnitResponse =
        getUnitNumAndSquareFootageAndNumBedsFromFirstPricingGridItem();
      unitNum = multipleUnitResponse.unitNum;
      if (checkIfUnitNumIsActualUnitNum(unitNum)) {
        hasUnitNumberListed = "green-flag";
        isGroundFloorOrBasement = isUnitNumberBasementOrFirstFloor(unitNum);
      }

      hasLowSquareFootage = isSquareFootageLow(
        multipleUnitResponse.squareFootage,
        multipleUnitResponse.numBeds
      );
    } else {
      hasUnitNumberListed = "unsure";
    }
  }

  return {
    hasRentSpecials: hasRentSpecials(),
    hasRentListed: hasRentListed(),
    isOnBusyStreet: isOnBusyStreet(isSingleUnitListing),
    hasPhotosSimilarUnitText: hasPhotosSimilarUnitText(),
    hasSquareFootage: hasSquareFootage,
    hasUnitNumberListed: hasUnitNumberListed,
    isGroundFloorOrBasement: isGroundFloorOrBasement,
    hasLowSquareFootage: hasLowSquareFootage,
    wasLastUpdatedWeekPlusAgo: wasLastUpdatedWeekPlusAgo(),
  };
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "redFlagCheck") {
    responseDict = checkRedFlagsMain();
    sendResponse(responseDict);
  }
});
