const axios = require('axios')
const cheerio = require('cheerio')

const handler = async (event, context, callback) => {
    const { search, version } = event.queryStringParameters;
    const url = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(search)}&version=${version}`
    console.log("GET ", url)

    axios.get(url)
        .then(res => {
            if (res.status === 200) {
                console.log("200 response")
                const footnotes = /\[[a-z]+\]/g
                const verseNumbers = /\d{1,3}\s/g

                const $ = cheerio.load(res.data);
                const reference = $('.passage-display-bcv', '.text-html').text()
                const text = $('p', '.text-html').text().replace(footnotes, "").replace(verseNumbers, "").trim()
                console.log("PARSED")
                console.log(reference)
                console.log(text)

                return { reference, text }
            } else {
                console.log(res.status)
                console.log(res.headers)
            }
        })
        .then(data => {
            console.log("FIRE CALLBACK")
            console.log(data)
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(data)
            })
        })
        .catch(err => console.error(err))
    
}

exports.handler = handler;
