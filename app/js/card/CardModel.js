var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var CardParams = require('./CardParams.js');

var pill    = require('./templates/pill.handlebars');
var diamond = require('./templates/diamond.handlebars');
var nut     = require('./templates/nut.handlebars');
var shape   = require('./templates/shape.handlebars');


var CardModel = module.exports = Backbone.Model.extend({

	// color
    // count
    // shade
    // shape

    setAttrs: ["count", "color", "shade", "shape"],


	initialize: function(attrs, options){

		// load pill, diamond, or nut
		var svg = require('./templates/' + this.get('shape') + '.handlebars')();

		var rendered = shape({svg: svg});

		var shapes = [];

		for(var i = 0; i < this.get('count'); i++){
			shapes.push(rendered);
		}

		this.set('shapes', shapes.join(''));

		this.set('id', this.setAttrs.map(function(att){
				return this.get(att);
			}.bind(this)).join('-'));

	},


	isEqual: function(model){

		return this.setAttrs.every(function(att){
			if (model.get(att) !== this.get(att)){
				return false;
			}
			return true;
		}.bind(this));

	},

	/** returns true if this card, plus card2 and card3 make a set */
	isSet: function(card2, card3){

		// for each attribute (color, count, shade, shape)
		var card1 = this;
		for (var i = 0; i < this.setAttrs.length; i++) {
			
			var att = this.setAttrs[i];

			// if this attribute is the same for all cards, go on to the next
			if (card1.get(att) === card2.get(att) 
			 && card2.get(att) === card3.get(att)) {
				continue;
			}
			
			// if the attribute is different for all cards, go on to the next
			if (card1.get(att) !== card2.get(att)
			 && card2.get(att) !== card3.get(att)
			 && card3.get(att) !== card1.get(att)) {
				 continue;
			}
			
			// if this attribute is not the same nor different for each card, 
			// this is not a set
			return false;
			
		}

		// if we've gone through all the attributes, without failure, this is a set
		return true;
	},


	toString: function(){


		var card = this.setAttrs.map(function(att){
			return this.get(att);	
		}.bind(this));

		return card.join(" ");
	}


});
