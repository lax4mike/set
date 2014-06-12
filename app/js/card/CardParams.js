var CardParams = module.exports = {

    // Colors
    colors: {
        RED    : 'red',
        PURPLE : 'purple',
        GREEN  : 'green'
    },  

    // Counts
    counts: {
        ONE     : 1,
        TWO     : 2,
        THREE   : 3
    },

    // Shades
    shades: {
        SOLID   : 'solid',
        STRIPED : 'striped',
        HOLLOW  : 'hollow'
    },
    
    // Shapes
    shapes: {
        PILL    : 'pill',
        NUT     : 'nut',
        DIAMOND : 'diamond'
    },

    setAttrs: ["count", "color", "shade", "shape"],

    getRandom: function(obj){
        var keys = Object.keys(obj);
        return obj[keys[Math.floor(Math.random() * keys.length)]];
    },

    getRandomColor: function(){
        return this.getRandom(this.colors);
    },
    getRandomCount: function(){
        return this.getRandom(this.counts);
    },
    getRandomShade: function(){
        return this.getRandom(this.shades);
    },
    getRandomShape: function(){
        return this.getRandom(this.shapes);
    }    

};