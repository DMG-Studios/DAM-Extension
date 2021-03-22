// PopUP Js is the main window functionality that doesn't rely on external user modfiable content // 

// Variables for time and dom elements
let date = new Date();
date.setHours(2, 0, 0, 0);
let options = { weekday: "long" };
let today = date.toLocaleDateString("en-us", options);

// Set food day to today according to en-us locale // 
let element = document.getElementById("today");
element.textContent = today;

var divList = document.getElementsByClassName("lunchbutton");
var content = document.getElementById("food");

var optionsLink = document.getElementById("settings");
var enabledLinks;

// Function for quick access to settings page 
function settings() {
  chrome.runtime.openOptionsPage();
}
optionsLink.addEventListener("click", settings);

// Attach click event to lunch options 
function attachClickEvent() {
  var listLength = divList.length;
  for (var i = 0; i < listLength; i++) {
    divList[i].addEventListener("click", showLunch);
  }
}

// Get enables links from storage
function GetLinkList() {
  function setCurrentChoice(result) {
    enabledLinks = result.enabledLinks || ['asta','itsl','webm','mat','thes','incy','lynd','arbs','skri','finn','libg','offi','perl','tlk','hans','hosk','ask','star'];
    enableLinks();
  }
  chrome.storage.sync.get(['enabledLinks'], function (result) {
    setCurrentChoice(result)
  });
}

// Enable links according to settings saved in storage // 
// Due to not being allowed to create html elements or use innerHTML in extensions elements display style is set to none when hidden //
function enableLinks() {
  var show = document.getElementsByClassName("show");
  let match = false;
  for (const link of show) {
    match = false;
    enabledLinks.forEach(enabled => {
      if (link.id == enabled) {
        match = true;
        link.style.display = 'block';
      } else if (!match) {
        link.style.display = 'none';
      }
    })
  };
}
// Get all link DOM elements
var links = document.getElementsByClassName("link");

// Call link listing
GetLinkList();
// Add event listener to close addon when a link is clicked // 

// Get all link DOM elements
var links = document.getElementsByClassName("link");

// Get DOM Link elements in extension
function getLinks() {
  var l = links.length;
  for (var i = 0; i < l; i++) {
    links[i].addEventListener("click", closeLink);
  }
}

// Close extension window when any link element is clicked, if this isn't done the window will stay open which is annoying //
function closeLink() {
  setTimeout(() => {
    window.close();
  }, 100);
}

// Call food from a PHP Proxy that calls the Foodandco API 
// Error handling is done in two phases, one for not getting a correct respons which happens if no food is avaiable at all and one if no food of selected type is available
var food;
var menuList = [];
function getFood() {
  fetch("http://nugge.fi/foodGet.php")
      .then((r) => r.json())
      .then((r) => {
          callFood(r);
      }).catch((error) => {
          for (i = 0; i < 4; i++) {
              menuList[i] = "No Food Service Today or API Broken :("
          }
      });
}

function callFood(r) {
  food = r;
  fillFood();
}

function fillFood() {
  var menus = food.MenusForDays;
  Object.keys(menus).forEach(function (k) {
      let menudate = new Date(menus[k].Date.substring(0, 10));
      if (menudate.toISOString() == date.toISOString()) {
          for (i = 0; i < 4; i++) {
              if (menus[k].SetMenus[i].Components.length > 1) {
                  menuList[i] = menus[k].SetMenus[i].Components;
              } else {
                  menuList[i] = "No Food of selected type today"
              }
          }
      }
  });
}

// Show lunch when a food type is clicked from menuList
function showLunch() {
  if (this.id == "today") {
    content.style.display = "none";
  } else if (content.style.display == "block" && content.classList.contains(this.id)
  ) {
    content.style.display = "none";
    content.className = "";
  } else {
    content.classList = this.id;
    if (this.id == "veg") {
      content.textContent = menuList[0];
    } else if (this.id == "met") {
      content.textContent = menuList[1];
    } else if (this.id == "soup") {
      content.textContent = menuList[2];
    } else if (this.id == "dess") {
      content.textContent = menuList[3];
    } else if (content.style.display == "block") {
      content.style.display = "none";
    }
    content.style.display = "block";
  }
}

// Call helper functions // 
attachClickEvent();
getFood();
getLinks();