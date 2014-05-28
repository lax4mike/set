var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var CardModel = require('./CardModel.js');


var CardView = module.exports = Backbone.View.extend({

	model: CardModel,

	template: require('./templates/card.handlebars'),

	initialize: function() {

		this.setElement(this.template(this.model.attributes));
		return this;
	},

	render: function(){


	}
	
});
