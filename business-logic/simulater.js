var _colormap = {
    "gray": {
        R: [30, 59, 11],
        G: [30, 59, 11],
        B: [30, 59, 11],
    },
    "deuter": {
        R:[62.5, 37.5,  0],
        G:[70,   30,    0],
        B: [0,   30,   70]
    }
}

 

function findRGB(colorcode) {
    let data = colorcode.replace("rgb", "")
    data = data.replace("a", "")
    data = data.replace("(", "")
    data = data.replace(")", "")
    data = data.replace(" ", "")

    return data.split(",").map((item)=> parseInt(item))
}

function applyMatrix(rgb_list, matrix) {
    var r = rgb_list[0];
    var g = rgb_list[1];
    var b = rgb_list[2];
    return [
        r * matrix.R[0] / 100.0 + g * matrix.R[1] / 100.0 + b * matrix.R[2] / 100.0,
        r * matrix.G[0] / 100.0 + g * matrix.G[1] / 100.0 + b * matrix.G[2] / 100.0,
        r * matrix.B[0] / 100.0 + g * matrix.B[1] / 100.0 + b * matrix.B[2] / 100.0
    ]
}


function changeColor(mapName, propertyName) {
    chrome.storage.local.get(mapName, (items)=> {
        console.log("DEBUG: ", items)

        chrome.storage.local.get("simulation-type", (type) => {
            const colorMap = items[mapName] ?? []
            const target_keys =  Object.keys(colorMap)    
            let applied_matrix = _colormap[type["simulation-type"]]

            for (var ti = 0; ti < target_keys.length; ti += 1) {
                const target = colorMap[target_keys[ti]]
                
                const rgb = findRGB(target_keys[ti])

                const nrgb = applyMatrix(rgb, applied_matrix)

                const elements = document.getElementsByClassName(target)
                for (var i = 0; i < elements.length; i+=1) {
                    let color;
                    if (!rgb[0] && !rgb[1] & !rgb[2]) continue;
                    if (rgb.length == 3) color = "rgb(" + nrgb[0] + ", " + nrgb[1] + ", " + nrgb[2] + ")"
                    else color = "rgba(" + nrgb[0] + ", " + nrgb[1] + ", " + nrgb[2] + ", " + rgb[3] + ")"                    
                    elements[i].style.setProperty(propertyName, color, "important")
                }
            }
        })

    })
}


function simulate() {
     
   
    // import deuter from "./conversion.js"

    changeColor("background-color-map", "background-color");
    changeColor("text-color-map", "color");
    // chrome.storage.local.get("background-color-map", (items)=> {
    //     console.log("DEBUG: ", items)

    //     chrome.storage.local.get("simulation-type", (type) => {
    //         const backgroundColorMap = items["background-color-map"] ?? []
    //         const target_keys =  Object.keys(backgroundColorMap)    
    //         let applied_matrix = _colormap[type["simulation-type"]]

    //         for (var ti = 0; ti < target_keys.length; ti += 1) {
    //             const target = backgroundColorMap[target_keys[ti]]
                
    //             const rgb = findRGB(target_keys[ti])

    //             const nrgb = applyMatrix(rgb, applied_matrix)

    //             const elements = document.getElementsByClassName(target)
    //             for (var i = 0; i < elements.length; i+=1) {
    //                 let color;
    //                 if (rgb.length == 3) color = "rgb(" + nrgb[0] + ", " + nrgb[1] + ", " + nrgb[2] + ")"
    //                 else color = "rgba(" + nrgb[0] + ", " + nrgb[1] + ", " + nrgb[2] + ", " + rgb[3] + ")"                    
    //                 elements[i].style.setProperty("background-color", color, "important")
    //             }
    //         }
    //     })

    // })
}


function resetColor() {
    chrome.storage.local.get("map", (items)=> {

        const target_keys =  Object.keys(items.map)
        for (var ti = 0; ti < target_keys.length; ti += 1) {
            const target = items.map[target_keys[ti]]
            // console.log(, target)

            const elements = document.getElementsByClassName(target)
            for (var i = 0; i < elements.length; i+=1) {
                elements[i].style.setProperty("background-color", target_keys[ti], "important")

                // elements[i].style.backgroundColor = 
            }
        }

    })
}







chrome.runtime.sendMessage({msg: "status"}, async function (response) {
    console.log(response)
    if (response.data.status == "simulater-start") {
        console.log("Simulater trigger: On")
        simulate()
        chrome.storage.local.set({"status": "simulater-end"})
        
    }
    else if (response.data.status == "simulater-reset") {
        console.log("Simulater trigger: On")
        resetColor()
        chrome.storage.local.set({"status": "simulater-end"})
    }
    else {
        console.log("Simulater trigger: Off")
    }
})