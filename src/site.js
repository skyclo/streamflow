const url = document.querySelector('.yturl')
const button = document.querySelector('.conv')
const select = document.querySelector('.mimetype-selector')

const infoBox = document.getElementById('vidinfo')
const title = document.querySelector('.title')
const author = document.querySelector('.author')
const publishedDate = document.querySelector('.published_date')
const duration = document.querySelector('.duration')
const thumb = document.querySelector('.thumb')

const remote = /* `localhost:80` */ `streamflow.herokuapp.com`

var data

var lastValue = ''

infoBox.classList.add('hide')
infoBox.classList.remove('show')

url.addEventListener("blur", async () => {
    if (url.value == lastValue) return
    lastValue = url.value

    if ((url.value.includes("youtube.com/watch?v=") || url.value.includes("youtu.be/"))) {
        data = await returnInfo(url.value)

        title.innerHTML = data.title
        title.href = url.value
        author.innerHTML = data.author
        publishedDate.innerHTML = new Date(data.upload).toDateString()
        duration.innerHTML = formatTime(data.duration)
        thumb.src = data.thumbnail

        infoBox.classList.remove('hide')
        infoBox.classList.add('show')
    } else {
        infoBox.classList.add('hide')
        infoBox.classList.remove('show')
    }
})

button.addEventListener('click', async () => {
    if (url.value == '') return alert("An error has occoured: No input")
    if ((url.value.includes("youtube.com/watch?v=") || url.value.includes("youtu.be/"))) {
        download(url.value, select.value)
    } else {
        //TODO: Custom error/warning instead of alert()'s
        return alert("An error has occoured: Invalid YouTube Link")
    }
})

function download(URL, mimeType) {
    window.location.href = `http://${remote}/dl?URL=${URL}&mimetype=${mimeType}`
}

async function returnInfo(URL) {
    let response = await fetch(`http://${remote}/info`, {headers:{'id':URL}})

    if (response.ok) {
        return await response.json()
    } else {
        alert("HTTP-Error: " + response.status)
    }
}

function formatTime(t) {
    var h, m, s, r
    h = ~~(t / 3600)
    m = ~~((t % 3600) / 60)
    s = ~~t % 60
    r = "";

    if (h > 0) r += "" + h + ":" + (m < 10 ? "0" : "")
    r += "" + m + ":" + (s < 10 ? "0" : "")
    r += "" + s
    
    return r
}
