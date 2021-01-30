
function saveOptions(e) {
  e.preventDefault();
  chrome.storage.sync.set({ arbs: document.querySelector("#arbs").value }, function () {
    setTimeout(() => {
      window.close();
    }, 250);
  });
}
function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#arbs").value = result.arbs || "default";
  }

  chrome.storage.sync.get(['arbs'], function (result) {
    setCurrentChoice(result);
  });
}


document.addEventListener("DOMContentLoaded", restoreOptions);
document.addEventListener("DOMContentLoaded", restoreEnabled);
document.querySelector("form").addEventListener("submit", saveOptions);

// Edit visible links // 


let checkboxes = document.querySelectorAll("input[type=checkbox]");

checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener('change', () => {
    let enabledC = Array.from(checkboxes)
      .filter(i => i.checked)
      .map(i => i.value);
    SaveLinks(enabledC);
  })
});

function SaveLinks(e) {

  chrome.storage.sync.set({ enabledLinks: e }, function () {
  });
}

function restoreEnabled() {
  function setCurrentChoice(result) {
    let enabledO = result.enabledLinks || ['asta','itsl','webm','mat','thes','incy','lynd','arbs','skri','finn','libg','offi','perl','tlk'];
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