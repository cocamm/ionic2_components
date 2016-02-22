import {Directive, Component, ElementRef, NgZone} from 'angular2/core';

import {IONIC_DIRECTIVES, IonicApp} from 'ionic-framework/ionic';

@Directive({
    selector: '[coordinator-layout]'
})
export class CoordinatorLayout {

    private titleZoom: number = 1.5;
    private content: any;
    private coordinatorLayout: HTMLElement;
    private collapseToolbar: HTMLElement;
    private title: any;
    private baseDimensions: any;
    private scroller: HTMLElement;

    constructor(private el: ElementRef, private app: IonicApp) {

    }

    ngAfterViewInit() {
        window.setTimeout(() => {
            var self = this;

            self.coordinatorLayout = self.el.nativeElement;
            self.collapseToolbar = self.coordinatorLayout.querySelector('collapse-toolbar'); 
            self.baseDimensions = self.collapseToolbar.getBoundingClientRect();
            
            self.title = self.collapseToolbar.querySelector('ion-title');

            self.content = self.app.getComponent('content-coordinator');
            
            self.content.addScrollEventListener(function() {
                self.changeToolbarSize(self.collapseToolbar.getBoundingClientRect());
            });
        }, 500);
    }

    changeToolbarSize(dim) {
        if ((dim.bottom - this.baseDimensions.top) > 56) {
            this.title.style.top = ((dim.bottom - this.baseDimensions.top) - 56) + 'px';
            this.collapseToolbar.style.height = (dim.bottom - this.baseDimensions.top) + 'px';
            this.title.style.transform = 'scale(' + ((this.titleZoom - 1) * this.ratio(dim) + 1) + ',' + ((this.titleZoom - 1) * this.ratio(dim) + 1) + ')';
        } else {
            
        }
        
    }
    
    ratio(dim) {
        var r = (dim.bottom - this.baseDimensions.top) / dim.height;
        console.log(dim.bottom);
        console.log(this.baseDimensions.top);
        if (r < 0) return 0;
        if (r > 1) return 1;
        return Number(r.toString().match(/^\d+(?:\.\d{0,2})?/));
    }
}