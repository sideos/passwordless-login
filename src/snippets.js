// Create request to get a credential
const LOGIN_INFO = 17
const DEMOLOGIN_SERVER = http://localhost:8080
const ACCESS_TOKEN = 'the access token'

try {
    const response = await axios.post(SSI_SERVER_V2 + '/v2/createrequestvc', 
        {
            templateid: LOGIN_INFO,
            dataset: { },
            domain: DEMOLOGIN_SERVER+"/request/consumerequest",
            challenge 
        },
        {
            headers: {
            'Content-Type': 'application/json',
            'X-Token': ACCESS_TOKEN
        }})
    let jwtForQrCode = response.data.data.jwt
    // RETURN THIS jwtForQrCode to the front end to display the QRCode.
} catch(e) {
    console.log('Error:', e)
}


// Consume Request 

try {
    const jwt = req.body.jwt        // THE CREDENTIAL FROM THE APP
    let token = req.params.token    // THE CHALLENGE TOKEN
    
    const response = await axios.post(SSI_SERVER_V2 + '/v2/consumerequest', {
        jwt: jwt
    }, {headers: {
        'Content-Type': 'application/json',
        'X-Token': ACCESS_TOKEN
    }})

    // EXAMPLE ON HOW TO CHECK A VALID DATA SET
    let element = response.data.data.payload.verifiableCredential[0]
    // element.credentialSubject contains the value of the credential
    // DO YOUR CHECK HERE
    console.log(element.credentialSubject)

    // IF EVERYTHING IS OK SEND RESPONSE TO WEBSOCKET
    // THIS CHECK DEPENDS ON THE PROOFS IN THE TEMPLATE AND THEIR VALUES
    components.ws.send(JSON.stringify(element))

} catch(e) {
    console.log("ERROR:", e)
}

