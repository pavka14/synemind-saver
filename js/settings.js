let settings_json = {
    "open-default": "domain",
    "consider-parameters": "yes",
    "consider-sections": "yes",
    "open-popup-default": "Ctrl+Alt+O",
    "open-popup-domain": "Ctrl+Alt+D",
    "open-popup-page": "Ctrl+Alt+P",
};

const all_strings = strings[languageToUse];
const link_translate = "https://crowdin.com/project/notefox";

let sync_local = browser.storage.sync;
browser.storage.local.get("storage").then(result => {
    if (result === "sync") sync_local = browser.storage.sync;
    else if (result === "local") sync_local = browser.storage.local;
    else sync_local = browser.storage.sync;
});

var currentOS = "default"; //default: win, linux, ecc. | mac
var letters_and_numbers = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var ctrl_alt_shift = ["default", "domain", "page"];

function loaded() {
    checkOperatingSystem();
    setLanguageUI();

    document.getElementById("save-settings-button").onclick = function () {
        saveSettings();
    }
    document.getElementById("translate-addon").onclick = function () {
        browser.tabs.create({url: link_translate});
    }
    document.getElementById("open-by-default-select").onchange = function () {
        settings_json["open-default"] = document.getElementById("open-by-default-select").value;
    };

    document.getElementById("consider-parameters-select").onchange = function () {
        settings_json["consider-parameters"] = document.getElementById("consider-parameters-select").value;
    };
    document.getElementById("consider-sections-select").onchange = function () {
        settings_json["consider-sections"] = document.getElementById("consider-sections-select").value;
    };

    document.getElementById("save-on-local-instead-of-sync-select").onchange = function () {
        settings_json["save-on-local-not-sync"] = document.getElementById("save-on-local-instead-of-sync-select").value;
    };
    document.getElementById("save-on-local-instead-of-sync-select").onchange = function () {
        settings_json["save-on-local-not-sync"] = document.getElementById("save-on-local-instead-of-sync-select").value;
    };

    loadSettings();

    let titleAllNotes = document.getElementById("title-settings-dedication-section");
    titleAllNotes.textContent = all_strings["settings-title"];
}

function setLanguageUI() {
    let buttonSave = document.getElementById("save-settings-button");
    buttonSave.value = all_strings["save-settings-button"];

    document.title = all_strings["settings-title-page"];

    document.getElementById("open-by-default-text").innerText = all_strings["open-popup-by-default"];
    document.getElementById("open-by-default-domain-text").innerText = all_strings["domain-label"];
    document.getElementById("open-by-default-page-text").innerText = all_strings["page-label"];
    document.getElementById("consider-parameters-text").innerText = all_strings["consider-parameters"];
    document.getElementById("consider-parameters-button-yes").innerText = all_strings["settings-select-button-yes"];
    document.getElementById("consider-parameters-button-no").innerText = all_strings["settings-select-button-no"];
    document.getElementById("consider-parameters-detailed-text").innerText = all_strings["consider-parameters-detailed"];
    document.getElementById("consider-sections-text").innerText = all_strings["consider-sections"];
    document.getElementById("consider-sections-button-yes").innerText = all_strings["settings-select-button-yes"];
    document.getElementById("consider-sections-button-no").innerText = all_strings["settings-select-button-no"];
    document.getElementById("consider-sections-detailed-text").innerText = all_strings["consider-sections-detailed"];
    document.getElementById("save-on-local-instead-of-sync-text").innerText = all_strings["save-on-local-instead-of-sync"];
    document.getElementById("save-on-local-instead-of-sync-button-yes").innerText = all_strings["settings-select-button-yes"];
    document.getElementById("save-on-local-instead-of-sync-button-no").innerText = all_strings["settings-select-button-no"];
    document.getElementById("save-on-local-instead-of-sync-detailed-text").innerText = all_strings["save-on-local-instead-of-sync-detailed"];
    document.getElementById("open-popup-default-shortcut-text").innerText = all_strings["open-popup-default-shortcut-text"];
    document.getElementById("open-popup-domain-shortcut-text").innerText = all_strings["open-popup-domain-shortcut-text"];
    document.getElementById("open-popup-page-shortcut-text").innerText = all_strings["open-popup-page-shortcut-text"];

    letters_and_numbers.forEach(letterNumber => {
        document.getElementById("key-shortcut-default-selected").innerHTML += "<option value='" + letterNumber + "' id='select-" + letterNumber.toLowerCase() + "-shortcut-default'>" + letterNumber + "</option>";
        document.getElementById("key-shortcut-domain-selected").innerHTML += "<option value='" + letterNumber + "' id='select-" + letterNumber.toLowerCase() + "-shortcut-domain'>" + letterNumber + "</option>";
        document.getElementById("key-shortcut-page-selected").innerHTML += "<option value='" + letterNumber + "' id='select-" + letterNumber.toLowerCase() + "-shortcut-page'>" + letterNumber + "</option>";
    });
}

