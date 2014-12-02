var $ = require('jquery');
var attachFastClick = require('fastclick');

$(document).ready(function(){
    
    var AppController = require('./AppController.js');

    var app = new AppController();  

	attachFastClick(document.body);	    
});


