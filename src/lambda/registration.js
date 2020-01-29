const axios = require('axios')

const handler = (event, context, callback) => {
    console.log("*** REGISTRATION ***")
    const json = JSON.parse(event.body);
    console.log(`${json.students.length} students registered by ${json.name} | ${json.email}`)
    if (json.addToEmailList) subscribeToNewsletter(json.email)
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({ flash: "Got it. Thanks!" })
    })
}

const subscribeToNewsletter = (email) => {
    console.log(">>>")
    const lambdaURL = process.env === 'production' ? '/.netlify/functions' : '/localhost:9000'
    axios.post(`http://localhost:8000${lambdaURL}/newsletter`, {email}) // todo this should not be static to localhost
    .then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res.data)
    })
    .catch(err => console.error(err))
}

exports.handler = handler;
