var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

// var io = require('socket.io-client');
// var host = window.location.hostname;
// var socket = io.connect('//'+host+':3100'); 

var CardModel = require('./card/CardModel.js');
var CardView = require('./card/CardView.js');
var c = require('./card/CardParams.js');

var nchoosek = require('./util/nchoosek.js');

// var AppRouter = require('./AppRouter.js');


var AppController = function(){

    // this.socket = socket;

    this.showRandomCards = function() {

        var cards = [];

        while (cards.length < 12) {
            var cardModel = new CardModel({
                count: c.getRandomCount(),
                color: c.getRandomColor(),
                shade: c.getRandomShade(),
                shape: c.getRandomShape()
            });

            // is this card already in our collection?
            var dup = cards.some(function(card){
                if (card.isEqual(cardModel)){
                    return true;
                }
            });

            if (!dup){
                cards.push(cardModel);
            } 
            
        };

        cards.forEach(function(cardModel){
            var cardView = new CardView({model: cardModel});
            $('#cards').append(cardView.$el);
            cardView.updateCSS();
        });


        var i = 0;
        var sets = nchoosek(cards, 3, function(threeCards, pointers){
            
            if (threeCards[0].isSet(threeCards[1], threeCards[2])){
                return threeCards;
            }

            return false;
            
          
        });

        console.log(sets.join("\n")); 
    }


    /**
     * Socket events
     */
     
    // on connection to server
    // this.socket.on('connect', function(){
    // });
};





module.exports = AppController;

