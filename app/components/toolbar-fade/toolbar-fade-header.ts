import {Directive, ElementRef} from 'angular2/core';

import {IONIC_DIRECTIVES} from 'ionic-framework/ionic';

@Directive({
    selector: '[toolbar-fade-header]'
})
export class ToolbarFadeHeader {
    
    constructor(el: ElementRef) {
        
       var baseDimensions = this.getDimensions(el.nativeElement);
       console.log(baseDimensions);
    }
    
    
    getDimensions(ele: HTMLElement) {
        let dimensions: any;
        console.log(ele.offsetWidth);
        if (ele.offsetWidth && ele.offsetHeight) {
            dimensions = {
                width: ele.offsetWidth,
                height: ele.offsetHeight,
                left: ele.offsetLeft,
                top: ele.offsetTop
            }
            return dimensions;
        } else {
            // do not cache bad values
            return { width: 0, height: 0, left: 0, top: 0 };
        }
    }
}

