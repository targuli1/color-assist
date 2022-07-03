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



function changeColor() {
     
   
    // import deuter from "./conversion.js"

    chrome.storage.local.get("map", (items)=> {

        const target_keys =  Object.keys(items.map)

        const deuter = {
            R:[62.5, 37.5,  0],
            G:[70,   30,    0],
            B: [0,   30,   70]
        }


        const blacker = {
            R:[0, 0,  0],
            G:[0,   0, 0],
            B: [0,   0, 0]
        }

        const applied_matrix = blacker;

        for (var ti = 0; ti < target_keys.length; ti += 1) {
            const target = items.map[target_keys[ti]]
            
            const rgb = findRGB(target_keys[ti])

            const nrgb = applyMatrix(rgb, applied_matrix)

            console.log(rgb, "vs", nrgb)
            const elements = document.getElementsByClassName(target)
            for (var i = 0; i < elements.length; i+=1) {
                if (rgb.length == 3) {
                    elements[i].style.backgroundColor = "rgb(" + nrgb[0] + ", " + nrgb[1] + ", " + nrgb[2] + ")"
                }
                else {
                    elements[i].style.backgroundColor = "rgba(" + nrgb[0] + ", " + nrgb[1] + ", " + nrgb[2] + ", " + rgb[3] + ")"
                }
            }
        }

    })

    console.log("done")

}









chrome.runtime.sendMessage({msg: "status"}, async function (response) {
    console.log(response)
    if (response.data.status == "simulater-start") {
        console.log("Simulater trigger: On")
        changeColor()
        chrome.storage.local.set({"status": "simulater-end"})
        
    }
    else {
        console.log("Simulater trigger: Off")
    }
})