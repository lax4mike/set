var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

// var io = require('socket.io-client');
// var host = window.location.hostname;
// var socket = io.connect('//'+host+':3100'); 

var CardModel = require('./card/CardModel.js');
var CardView = require('./card/CardView.js');
var c = require('./card/CardParams.js');

// var AppRouter = require('./AppRouter.js');


var AppController = function(){

    // this.socket = socket;

    [0,1,2,3,4,5,6,7,8,9,10,11].forEach(function(i){

        var cardModel = new CardModel({
            color: c.getRandomColor(),
            count: c.getRandomCount(),
            shade: c.getRandomShade(),
            shape: c.getRandomShape()
        });



        var cardView = new CardView({model: cardModel});


        $('.cards').append(cardView.$el);

    });


    

    /**
     * Socket events
     */
     
    // on connection to server
    // this.socket.on('connect', function(){
    // });
};





module.exports = AppController;

