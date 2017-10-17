
function Rndm(seed) {
    this.seed = seed;
    this.currentSeed = seed;
}

Rndm.prototype.setSeed = function(newSeed) {
    this.seed = newSeed;
    this.currentSeed = newSeed;
};

Rndm.prototype.random = function() {
    return (this.currentSeed = (this.currentSeed * 16807) % 2147483647)/0x7FFFFFFF+0.000000000233;
};


//    public function float(min:Number,max:Number=NaN):Number { if (isNaN(max)) { max = min; min=0; } return random()*(max-min)+min; }
//    // boolean(); // returns true or false (50% chance of true)
//    // boolean(0.8); // returns true or false (80% chance of true)
//    public function boolean(chance:Number=0.5):Boolean {return (random() < chance);    }
//    // integer(50); // returns an integer between 0-49 inclusive
//    // integer(20,50); // returns an integer between 20-49 inclusive
//    public function integer(min:Number,max:Number=NaN):int {if (isNaN(max)) { max = min; min=0; } return Math.floor(float(min,max));    }
//    // reset(); // resets the number series, retaining the same seed
//    public function reset():void {_seed = _currentSeed;}}


