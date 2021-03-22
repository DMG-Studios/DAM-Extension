// Options JS is the options saving functionality // 

// Save options, this is done automatically but a button is present to give the user something to do
function saveOptions(e) {
  e.preventDefault();
  chrome.storage.sync.set({ arbs: document.querySelector("#arbs").value }, function () {
    setTimeout(() => {
      window.close();
    }, 250);
  });
}

// Restore options from storage when opening options // 
function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#arbs").value = result.arbs || "default";
  }

  chrome.storage.sync.get(['arbs'], function (result) {
    setCurrentChoice(result);
  });
}

// Call functions to restore options when DOM has loaded // Restore options from storage when opening options // 
document.addEventListener("DOMContentLoaded", restoreOptions);
document.addEventListener("DOMContentLoaded", restoreEnabled);
document.querySelector("form").addEventListener("submit", saveOptions);

// Edit visible links // 

// Query all available checkboxes on page // 
let checkboxes = document.querySelectorAll("input[type=checkbox]");

checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener('change', () => {
    let enabledC = Array.from(checkboxes)
      .filter(i => i.checked)
      .map(i => i.value);
    SaveLinks(enabledC);
  })
});

// Save links to browser storage on change, is called on every marking of checkbox
function SaveLinks(e) {
  chrome.storage.sync.set({ enabledLinks: e }, function () {
  });
}

// Restore checkboxes to saved values when page is loaded or default values if nothing is found in storage 
function restoreEnabled() {
  function setCurrentChoice(result) {
    let enabledO = result.enabledLinks || ['asta','itsl','webm','mat','thes','incy','lynd','arbs','skri','finn','libg','offi','perl','tlk','hans','hosk','ask','star'];
    let match = false;
    checkboxes.forEach((checkbox) => {
      match = false;
      enabledO.forEach((element) => {
        if (checkbox.name == element) {
          checkbox.checked = true;
          match = true;
        } else if (!match) {
          checkbox.checked = false;
        }
      });
    });
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  chrome.storage.sync.get(['enabledLinks'], function (result) {
    setCurrentChoice(result);
  });
}