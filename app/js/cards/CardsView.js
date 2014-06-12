var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var CardsCollection = require('./CardsCollection.js');
var CardView  = require('../card/CardView.js');



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

        this.cards = new CardsCollection();
        
        this.cards.on('add', function(cardModel, b, c){
            var cardView = new CardView({model: cardModel});
            this.$el.append(cardView.$el);
            $(window).resize(); // kind of a hack to force updateCSS
        }.bind(this));

        this.addRandomCards();

        $(window).on('keypress', this.onKeypress.bind(this));

        

    },

    addRandomCard: function(){
        if (this.cards.length < 12){
            this.cards.addRandomCard();
        } else {
            clearTimeout(this.addRandomCardTimeout);
        }
    },

    addRandomCards: function() {

        this.addRandomCardInterval = setInterval(this.addRandomCard.bind(this), 50);

        this.cards.forEach(function(cardModel){
            
        }.bind(this));

        var sets = this.cards.findSets();

    },


    onKeypress: function(){

    }



});