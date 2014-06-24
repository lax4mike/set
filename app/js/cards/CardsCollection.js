var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var CardModel  = require('../card/CardModel.js');
var CardView   = require('../card/CardView.js');
var CardParams = require('../card/CardParams.js');
var nchoosek   = require('../util/nchoosek.js');

var CardsCollection = module.exports = Backbone.Collection.extend({

    model: CardModel,

    sets: [],

    // add a random card that isn't a duplicate
    addRandomCard: function(index){

        var cardModel = new CardModel({
            count: CardParams.getRandomCount(),
            color: CardParams.getRandomColor(),
            shade: CardParams.getRandomShade(),
            shape: CardParams.getRandomShape()
        });

        // is this card already in our collection?
        var dup = this.some(function(card){
            if (card.isEqual(cardModel)){
                return true;
            }
        });

        // if it's not a dup, add it, otherwise, try again (yeah, recursion!)
        if (dup){
            return this.addRandomCard(index);
        }

        if (index != undefined){
            this.add(cardModel, {at: index});
        } else{
            this.push(cardModel);
        }

        return cardModel;
    },

    // given the cards in this collection, return an array of sets
    // uses my awesome nchoosek algorithm
    findSets: function(){

        var i = 0;
        this.sets = nchoosek(this.models, 3, function(threeCards, pointers){

            if (this.isSet(threeCards)){
                return threeCards;
            }

            return false;

        }.bind(this));

        return this.sets;
        
    },

    // check to see if the selected cards are a set
    isSelectedASet: function(){
        return this.isSet(this.getSelected());
    },


    // given an array of cards, return true if it's a set
    isSet: function(cards){

        if (cards.length != 3){
            console.error("isSet has to be given 3 cards");
        }

        // for each attribute (color, count, shade, shape)
        for (var i = 0; i < CardParams.setAttrs.length; i++) {
            
            var att = CardParams.setAttrs[i];

            // if this attribute is the same for all cards, go on to the next
            if (cards[1].get(att) === cards[2].get(att) 
             && cards[2].get(att) === cards[0].get(att)) {
                continue;
            }
            
            // if the attribute is different for all cards, go on to the next
            if (cards[1].get(att) !== cards[2].get(att)
             && cards[2].get(att) !== cards[0].get(att)
             && cards[0].get(att) !== cards[1].get(att)) {
                 continue;
            }
            
            // if this attribute is not the same nor different for each card, 
            // this is not a set
            return false;
            
        }

        // if we've gone through all the attributes, without failure, this is a set
        return true;
    },

    // return an array of CardModels of all the selected cards
    getSelected: function(){
        return this.where({selected: true});
    },

    // deselect all the selected CardModels
    deselectAll: function(){
        _.each(this.getSelected(), function(card){
            card.deselect();
        }.bind(this));
    }


});
