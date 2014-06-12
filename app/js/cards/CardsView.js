var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var CardsCollection = require('./CardsCollection.js');
var CardView  = require('../card/CardView.js');


var addRandomCardInterval = 0;

var CardsView = module.exports = Backbone.View.extend({

    colors: [      // http://flatuicolors.com/
        '#e74c3c', // alizarin
        '#e67e22', // carrot
        '#f1c40f', // sunflower
        '#1abc9c', // turquoise
        '#2ecc71', // emerald 
        '#3498db', // peter river
        '#9b59b6'  // amethyst
    ],

    initialize: function(){

        this.$el = $('<div></div>').attr('id', 'cards');

        this.initCollection();

        // listen for keyboard events
        $(window).on('keydown', this.onKeypress.bind(this));

    },

    // make and add events to card collection 
    initCollection: function(){

        this.cards = new CardsCollection();     

        // when a card is added to the collection, render the CardView
        this.cards.on('add', function(cardModel){
            var cardView = new CardView({model: cardModel});
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

    // add one cards at at time
    addRandomCards: function(howMany) {

        addRandomCardInterval = window.setInterval(function(){
            this.addRandomCard(howMany);
        }.bind(this), 50);

    },

    // after we get to 12 cards, stop
    addRandomCard: function(howMany){

        if (this.cards.length < howMany){
            this.cards.addRandomCard();
        } else {
            window.clearInterval(addRandomCardInterval);

            var sets = this.cards.findSets();
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