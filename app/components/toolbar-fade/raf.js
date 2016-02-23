(function() {
    'use strict';
    
    let vendors = ['ms', 'moz', 'webkit', 'o'];
    let lastTime = 0;

    for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        let vendor = vendors[x];
        window.requestAnimationFrame  = window[`${vendor}RequestAnimationFrame`];
        window.cancelAnimationFrame   = window[`${vendor}CancelAnimationFrame`] || window[`${vendor}CancelRequestAnimationFrame`];
    }

    if(!window.requestAnimationFrame){
      window.requestAnimationFrame = (callback) => {
          let currTime    = Date.now();
          let timeToCall  = Math.max(0, 16 - (currTime - lastTime));
          let id          = window.setTimeout(() => callback(currTime + timeToCall), timeToCall);

          lastTime = currTime + timeToCall;
          return id;
      };
    }

    if(!window.cancelAnimationFrame)
      window.cancelAnimationFrame = (id) => clearTimeout(id);

}());