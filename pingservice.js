var request = require('request');
var statusCodes = require('http').STATUS_CODES;

function Ping(opts){
    this.website = 'https://dog.ceo/api/breeds/image/random';
    this.timeout = 1;
    this.handle = null;
    this.init(opts);
}

Ping.prototype = {
    init : function(opts){
        var self = this;
        self.website = opts.website;
        self.timeout = opts.timeout;
        self.start();
    },
    start : function() {
        var self = this;
        var time = Date.now();
        console.log('Loading ' + self.website + " Time "+time+'\n');
        self.handle = setInterval(function(){
            self.ping();
        },self.timeout);
    },
    isOK : function(time){
        console.log(time)
        return time        
    },
    isNotOk : function(){
        console.log("Unable to fetch");
    },
    ping : function(){
        var self = this;
        try {
            var currentTime = Date.now();
            request.get({
                    url : self.website,
                    time : true
                },function(error,res,body){
                if(!error && res.statusCode == 200){
                    self.isOK(Date.now() - currentTime);
                }
                else if(error){
                    console.log(error)
                    self.isNotOk();
                }else{
                    self.isNotOk();
                }
            });
        }
        catch(err){
            console.log(err);
            self.isNotOk();
        }
    },
    stop : function(){
        clearInterval(this.handle);
        this.handle = null;
    }
}

var pinger = new Ping({
    website : 'https://dog.ceo/api/breeds/image/random',
    timeout : 1000
});
console.log(pinger)