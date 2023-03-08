

function grabAllColors() {
    const elements = document.getElementsByTagName("*") ?? []
    console.log("Total amount of div refs: ", elements.length)
    var colorMap = {}
    var backgroundColorMap = {}
    var bgCount = 0
    var txtCount = 0

    for (var i = 0; i < elements.length; i += 1) {
        const bg_color = getComputedStyle(elements[i]).backgroundColor.toString()
        const text_color = getComputedStyle(elements[i]).color.toString()
        if (backgroundColorMap[bg_color] == undefined) {
            backgroundColorMap[bg_color] = "background-color-binder-" + bgCount;
            bgCount += 1
        }
        if (! elements[i].classList.contains(backgroundColorMap[bg_color])) {
            elements[i].className += " " + backgroundColorMap[bg_color]
        }


        if (colorMap[text_color] == undefined) {
            colorMap[text_color] = "text-color-binder-" + txtCount;
            txtCount += 1
        }

        if (!elements[i].classList.contains(colorMap[text_color])) {
            elements[i].className += " " + colorMap[text_color]
        }
    }

    chrome.storage.local.set({"background-color-map": backgroundColorMap})
    chrome.storage.local.set({"text-color-map": colorMap})

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


