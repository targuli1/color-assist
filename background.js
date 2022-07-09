
chrome.tabs.onUpdated.addListener(function(activeInfo) {
    chrome.storage.local.set({"status": "none"})
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request) {
        // console.log("debug: ", request)
        if (request.msg == "Find elements") {
            // console.log("before")
            chrome.scripting.executeScript(
                {
                    target: {tabId: request.tabId},
                    files: ["finder.js"],
                },
                ()=> {console.log("game over")}
            )
            
            sendResponse({ data: {} });
            chrome.storage.local.set({"status": "finder-start"})
        }


        else if (request.msg == "Simulate elements") {
            // console.log("before")
            chrome.scripting.executeScript(
                {
                    target: {tabId: request.tabId},
                    files: ["simulater.js"],
                }
            )
            
            sendResponse({ data: {} });
            //chrome.storage.local.set({"status": "simulater-start"})
        }

        else if (request.msg == "status") {

            chrome.storage.local.get("status", (item)=> {
                sendResponse({data: item})
            })
            
        }
    }

    return true
});
