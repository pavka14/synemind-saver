let websites_json = {};
let websites_json_by_domain = {};

function loaded() {
    document.getElementById("refresh-all-notes-button").onclick = function () {
        //location.reload();
        loadDataFromBrowser(true);
    }
    document.getElementById("clear-all-notes-button").onclick = function () {
        clearAllNotes();
    }

    loadDataFromBrowser(true);
}

function loadDataFromBrowser(generate_section = true) {
    browser.storage.local.get("websites", function (value) {
        websites_json = {};
        if (value["websites"] != undefined) {
            websites_json = value["websites"];
        }
        if (generate_section) {
            document.getElementById("all-website-sections").textContent = "";
            websites_json_by_domain = {};
            loadAllWebsites();
        }
        //console.log(JSON.stringify(websites_json));
    });
}

function clearAllNotes() {
    //TODO: add confirmationClearAllNotes dialog
    let confirmationClearAllNotes = true;
    if (confirmationClearAllNotes) {
        let clearStorage = browser.storage.local.clear();
        clearStorage.then(onCleared, onError);
    }
}

function onCleared() {
    //all notes clear || successful
    loadDataFromBrowser(true);
}

function onError(e) {
}

function loadAllWebsites() {
    if (!isEmpty(websites_json)) {
        //there are websites saved

        for (let domain in websites_json) {
            if (websites_json[domain]["type"] == undefined) {
                websites_json[domain]["type"] = 0;
                websites_json[domain]["domain"] = "";
            }

            if (websites_json[domain]["type"] == 0) {
                //domain
                if (websites_json_by_domain[domain] == undefined) {
                    websites_json_by_domain[domain] = [];
                }
            } else {
                //page
                let root_domain = websites_json[domain]["domain"];
                let domain_to_add = domain.replace(root_domain, "");
                if (websites_json_by_domain[root_domain] == undefined) {
                    websites_json_by_domain[root_domain] = [];
                }
                if (websites_json_by_domain[root_domain].indexOf(domain_to_add) == -1) {
                    websites_json_by_domain[root_domain].push(domain_to_add);
                }
            }
        }
        //console.log(JSON.stringify(websites_json_by_domain));

        websites_json_by_domain = sortOnKeys(websites_json_by_domain);

        for (let domain in websites_json_by_domain) {
            let section = document.createElement("div");
            section.classList.add("section");

            let h2 = document.createElement("h2");
            h2.textContent = domain;
            h2.classList.add("link", "go-to-external");
            h2.onclick = function () {
                browser.tabs.create({url: domain});
            }
            let all_pages = document.createElement("div");

            section.append(h2);

            websites_json_by_domain[domain].sort();

            console.log(JSON.stringify(websites_json_by_domain[domain]));

            if (websites_json[domain] != undefined) {
                //there is notes also for the domain
                let urlPageDomain = domain;
                let page = document.createElement("div");
                page.classList.add("sub-section");
                let lastUpdate = websites_json[urlPageDomain]["last-update"];
                let notes = websites_json[urlPageDomain]["notes"];

                page = generateNotes(page, urlPageDomain, notes, lastUpdate, "Domain", urlPageDomain);

                all_pages.append(page);
            }

            for (let index = 0; index < websites_json_by_domain[domain].length; index++) {
                let urlPage = websites_json_by_domain[domain][index];
                let urlPageDomain = domain + websites_json_by_domain[domain][index];
                let page = document.createElement("div");
                page.classList.add("sub-section");

                let lastUpdate = websites_json[urlPageDomain]["last-update"];
                let notes = websites_json[urlPageDomain]["notes"];

                page = generateNotes(page, urlPage, notes, lastUpdate, "Page", urlPageDomain);

                all_pages.append(page);
            }

            section.append(all_pages);

            document.getElementById("all-website-sections").append(section);
        }

    } else {
        //no websites
        let section = document.createElement("div");
        section.classList.add("section-empty");
        section.textContent = "No websites found";

        document.getElementById("all-website-sections").append(section);
    }
}

function generateNotes(page, url, notes, lastUpdate, type, fullUrl) {
    let pageType = document.createElement("div");
    pageType.classList.add("sub-section-type");
    pageType.textContent = type;

    page.append(pageType)

    if (type.toLowerCase() != "domain") {
        let pageUrl = document.createElement("h3");
        pageUrl.classList.add("link", "go-to-external");
        pageUrl.textContent = url;
        pageUrl.onclick = function () {
            browser.tabs.create({url: fullUrl});
        }

        page.append(pageUrl);
    }

    let pageNotes = document.createElement("div");
    pageNotes.classList.add("sub-section-notes");
    pageNotes.textContent = notes;
    page.append(pageNotes);

    let pageLastUpdate = document.createElement("div");
    pageLastUpdate.classList.add("sub-section-last-update");
    pageLastUpdate.textContent = "Last update: " + lastUpdate;
    page.append(pageLastUpdate);

    return page;
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0
}

function sortOnKeys(dict) {
    var sorted = [];
    for (var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();

    var tempDict = {};
    for (var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }

    return tempDict;
}

loaded();