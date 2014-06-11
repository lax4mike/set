var $ = require('jquery');

$(document).ready(function(){
	
	var AppController = require('./AppController.js');

	var app = new AppController();	

	app.showRandomCards();
	
});


