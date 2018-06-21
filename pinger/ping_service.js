var request = require('request');

function sendNRequests(count,website,cb){
    var arr = [];
    var currentTime = Date.now();
    var i = 0;
    function sendPing(index){
        // console.log(index)
        if (index >= count){
            cb(arr);
        }else{
            request.get({url:website},function(error,response){
                if(!error && response.statusCode == 200){
                    arr.push(Date.now()-currentTime);
                    currentTime = Date.now();
                    sendPing(index+1);
                }else{
                    console.log(error)
                }
            })
        }
    }
    sendPing(i);
}
//URL to be pinged
var website = 'https://dog.ceo/api/breeds/image/random';
//Number of times to call the api
var count = 1000;
//This will be called when all the requests have been completed
var callback = function(arr){
    console.log(arr);
};

module.exports = sendNRequests;