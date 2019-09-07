const express = require('express')
const cors = require('cors')
const ytdl = require('ytdl-core')

const app = express()

app.use(cors())

app.listen(35100, () => {
	console.log('Streamflow DL Backend Online at port 35100')
})

app.get('/dl', (req,res) => {
    var url = req.query.URL
    var type = req.query.mimetype
    switch (type) {
        case "mp4": {
            res.header('Content-Disposition', 'attachment; filename="video.mp4"')
            ytdl(url, {format: 'mp4'}).pipe(res)
            break
        }
        case "mp3": {
            res.header('Content-Disposition', 'attachment; filename="audio.mp3"')
            ytdl(url, {filter:"audioonly", format:"mp3"}).pipe(res)
            break;
        }
    }
})