function loadSettings() {
    let shortcuts = browser.commands.getAll();
    shortcuts.then(getCurrentShortcuts);

    browser.storage.local.get(["storage"]).then(result => {
        sync_local.get("settings", function (value) {
            settings_json = {};
            if (value["settings"] !== undefined) {
                settings_json = value["settings"];
                if (settings_json["open-default"] === undefined) settings_json["open-default"] = "domain";
                if (settings_json["consider-parameters"] === undefined) settings_json["consider-parameters"] = "yes";
                if (settings_json["consider-sections"] === undefined) settings_json["consider-sections"] = "yes";
                if (settings_json["open-popup-default"] === undefined) settings_json["open-popup-default"] = "Ctrl+Alt+O";
                if (settings_json["open-popup-domain"] === undefined) settings_json["open-popup-domain"] = "Ctrl+Alt+D";
                if (settings_json["open-popup-page"] === undefined) settings_json["open-popup-page"] = "Ctrl+Alt+P";
            } else {
                //settings undefined
                settings_json["open-default"] = "domain";
                settings_json["consider-parameters"] = "no";
                settings_json["consider-sections"] = "no";
                settings_json["open-popup-default"] = "Ctrl+Alt+O";
                settings_json["open-popup-domain"] = "Ctrl+Alt+D";
                settings_json["open-popup-page"] = "Ctrl+Alt+P";
            }

            let sync_or_local_settings = result["storage"];
            if (sync_or_local_settings === undefined) sync_or_local_settings = "sync";

            document.getElementById("open-by-default-select").value = settings_json["open-default"];
            document.getElementById("consider-parameters-select").value = settings_json["consider-parameters"];
            document.getElementById("consider-sections-select").value = settings_json["consider-sections"];
            if (sync_or_local_settings === "sync") document.getElementById("save-on-local-instead-of-sync-select").value = "no";
            else if (sync_or_local_settings === "local") document.getElementById("save-on-local-instead-of-sync-select").value = "yes";

            let keyboardShortcutCtrlAltShiftDefault = document.getElementById("key-shortcut-ctrl-alt-shift-default-selected");
            let keyboardShortcutLetterNumberDefault = document.getElementById("key-shortcut-default-selected");
            let keyboardShortcutCtrlAltShiftDomain = document.getElementById("key-shortcut-ctrl-alt-shift-domain-selected");
            let keyboardShortcutLetterNumberDomain = document.getElementById("key-shortcut-domain-selected");
            let keyboardShortcutCtrlAltShiftPage = document.getElementById("key-shortcut-ctrl-alt-shift-page-selected");
            let keyboardShortcutLetterNumberPage = document.getElementById("key-shortcut-page-selected");


            keyboardShortcutCtrlAltShiftDefault.value = "Ctrl+Alt";
            keyboardShortcutLetterNumberDefault.value = "O";
            keyboardShortcutCtrlAltShiftDomain.value = "Ctrl+Alt";
            keyboardShortcutLetterNumberDomain.value = "D";
            keyboardShortcutCtrlAltShiftPage.value = "Ctrl+Alt";
            keyboardShortcutLetterNumberPage.value = "P";

            ctrl_alt_shift.forEach(value => {
                let keyboardShortcutCtrlAltShift = document.getElementById("key-shortcut-ctrl-alt-shift-" + value + "-selected");
                let keyboardShortcutLetterNumber = document.getElementById("key-shortcut-" + value + "-selected");
                let splitKeyboardShortcut = settings_json["open-popup-" + value].split("+");
                let letterNumberShortcut = splitKeyboardShortcut[splitKeyboardShortcut.length - 1];
                let ctrlAltShiftShortcut = settings_json["open-popup-" + value].substring(0, settings_json["open-popup-" + value].length - 2);
                keyboardShortcutLetterNumber.value = letterNumberShortcut;
                keyboardShortcutCtrlAltShift.value = ctrlAltShiftShortcut;

                let commandName = "_execute_browser_action";
                if (value === "domain") commandName = "opened-by-domain";
                else if (value === "page") commandName = "opened-by-page";

                document.getElementById("key-shortcut-ctrl-alt-shift-" + value + "-selected").onchange = function () {
                    settings_json["open-popup-" + value] = document.getElementById("key-shortcut-ctrl-alt-shift-" + value + "-selected").value + "+" + document.getElementById("key-shortcut-" + value + "-selected").value;
                    //updateShortcut(commandName, settings_json["open-popup-" + value]);
                }
                document.getElementById("key-shortcut-" + value + "-selected").onchange = function () {
                    settings_json["open-popup-" + value] = document.getElementById("key-shortcut-ctrl-alt-shift-" + value + "-selected").value + "+" + document.getElementById("key-shortcut-" + value + "-selected").value;
                    //updateShortcut(commandName, settings_json["open-popup-" + value]);
                }
            });
            //console.log(JSON.stringify(settings_json));
        });
    });
}

