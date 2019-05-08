const https = require('https');
//Require other node packages
//const fs = require('fs');

//get this value from the Oauth playground
const refreshToken2='[ENTER REFRESH TOKEN]' 

let accessToken=null; 

//sheet documentID
const documentID='[ENTER SPREADSHEET ID]'  
//name of the sheet.
const sheetName='[ENTER SHEET NAME]';                                          

/*
You get the information above from the URL where you can edit your google sheet.

https://sheets.googleapis.com/v4/spreadsheets/{DOCUMENT ID}/values/{SHEET NAME}

*/

function request(options, body) {
    return new Promise((resolve, reject) => {
        var req = https.request(options, (res) => {
            res.setEncoding('utf8');
            var data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        req.end(body);
    });
    
}

function getAccessToken() {

    var options = {
        host: 'oauth2.googleapis.com',
        path: '/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    
    var body = {
        //created with google oauth playground
        //https://developers.google.com/oauthplayground/
        client_id: "[OAUTH CLIENT ID]",
        client_secret: "[OAUTH CLIENT SECRET]",
        grant_type: 'refresh_token',
        refresh_token: refreshToken2
    };

    return request(options, JSON.stringify(body)).then((data) => {
        accessToken = data.access_token;
    });
}

function googleSheetsReq(options){
	let path='/v4/spreadsheets/'+documentID+'/values/'+ sheetName;
	    path += '?access_token=' + accessToken;

	    var requestOptions = {
        host: 'sheets.googleapis.com',
        path: path,
        method: options.method,
        headers: options.headers,
        parameters: options.parameters
    };
    return request(requestOptions, options.body);

}

//get data on run.
getAccessToken().then( ()=>{
    return googleSheetsReq({
        method: 'GET',
        parameters: 'Form_Responses'
    });   

}).then((data)=>{
process(data);




}).catch((e) => {
if (e.isNotError) {
    console.log(e.message);
} else {
    console.error(e);
}
});

//set refresh interval here
const minutes = 1;
const hours = 0;
const seconds = 0;
const ms = 1000;


const time = (seconds * ms) + (minutes * 60 * ms) + (hours * 60 * 60 * ms);

setInterval(function() {

    getAccessToken().then( ()=>{
            return googleSheetsReq({
                method: 'GET',
                parameters: 'Form_Responses'
            });   

    }).then((data)=>{
        process(data);
	    



    }).catch((e) => {
        if (e.isNotError) {
            console.log(e.message);
        } else {
            console.error(e);
        }
    });

    // interval in milliseconds (1000 = 1 second)
}, time);  

function process(data){
	//DO THINGS HERE
}

