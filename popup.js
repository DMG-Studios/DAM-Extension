let date = new Date();
date.setHours(2, 0, 0, 0);
let options = { weekday: "long" };
let today = date.toLocaleDateString("en-us", options);
let element = document.getElementById("today");
element.textContent = today;

var divList = document.getElementsByClassName("lunchbutton");
var content = document.getElementById("food");

var optionsLink = document.getElementById("settings");
var enabledLinks;

function settings() {
  chrome.runtime.openOptionsPage();
}
optionsLink.addEventListener("click", settings);

function attachClickEvent() {
  var listLength = divList.length;
  for (var i = 0; i < listLength; i++) {
    divList[i].addEventListener("click", showLunch);
  }
}

function GetLinkList() {
  function setCurrentChoice(result) {
    enabledLinks = result.enabledLinks;
    enableLinks();
  }
  chrome.storage.sync.get(['enabledLinks'], function (result) {
    setCurrentChoice(result)
  });
}

function enableLinks() {
  var show = document.getElementsByClassName("show");
  console.log(show);
  let match = false;
  for (const link of show) {
    console.log(link);
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

GetLinkList();
// Add event listener to close addon when a link is clicked // 

var links = document.getElementsByClassName("link");

function getLinks() {
  var l = links.length;
  for (var i = 0; i < l; i++) {
    links[i].addEventListener("click", closeLink);
  }
}

function closeLink() {
  setTimeout(() => {
    window.close();
  }, 100);
}

var food;
var menuList = [];
function getFood() {
  fetch("http://nugge.fi/foodGet.php")
    .then((r) => r.json())
    .then((r) => {
      callFood(r);
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
      if (menus[k].SetMenus.length > 0) {
        for (i = 0; i < menus[k].SetMenus.length; i++) {
          menuList[i] = menus[k].SetMenus[i].Components;
        }
      } else {
        for (i = 0; i < 4; i++) {
          menuList[i] = "No Food of selected type today"
        }
      }
    }
  });
}

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

attachClickEvent();
getFood();
getLinks();
