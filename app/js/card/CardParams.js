var CardParams = module.exports = {

    // Colors
    colors: {
        RED : {
            value: '#E74C3C',
            label: 'red'
        },
        PURPLE : {
            value: '#9B59B6',
            label: 'purple'
        },
        GREEN : {
            value: '#2ECC71',
            label: 'green'
        }
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
    },


    

};