exports.handler = function handler(event, context, callback) {
    console.log("*** NEWSLETTER ***")
    const json = JSON.parse(event.body);
    console.log(`${json.email} added to mailing list`)
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({ flash: "Subscribed to email updates!" })
    })
}