function saveSettings() {
    browser.storage.local.get(["storage"]).then(resultSyncLocalValue => {
        sync_local.set({"settings": settings_json}).then(resultF => {
            //Saved
            let buttonSave = document.getElementById("save-settings-button");
            buttonSave.value = all_strings["saved-button"];

            ctrl_alt_shift.forEach(value => {
                let commandName = "_execute_browser_action";
                if (value === "domain") commandName = "opened-by-domain";
                else if (value === "page") commandName = "opened-by-page";

                updateShortcut(commandName, settings_json["open-popup-" + value]);
            });


            let sync_or_local_settings = document.getElementById("save-on-local-instead-of-sync-select").value;
            if (sync_or_local_settings === undefined) sync_or_local_settings = "no";

            if (sync_or_local_settings === "yes") {
                //use local (from sync)
                sync_local = browser.storage.local;
                browser.storage.local.set({"storage": "local"});
                browser.storage.sync.get([
                    "settings",
                    "websites",
                    "sticky-notes-coords",
                    "sticky-notes-sizes",
                    "sticky-notes-opacity"
                ]).then(result => {
                    browser.storage.local.set(result).then(resultSet => {
                        browser.storage.sync.get([
                            "settings",
                            "websites",
                            "sticky-notes-coords",
                            "sticky-notes-sizes",
                            "sticky-notes-opacity"
                        ]).then(result2 => {
                            //console.log("-1->" + JSON.stringify(result));
                            //console.log("-2->" + JSON.stringify(result2));
                            //console.log(JSON.stringify(result) === JSON.stringify(result2));
                            if (JSON.stringify(result) === JSON.stringify(result2)) browser.storage.sync.clear().then(
                                result3 => {
                                    browser.storage.local.set({"storage": "local"});
                                });
                        });
                        browser.storage.local.set({"storage": "local"});
                    }).catch((error) => {
                        console.error("Error importing data to local:", error);
                    });
                }).catch((error) => {
                    console.error("Error retrieving data from sync:", error);
                });
            } else if (sync_or_local_settings === "no") {
                //use sync (from local)
                sync_local = browser.storage.sync;
                browser.storage.local.set({"storage": "sync"});
                browser.storage.local.get([
                    "settings",
                    "websites",
                    "sticky-notes-coords",
                    "sticky-notes-sizes",
                    "sticky-notes-opacity"
                ]).then(result => {
                    browser.storage.sync.set(result).then(resultSet => {
                        browser.storage.local.get([
                            "settings",
                            "websites",
                            "sticky-notes-coords",
                            "sticky-notes-sizes",
                            "sticky-notes-opacity"
                        ]).then(result2 => {
                            //console.log("-1->" + JSON.stringify(result));
                            //console.log("-2->" + JSON.stringify(result2));
                            //console.log(JSON.stringify(result) === JSON.stringify(result2));
                            if (JSON.stringify(result) === JSON.stringify(result2)) browser.storage.local.clear().then(
                                result3 => {
                                    browser.storage.local.set({"storage": "sync"});
                                });
                        });
                        browser.storage.local.set({"storage": "sync"});
                    }).catch((error) => {
                        console.error("Error importing data to sync:", error);
                    });
                }).catch((error) => {
                    console.error("Error retrieving data from local:", error);
                });
            }

            setTimeout(function () {
                buttonSave.value = all_strings["save-settings-button"];
            }, 2000);
            //console.log(JSON.stringify(settings_json));
        });
    });
}

function checkOperatingSystem() {
    let info = browser.runtime.getPlatformInfo();
    info.then(getOperatingSystem);
    //"mac", "win", "linux", "openbsd", "cros", ...
    // Docs: (https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/PlatformOs)ˇ
}

function getOperatingSystem(info) {
    if (info.os === "mac") currentOS = "mac";
    else currentOS = "default";

    ctrl_alt_shift.forEach(value => {
        document.getElementById("select-ctrl-shortcut-" + value).textContent = all_strings["label-ctrl-" + currentOS];
        document.getElementById("select-alt-shortcut-" + value).textContent = all_strings["label-alt-" + currentOS];
        document.getElementById("select-ctrl-alt-shortcut-" + value).textContent = all_strings["label-ctrl-alt-" + currentOS];
        document.getElementById("select-ctrl-shift-shortcut-" + value).textContent = all_strings["label-ctrl-shift-" + currentOS];
        document.getElementById("select-alt-shift-shortcut-" + value).textContent = all_strings["label-alt-shift-" + currentOS];
    });
}

function getCurrentShortcuts(commands) {
    commands.forEach((command) => {
        settings_json[command] = command.shortcut;
    });
}

function updateShortcut(commandName, shortcut) {
    browser.commands.update({
        name: commandName, shortcut: shortcut
    });
}

loaded();