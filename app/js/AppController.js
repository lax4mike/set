var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

// var io = require('socket.io-client');
// var host = window.location.hostname;
// var socket = io.connect('//'+host+':3100'); 

var CardsCollection = require('./cards/CardsCollection.js');
var CardsView       = require('./cards/CardsView.js');
var HintView        = require('./hint/HintView.js');


// var AppRouter = require('./AppRouter.js');


var AppController = function(){

    // this.socket = socket;

    // create cards collection
    var cards = new CardsCollection();

    var cardsview = new CardsView({
        cards: cards
    });

    $('body').append(cardsview.$el);


    var hintview = new HintView({
        cards: cards
    });
    $('body').append(hintview.$el);


    /**
     * Socket events
     */
     
    // on connection to server
    // this.socket.on('connect', function(){
    // });
};





module.exports = AppController;

