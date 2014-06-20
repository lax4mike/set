var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var CardsCollection = require('./CardsCollection.js');
var CardView  = require('../card/CardView.js');


var CardsView = module.exports = Backbone.View.extend({

    gridColumns: 4,
    cardMargin: 10, // same as margin in card.styl
    // gridRows: 3,

    initialize: function(){

        this.$el = $('<div></div>').attr('id', 'cards');

        this.initCollection();

        // listen for keyboard events
        $(window).on('keydown', this.onKeypress.bind(this));
        $(window).on("resize", this.layoutCollection.bind(this));

    },

    // make and add events to card collection 
    initCollection: function(){

        this.cards = new CardsCollection();     

        // when a card is added to the collection, render the CardView
        this.cards.on('add', function(cardModel){
            var cardView = new CardView({model: cardModel});
            cardView.setCss(this.calculateCardPosition(this.cards.length-1)); 
            this.$el.append(cardView.$el);
            $(window).resize(); // kind of a hack to force updateCSS
        }.bind(this));

        // when a card model changes (ie. selected)
        this.cards.on('change', function(cardModel){
            
            // if there are 3 cards selected, check to see if it's a set
            if (this.cards.getSelected().length >= 3){
                if (this.cards.isSelectedASet()) {
                    console.log("set!");
                }
                else { 
                    console.log('ERRR, not a set');
                }

                // deselect after some time
                setTimeout(this.cards.deselectAll.bind(this.cards), 1000);
            }

        }.bind(this));

        // show 12 cards
        this.addRandomCards(12);

    },

    layoutCollection: function(){

        this.cards.each(function(card, i){

            card.set({ position: this.calculateCardPosition(i) })

        }.bind(this));

    },

    // add one cards at at time
    addRandomCards: function(howMany) {

        this.addRandomCardInterval = window.setInterval(function(){
            this.addRandomCard(howMany);
        }.bind(this), 50);

    },

    calculateCardPosition: function(i){
        
        var column = i % this.gridColumns;
        var row = Math.floor(i * (1/this.gridColumns));

        var cardMargin = this.cardMargin * 2;
        var cardOuter = this.$el.width() / this.gridColumns;
        var cardInner = cardOuter - cardMargin;

        return {
            top: row * ((cardInner * 1.5) + cardMargin),
            left: column * cardOuter
        }
    },

    // after we get to 12 cards, stop
    addRandomCard: function(howMany){

        if (this.cards.length < howMany){
            this.cards.addRandomCard();
        } else {
            window.clearInterval(this.addRandomCardInterval);

            var sets = this.cards.findSets();

            console.log(sets.join("\n"));
        }
    },

    // listen for esc
    onKeypress: function(e){
        // esc
        if (e.keyCode == 27) { 
            this.cards.deselectAll();
        }
    }



});