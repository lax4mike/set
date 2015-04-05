var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var CardView = require('../card/CardView');

var hintTemplate     = require('./templates/hint.handlebars');
var setCountTemplate = require('./templates/setCount.handlebars');
var showSetsTemplate = require('./templates/showSets.handlebars');


var HintView = module.exports = Backbone.View.extend({

    events: {
        'click .get-hint': 'renderSetCount',
        'click .show-me': 'renderSets'
    },

    initialize: function(options){

        this.cards = options.cards;

        this.$el = $('<div></div>').attr('class', 'hint');

        // if the user has found a set, remove the hint
        Backbone.on("setFound", function(){
            this.$el.fadeOut(function(){
                this.$el.empty();
            }.bind(this));
        }.bind(this));

        // if the cards are finished dealing, show hint
        Backbone.on("cardsDealt", function(){
            this.renderHintLink();
        }.bind(this));
    },

    getCountText: function(sets){
        var text = 'There is 1 set';

        if (sets.length > 1){
            text = 'There are ' + sets.length + ' sets';
        }

        return text;
    },

    renderHintLink: function(){
        // fade in the hint link after a second
        this.$el.hide();
        this.$el.html(hintTemplate());
        setTimeout(function(){
            this.$el.fadeIn();
        }.bind(this), 1000);
    },

    renderSetCount: function(e){

        if (e){ e.preventDefault(); }

        var sets = this.cards.findSets();
        
        this.$el.html(setCountTemplate({
            setCountText: this.getCountText(sets)
        }));

    },

    renderSets: function(e){

        if (e){ e.preventDefault(); }

        var sets = this.cards.findSets().map(function(set){
            // return new CardView()   
            return set.map(function(card){
                // make sure we clone the model so it doesn't interfer with the real card
                var cv = new CardView({model: card.clone()});
                cv.$el.addClass('card--mini');
                return cv.$el.prop('outerHTML');
            });
        });

        this.$el.html(showSetsTemplate({
            setCountText: this.getCountText(sets),
            sets: sets
        }));
    }

});
