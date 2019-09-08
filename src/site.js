const url = document.querySelector('.yturl')
const button = document.querySelector('.conv')
const select = document.querySelector('.mimetype-selector')

const port = 80
const remote = `localhost:${port}`

button.addEventListener('click', function () {
    if (url.value == '') return alert("An error has occoured: No input")
    if ((url.value.includes("youtube.com/watch?v=") || url.value.includes("youtu.be/"))) {
        download(url.value, select.value)
    } else {
        return alert("An error has occoured: Invalid YouTube Link")
    }
})

function download(URL, mimeType) {
    window.location.href = `http://${remote}/dl?URL=${URL}&mimetype=${mimeType}`
}

// TODO: have a small box with info about the video selected (request data on node.js backend and then display)
function returnInfo(URL) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `http://${remote}/info`, true)
    xhttp.send("");
}