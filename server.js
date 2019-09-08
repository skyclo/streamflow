const express = require('express')
const cors = require('cors')
const ytdl = require('ytdl-core')
const c = require('chalk')

const app = express()

const port = 80

var errorCount = 0

app.use(cors())

app.use(express.static(__dirname + '/src'));

app.listen(80, () => {
	console.log('Streamflow DL Backend Online at port ' + port)
})

app.get('/dl', (req,res) => {
    var url = req.query.URL
    var type = req.query.mimetype
    switch (type) {
        case "mp4": {
            res.header('Content-Disposition', 'attachment; filename="video.mp4"')
            ytdl(url, {format: 'mp4'}).pipe(res)
            txOK("DL-ENDPOINT [MP4]")
            break
        }
        case "mp3": {
            res.header('Content-Disposition', 'attachment; filename="audio.mp3"')
            ytdl(url, {filter:"audioonly", format:"mp3"}).pipe(res)
            txOK("DL-ENDPOINT [MP3]")
            break
        }
    }
})

app.get('/', (req, res) =>{
    res.set('Content-Type', 'text/html')
    res.status(200).sendFile("./index.html", {root:"./src"})
    txOK("index.html")
})

app.get('/index', (req, res) =>{
    res.set('Content-Type', 'text/html')
    res.status(200).sendFile("./index.html", {root:"./src"})
    txOK("index.html")
})

app.get('/tos', (req, res) =>{
    res.set('Content-Type', 'text/html')
    res.status(200).sendFile("./tos.html", {root:"./src"})
    txOK("tos.html")
})

app.get('/about', (req, res) =>{
    res.set('Content-Type', 'text/html')
    res.status(200).sendFile("./about.html", {root:"./src"})
    txOK("about.html")
})

/* app.get('/index.js', (req, res) =>{
    res.set('Content-Type', 'text/javascript')
    res.status(200).sendFile("./index.js", {root:"./src"})
})

app.get('/dark.css', (req, res) =>{
    res.set('Content-Type', 'text/css')
    res.status(200).sendFile("./dark.css", {root:"./src"})
})

app.get('/l2banner-1920.png', (req, res) =>{
    res.set('Content-Type', 'image/png')
    res.status(200).sendFile("./l2banner-1920.png", {root:"./src"})
})

app.get('/favicon.ico', (req, res) =>{
    res.set('Content-Type', 'image/x-icon')
    res.status(200).sendFile("./favicon.ico", {root:"./src"})
}) */

function txOK(s) {
    var t = new Date().toISOString()
    console.log(`${c.gray(`[ ${t} ]`)} ${c.bold.bgGreen.black(` 200 `)} ${c.magenta(`(SERVER)`)} ${s}` )
    errorCount = 0
}

function txERR(s, e) {
    var t = new Date().toISOString()
    console.log(`${c.gray(`[ ${t} ]`)} ${c.bold.bgRed.black(` ${e} `)} ${c.magenta(`(SERVER)`)} ${s}` )
    errorCount++
    if (errorCount > 4) {
        console.log(`${c.gray(`[ ${t} ]`)} ${c.bold.bgRed.black(` INTERNAL `)} ${c.magenta(`(SERVER)`)} Multiple concurrent server failures. Count: ${errorCount}` )
    }
}