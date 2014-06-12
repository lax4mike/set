
module.exports = function(n, k, callback){

    /**
     *  callback( (array) combo)
     *  if the result is false, this combo is not added to the collection
     */
    if (typeof callback !== 'function'){
        callback = function(combo){
            return combo;
        }
    }

    var combos = [];
    
    // Set up array to hold k pointers
    var pointers = [];
    for (var i = 0; i < k; i++) {
        pointers[i] = i;
    }
        

    // go until the left most pointer is as far right as it can get
    while (pointers[0] < n.length - k) {
        
        // check to see if all pointers are in range (pointing at an 
        // index in the n array).
        // start from the right so we can check the pointers to the left 
        // if they are moved out of bounds
        for(var i = k-1; i >= 0; i--){
            
            // if this pointer is out of range...
            if (pointers[i] >= (n.length - (k-i)) + 1 ){
                
                // move the pointer to the left up by 1
                pointers[i-1]++;

                // reset the pointers to the right of that pointer
                for (var j = i; j < k; j++){
                    pointers[j] = pointers[j-1] + 1;
                }
            }
            
        }
        
        var objs = pointers.map(function(num){
            return n[num];
        });
        
        var result = callback.call(this, objs.slice(0), pointers.slice(0));

        if (result !== false){
            combos.push(objs.slice(0)); 
        }   
        
        
        // increase the right most pointer by one
        pointers[k-1]++;
    }
    
    
    return combos;

}