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

    howManyCards: 12,

    initialize: function(options){

        this.$el = $('<div></div>').attr('id', 'cards');

        this.cards = options.cards;
        
        this.initCollection();
        this.onResize();

        // listen for keyboard events
        $(window).on('keydown', this.onKeypress.bind(this));
        $(window).on('resize', this.onResize.bind(this));

    },

    // make and add events to card collection 
    initCollection: function(){     

        // when a card is added to the collection, render the CardView
        this.cards.on('add', function(cardModel){
            var cardView = new CardView({model: cardModel});
            // set position before we add it to the page
            cardModel.setCss(this.caclculateCardCss(this.cards.indexOf(cardModel)), true); 
            this.$el.append(cardView.$el);
        }.bind(this));

        // when a card model is selected
        this.cards.on('change:selected', function(cardModel){
            
            // if there are 3 cards selected, check to see if it's a set
            if (this.cards.getSelected().length == 3){
                if (this.cards.isSelectedASet()) {
                    this.showSet(this.cards.getSelected());
                }
                else { 
                    // deselect after some time
                    setTimeout(this.cards.deselectAll.bind(this.cards), 1000);
                }
            } else if (this.cards.getSelected().length > 3){ 
                // prevent a 4th card from being selected
                cardModel.deselect();
            }

        }.bind(this));

        // show cards
        this.addRandomCards();

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

        var windowWidth = $(window).width();

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
        };
    },

    // add one cards at at time
    addRandomCards: function() {

        var addRandomCardInterval = setInterval(function(){
            if (this.cards.length < this.howManyCards){
                this.addRandomCard();
            } else {
                window.clearInterval(addRandomCardInterval);
            }
        }.bind(this), 50);

    },

    // after we get to 12 cards, stop and check to see if there is a set
    addRandomCard: function(index){

        this.cards.addRandomCard(index);

        if (this.cards.length >= this.howManyCards){

            var sets = this.cards.findSets();

            // if there aren't any sets, reshuffle
            if (sets.length === 0){
                console.log('no sets :( ');

                // remove all cards from card collection    
                while(this.cards.length > 0){
                    this.cards.remove(this.cards.at(0));
                }

                this.addRandomCards();
            }

            Backbone.trigger('cardsDealt');
            console.log(sets.join('\n'));
        }

    },

    showSet: function(threeCards){

        Backbone.trigger('setFound');

        this.cards.deselectAll();

        var width = this.$el.width() - (this.cardMargin*2); // width - the margins on the side
        var height = this.$el.height();

        // sort the array by left value so the animation based on position instead of dom order
        threeCards = _.sortBy(threeCards, function(card){
            return card.get('css').left;
        });

        threeCards.forEach(function(card, i){
            card.setCss({ zIndex: 1000 });
        });

        // show a dim div
        this.showDim(function(){

            var top = height/2 - (height/3/2);
            var cardWidth = (width / 3) - (this.cardMargin*2);
            var cardHeight = cardWidth * 1.5;

            var indices = [];

            // animate each card to the center
            threeCards.forEach(function(card, i){

                var left = i * (width / 3) + this.cardMargin; // left + a margin 
        
                card.animate({ 
                    width: cardWidth, 
                    height: cardHeight,
                    zIndex: 1000,
                    left: left, 
                    top: top
                }, { duration: 250 });

                indices.push(this.cards.indexOf(card));

            }.bind(this));


            // after some time, animate the cards away
            setTimeout(function(){

                // this.hideDim();

                var removed = 0;

                // animate away
                var removeInterval = setInterval(function(){

                    var model = threeCards.shift();

                    model.animate({ top: (-1 * cardHeight - this.cardMargin*2) }, {
                        duration: 150,
                        complete: function(){

                            // remove these cards after the animation for each is done
                            this.cards.remove(model);
                            removed++;

                            // after all 3 cards are animated away
                            if (removed >= 3) { 

                                this.hideDim();

                                // sort by number (not string), we need them to be in order when
                                // adding them back, or their position will be miscalculated
                                indices = indices.sort(function(a, b) { return a - b; });
                                // add the cards back
                                var addRandomCardInterval = setInterval(function(){

                                    if (indices.length <= 0) { 
                                        clearInterval(addRandomCardInterval);
                                        return;
                                    }

                                    var index = indices.shift();
                                    this.addRandomCard(index);

                                }.bind(this), 300);
                            }
                        }.bind(this)
                    });
                    
                    if (threeCards.length <= 0){
                        clearInterval(removeInterval);
                    }
                
                }.bind(this), 150);

            }.bind(this), 1000);

        }.bind(this));

        

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
                background: 'rgba(255,255,255,0.9)',
                position: 'fixed',
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

    hideDim: function(callback){

        if (this.dim){
            this.dim.fadeOut(400, callback);
        }

    }



});