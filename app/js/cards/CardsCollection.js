var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var CardModel = require('../card/CardModel.js');
var CardView  = require('../card/CardView.js');
var c         = require('../card/CardParams.js');
var nchoosek  = require('../util/nchoosek.js');

var CardsCollection = module.exports = Backbone.Collection.extend({

	model: CardModel,

	addRandomCard: function(){

		var cardModel = new CardModel({
            count: c.getRandomCount(),
            color: c.getRandomColor(),
            shade: c.getRandomShade(),
            shape: c.getRandomShape()
        });

        // is this card already in our collection?
        var dup = this.some(function(card){
            if (card.isEqual(cardModel)){
                return true;
            }
        });

        if (!dup){
            this.push(cardModel);
        } 

        return cardModel;
	},

	findSets: function(){

		var i = 0;
        var sets = nchoosek(this.models, 3, function(threeCards, pointers){
            
            if (threeCards[0].isSet(threeCards[1], threeCards[2])){
                return threeCards;
            }

            return false;

        });

        console.log(sets.join("\n")); 

        return sets;
        
	}


})