grab_colors_button = document.getElementById("grab-color")

grab_colors_button.addEventListener("click", ()=> {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        var myTabId = tabs[0].id;
        console.log("Sending: ", myTabId)
        chrome.runtime.sendMessage({ msg: "Find elements", tabId: myTabId}, (response) => {
            if (response) {
              console.log("Sent response: ", response)
            }
        });
    });
})

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    var myTabId = tabs[0].id;
    chrome.runtime.sendMessage({ msg: "status", tabId: myTabId}, (response) => {

        switch (response.data.status) {
            case "none":
                    console.log("Still Initializing") 
                    break
            case "finder-start": 
                    console.log("Finder script triggered")
                    break
            case "finder-end":
                    console.log("Finder script finish the task")
                    chrome.runtime.sendMessage({msg: "Simulate elements", tabId: myTabId}, (response) => {
                        if (response) {
                            console.log("Sent response: ", response)
                          }
                    }) 
                    break
            default:
                console.log("you supposed to not be here: ", response)
                
        }
    });
});



