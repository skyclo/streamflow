const express = require('express')
const cors = require('cors')
const ytdl = require('ytdl-core')
const c = require('chalk')

const app = express()

const port = process.env.PORT || 80

var errorCount = 0

app.use(cors())

app.use(express.static(__dirname + '/src'));

app.listen(port, () => {
	console.log('Streamflow DL Backend Online at port ' + port)
})

// TODO: API Support

app.get('/dl', async (req,res) => {
    var url = req.query.URL
    var type = req.query.mimetype
    var info = await ytdl.getInfo(url)

    res.header('Content-Disposition', 'attachment; filename="' + info.title + '.' + type + '"')
    ytdl(url, {format: type}).pipe(res)
    txOK("DL-ENDPOINT " + type)
})

app.get('/info', async(req, res) => {
    var url = req.headers.id

    var info = await ytdl.getInfo(url)
    res.status(200)
    res.send({'title': info.title, 'author': info.author.name, 'upload': info.published, 'duration': info.length_seconds, 'thumbnail': info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length-1].url.substring(0, info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length-1].url.indexOf('.jpg') + '.jpg'.length)})
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
