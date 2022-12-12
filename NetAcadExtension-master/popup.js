console.log("popup.js RUNNING");
(async function () {
  let power = window.document.getElementById("powerbtn");
  let select = window.document.getElementById("selectbtn");

  //find if the storage has a saved state

  let isPowerOn = await getStorageValue("IS_POWER_ON").then((result) => result);
  let isSelectOn = await getStorageValue("IS_SELECT_ON").then(
    (result) => result
  );
  power.innerHTML = isPowerOn
    ? "Stop NetAcad AutoSolver"
    : "Start NetAcad AutoSolver<br/>(Will Reload Page)";
  select.innerHTML = isSelectOn
    ? "Disable Select for Answer"
    : "Enable Select for Answer<br/>(Will Reload Page)";
  makePowerStyle(isPowerOn);
  makeSelectStyle(isSelectOn);
  //if ispoweron is undefined, it's first use so use powered on styles
  if (typeof isPowerOn === "undefined") {
    makePowerStyle(true);
    await setStorageValue("IS_POWER_ON", true);
    isPowerOn = true;
  }
  if (typeof isSelectOn === "undefined") {
    makePowerStyle(true);
    await setStorageValue("IS_SELECT_ON", true);

    isSelectOn = true;
  }

  power.addEventListener("click", async function (event) {
    isPowerOn = await getStorageValue("IS_POWER_ON").then((result) => result);
    power.innerText = isPowerOn ? "Stopping..." : "Starting...";
    isPowerOn = !isPowerOn;
    await setStorageValue("IS_POWER_ON", isPowerOn);
    if (isPowerOn) refreshPage();
    isPowerOn = await getStorageValue("IS_POWER_ON").then((result) => result);
    setTimeout(() => {
      power.innerHTML = isPowerOn
        ? "Stop NetAcad AutoSolver"
        : "Start NetAcad AutoSolver<br/>(Will Reload Page)";
      makePowerStyle(isPowerOn);
    }, 1000);
  });

  select.addEventListener("click", async function (event) {
    isSelectOn = await getStorageValue("IS_SELECT_ON").then((result) => result);
    if (!isSelectOn && !isPowerOn)
      if (
        confirm(
          "Are you sure you want to Enable Select For Answer and Start the extension?(Will Reload Page)"
        )
      ) {
        power.click();
      } else return;

    select.innerText = isSelectOn ? "disabling..." : "enabling...";
    isSelectOn = !isSelectOn;

    await setStorageValue("IS_SELECT_ON", isSelectOn);

    if (isSelectOn) refreshPage();
    isSelectOn = await getStorageValue("IS_SELECT_ON").then((result) => result);
    setTimeout(() => {
      select.innerHTML = isSelectOn
        ? "Disable Select for Answer"
        : "Enable Select for Answer<br/>(Will Reload Page)";
      makeSelectStyle(isSelectOn);
    }, 1000);
  });

  function refreshPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    });
  }

  function makePowerStyle(isPowerOn) 
  function makeSelectStyle(isPowerOn) 

  function setStorageValue(key, value) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: value }, function (e) {
        resolve(value);
      });
    });
  }

  function getStorageValue(key) {
    return new Promise((resolve, reject) => {
      chrome.storage?.sync.get([key], function (result) {
        resolve(result[key]);
      });
    });
  }
})();
