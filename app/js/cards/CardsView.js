var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var CardsCollection = require('./CardsCollection.js');
var CardView  = require('../card/CardView.js');


var CardsView = module.exports = Backbone.View.extend({

    gridColumns: 4,
    gridRows: 3,
    cardMargin: 10, // same as margin in card.styl

    initialize: function(){

        
        this.$el = $('<div></div>').attr('id', 'cards');
        
        this.initCollection();
        this.onResize();

        // listen for keyboard events
        $(window).on('keydown', this.onKeypress.bind(this));
        $(window).on("resize", this.onResize.bind(this));

    },

    // make and add events to card collection 
    initCollection: function(){

        this.cards = new CardsCollection();     

        // when a card is added to the collection, render the CardView
        this.cards.on('add', function(cardModel){
            var cardView = new CardView({model: cardModel});
            // set position before we add it to the page
            cardModel.setCss(this.caclculateCardCss(this.cards.length-1), true); 
            this.$el.append(cardView.$el);
        }.bind(this));

        // when a card model is selected
        this.cards.on('change:selected', function(cardModel){
            
            // if there are 3 cards selected, check to see if it's a set
            if (this.cards.getSelected().length >= 3){
                if (this.cards.isSelectedASet()) {
                    this.showSet(this.cards.getSelected());
                }
                else { 
                    console.log('ERRR, not a set');
                     // deselect after some time
                    setTimeout(this.cards.deselectAll.bind(this.cards), 1000);
                }
            }

        }.bind(this));

        // show 12 cards
        this.addRandomCards(12);

    },

    // calculate some useful dimensions
    getCardDimensions: function(){

        var dim = {};
            
        dim.margin =  this.cardMargin * 2;
        dim.outerW = this.$el.width() / this.gridColumns;
        dim.innerW = dim.outerW - dim.margin;
        dim.innerH = (dim.innerW * 1.5);
        dim.outerH = dim.innerH + dim.margin;
        
        return dim;

    },

    onResize: function(){

        var windowWidth = $(window).width()

        // resize .cards container
        this.$el.width(function(){
            
            if (windowWidth >= 480){
                return 480;
            }

            return windowWidth;

        });

        this.$el.height(function(){

            var dim = this.getCardDimensions();

            return (dim.outerH * this.gridRows);

        }.bind(this));


        // layout cards
        this.cards.each(function(card, i){
            card.set({ 
                css: this.caclculateCardCss(i)
            });
        }.bind(this));

    },

    caclculateCardCss: function(i){
        
        var column = i % this.gridColumns;
        var row = Math.floor(i * (1/this.gridColumns));

        var dim = this.getCardDimensions();

        return {
            top: row * (dim.innerH + dim.margin),
            left: column * dim.outerW,
            width: dim.innerW,
            height: dim.innerH,
            zIndex: 0
        }
    },

    // add one cards at at time
    addRandomCards: function(howMany) {

        this.addRandomCardInterval = window.setInterval(function(){
            this.addRandomCard(howMany);
        }.bind(this), 50);

    },

    showSet: function(threeCards){

        this.cards.deselectAll();

        var width = this.$el.width() - (this.cardMargin*2); // width - the margins on the side
        var height = this.$el.height();

        // sort the array by left value so the animation based on position instead of dom order
        threeCards = _.sortBy(threeCards, function(card){
            return card.get('css').left;
        });

        threeCards.forEach(function(card, i){
            card.setCss({ zIndex: 1000 })
        });

        // show a dim div
        this.showDim(function(){
            // animate each card
            threeCards.forEach(function(card, i){

                var left = i * (width / 3) + this.cardMargin; // left + a margin 
                var top = height/2 - (height/3/2);
                var cardWidth = (width / 3) - (this.cardMargin*2);

                card.setCss({ 
                    width: cardWidth, 
                    height: cardWidth * 1.5,
                    zIndex: 1000,
                    left: left, 
                    top: top
                });

                // after some time, put the cards back
                setTimeout(function(){
                    card.revertCss();
                    this.hideDim();
                }.bind(this), 2000);

            }.bind(this));
        }.bind(this));

        

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
    },

    showDim: function(callback){

        if (!this.dim){
            this.dim = $('<div></div>').css({
                zIndex: 500,
                background: "rgba(255,255,255,0.9)",
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            })
            .hide()
            .appendTo($('body'));
            
        }

        this.dim.fadeIn(400, callback);

    },

    hideDim: function(){

        if (this.dim){
            this.dim.fadeOut();
        }

    }



});