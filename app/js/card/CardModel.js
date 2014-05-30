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

	initialize: function(params){

		// load pill, diamond, or nut
		var svg = require('./templates/' + this.get('shape') + '.handlebars')();

		var rendered = shape({svg: svg});

		var shapes = [];

		for(var i = 0; i < this.get('count'); i++){
			shapes.push(rendered);
		}

		this.set('shapes', shapes.join(''));


	},

	isEqual: function(model){

		return ["count", "color", "shade", "shape"].every(function(att){
			if (model.get(att) !== this.get(att)){
				return false;
			}
			return true;
		}.bind(this));

	}


});
