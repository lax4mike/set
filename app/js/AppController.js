var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

// var io = require('socket.io-client');
// var host = window.location.hostname;
// var socket = io.connect('//'+host+':3100'); 


var CardsView = require('./cards/CardsView.js');


// var AppRouter = require('./AppRouter.js');


var AppController = function(){

    // this.socket = socket;

    var cardsview = new CardsView();

    $('body').append(cardsview.$el);


    /**
     * Socket events
     */
     
    // on connection to server
    // this.socket.on('connect', function(){
    // });
};





module.exports = AppController;

