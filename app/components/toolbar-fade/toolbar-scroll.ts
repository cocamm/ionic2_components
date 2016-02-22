import {Directive, Component, ElementRef, NgZone} from 'angular2/core';

import {IONIC_DIRECTIVES, IonicApp} from 'ionic-framework/ionic';

@Component({
    selector: 'toolbar-scroll',
    template: `
        <ng-content select="ion-toolbar"></ng-content>
    `
})
export class ToolbarScroll {
    private content: any;
    private scrollToolbar: any;
    private toolbar: any;
    private title: any;
    private baseDimensions: any;
    private scroller: HTMLElement;

    constructor(private el: ElementRef, private app: IonicApp) {

    }

    ngAfterViewInit() {
        var self = this;

        self.scrollToolbar = self.el.nativeElement;
        self.toolbar = self.scrollToolbar.querySelector('.toolbar');
        
        //self.title = self.scrollToolbar.querySelector('.toolbar-title');

        self.baseDimensions = self.scrollToolbar.getBoundingClientRect();
        console.log(self.baseDimensions);
        //self.reloadPosition(self.baseDimensions);

        self.content = self.app.getComponent('toolbar-example');
        self.scroller = self.content.elementRef.nativeElement.querySelector('scroll-content');
        self.content.addTouchMoveListener(function() {
            self.reloadPosition(self.el.nativeElement.getBoundingClientRect());
        });

        self.content.addScrollEventListener(function() {
            self.reloadPosition(self.el.nativeElement.getBoundingClientRect());
        });
    }

    reloadPosition(dimensions) {
        let difference = dimensions.bottom - this.baseDimensions.top;
        
        console.log(this.scroller.scrollTop);
        //console.log(this.content.elementRef.nativeElement.getBoundingClientRect());
        this.toolbar.style.transform = 'translate3d(0px,' + (this.scroller.scrollTop*1) + 'px,0px)'; 
        
        this.scrollToolbar.style.transform = 'translate3d(0px,' + (this.scroller.scrollTop * 0.01) * -1 + 'px,0px)'; 
        
       // this.scrollToolbar.style.transform = 'translate3d(0px,' + dimensions.top + 'px,0px)'; 
        
        
        
        if ((difference) > 56) {
            //this.scrollToolbar.classList.remove('top'); 
            //this.title.style.transform = 'translateY(' + ((difference) - 56) + 'px)';
            
            //this.toolbar.style.height = (difference) + 'px'; 
            
            /*if(difference == 205) {
                this.scrollToolbar.style.transform = 'translate3d(0px,0px,0px)'; 
                this.toolbar.style.transform = 'translate3d(0px,0px,0px)'; 
            } else {
                this.scrollToolbar.style.transform = 'translate3d(0px,-' + difference + 'px,0px)'; 
                this.toolbar.style.transform = 'translate3d(0px,' + difference + 'px,0px)'; 
            }*/
                   
        } else {
           // this.scrollToolbar.classList.add('top');
            //this.content.elementRef.nativeElement.classList.add('toolbar-top');
        } 
        
        
    }
    
    getDimensions(ele: HTMLElement) {
        let dimensions: any;
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