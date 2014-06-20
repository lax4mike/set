var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var CardParams = require('./CardParams.js');

var CardModel = module.exports = Backbone.Model.extend({

    // count
    // color
    // shade
    // shape

    // position {top: 0, left: 0}

    initialize: function(attrs, options){

        this.set('id', CardParams.setAttrs.map(function(att){
                            return this.get(att);
                        }.bind(this)).join('-'));

    },

    toggleSelect: function(){
        this.set({ selected: !this.get("selected") });
    },

    deselect: function(){
        this.set({ selected: false });
    },

    select: function(){
        this.set({ selected: true });
    },

    // does this model have the same setAttrs as another model
    isEqual: function(model){

        return CardParams.setAttrs.every(function(att){
            if (model.get(att) !== this.get(att)){
                return false;
            }
            return true;
        }.bind(this));

    },

    toString: function(){

        var card = CardParams.setAttrs.map(function(att){
            return this.get(att);   
        }.bind(this));

        return card.join(" ");
    }


});
