
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
document.querySelector("form").addEventListener("submit", saveOptions);