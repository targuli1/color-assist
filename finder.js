

function grabAllColors() {
    const elements = document.getElementsByTagName("div") ?? []
    console.log("Total amount of div refs: ", elements.length)
    var colorMap = {}
    var binder = {}
    var count = 0

    for (var i = 0; i < elements.length; i += 1) {
        const element_color = getComputedStyle(elements[i]).backgroundColor.toString()
        
        if (binder[element_color] == undefined) {
            binder[element_color] = "bind_" + count
            count += 1
        }
        elements[i].className += " " + binder[element_color]
    }

    chrome.storage.local.set({"map": binder})
    chrome.storage.local.set({"status": "finder-end"})
}




chrome.runtime.sendMessage({msg: "status"}, async function (response) {
    console.log(response)
    if (response.data.status == "finder-start") {
        grabAllColors();
    }
    else {
        console.log("Finder trigger: Off")
    }
})


