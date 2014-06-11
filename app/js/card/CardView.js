var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var CardModel = require('./CardModel.js');


var CardView = module.exports = Backbone.View.extend({

	model: CardModel,

	template: require('./templates/card.handlebars'),

	stripyId: 'stripies',

	initialize: function() {

		this.checkForStripies();

		$(window).on("resize", this.updateCSS.bind(this));

		this.setElement(this.template(this.model.attributes));

		return this;
	},

	checkForStripies: function(){
		if (!$("#" + this.stripyId).length) {
			var stripies = require('./templates/stripies.handlebars');
			$("body").prepend(stripies({id: this.stripyId}));
		}

	},

	// calculate the height based on the width so it keeps the aspect ratio
	// can't really do with css... :(  
	updateCSS: function(){
		var width = this.$el.width();
		this.$el.css('height', width*1.5);
	},

	render: function(){

	}
	
});
