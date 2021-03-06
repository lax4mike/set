var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var CardModel = require('./CardModel.js');

var pill    = require('./templates/pill.handlebars');
var diamond = require('./templates/diamond.handlebars');
var nut     = require('./templates/nut.handlebars');
var shape   = require('./templates/shape.handlebars');


var CardView = module.exports = Backbone.View.extend({

    model: CardModel,

    stripyId: 'stripies',

    events: {
        'click': 'toggleSelect'
    },

    initialize: function() {

        this.checkForStripies();
        
        this.initTemplate();

        this.cssHistory = [];

        // if the model changes, update the view
        this.listenTo(this.model, 'change:selected', this.updateSelect);
        this.listenTo(this.model, 'change:css', function(model, css){
            this.setCss(css);
        });
        this.listenTo(this.model, 'remove', this.goAway);

        this.model.on('animate', this.animate.bind(this));

        // hack to deal with this https://bugzilla.mozilla.org/show_bug.cgi?id=666464
        // also see .card.select !important
        setTimeout(function(){
            this.$el.removeClass('animate-in');
        }.bind(this), 1000);

        return this;
    },

    initTemplate: function(){

        // load pill, diamond, or nut template and put into shapes
        var svgTemplate = require('./templates/' + this.model.get('shape') + '.handlebars')();
        var renderedSvg = shape({svg: svgTemplate});

        var shapes = [];
        for(var i = 0; i < this.model.get('count'); i++){
            shapes.push(renderedSvg);
        }

        // extra values for card.handlebars
        var extras = {'shapes': shapes.join('')};

        var cardTemplate = require('./templates/card.handlebars');
        this.setElement(cardTemplate(_.extend(this.model.attributes, extras)));

    },

    // this svg only needs to be in the DOM once.
    // if it's already there (from a previous CardView), do nothing
    checkForStripies: function(){
        if (!$('#' + this.stripyId).length) {
            var stripies = require('./templates/stripies.handlebars');
            $('body').prepend(stripies({id: this.stripyId}));
        }
    },

    // pass these events to the model, we're listening change:selected
    toggleSelect: function(){
        this.model.toggleSelect();
    },

    select: function(){
        this.$el.addClass('selected');
    },

    deselect: function(){
        this.$el.removeClass('selected');
    },

    // update the card Css
    setCss: function(params){   
        this.$el.css(params);
    },

    updateSelect: function(){
        (this.model.get('selected')) ? this.select() : this.deselect();
    },

    animate: function(css, options){
        this.$el.animate(css, options);
    },

    goAway: function(){

        this.remove();

    }
    
});
