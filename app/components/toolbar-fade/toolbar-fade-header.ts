import {Directive, Component, ElementRef, NgZone} from 'angular2/core';

import {IONIC_DIRECTIVES, IonicApp} from 'ionic-framework/ionic';

@Component({
    selector: 'toolbar-fade-header',
    template: `
        <toolbar-background></toolbar-background>
        <ion-toolbar toolbar-fake secondary></ion-toolbar>
        <ion-toolbar toolbar-scroll transparent>
            <ion-buttons left>
                <button>
                    <ion-icon name="arrow-back"></ion-icon>
                </button>
            </ion-buttons>
            <ion-title>Ionic Title</ion-title>
            <ion-buttons end>
                <button> 
                    <ion-icon name="more"></ion-icon>
                </button>
            </ion-buttons>
        </ion-toolbar>
    `,
    directives: [IONIC_DIRECTIVES]
})
export class ToolbarFadeHeader {
    
    private titleZoom: number = 1.8;
    private baseDimensions: any;
    private legacyToolbarHeight: number;
    private title: HTMLElement; 
    private background: HTMLElement;
    private fakeToolbar: HTMLElement;
    private content: any;
    
    constructor(private el: ElementRef, private _zone : NgZone, private app: IonicApp) { 
              
    }
    
    ngAfterViewInit() {   
        var self = this;
        
        window.setTimeout(() => {
            var header = self.el.nativeElement;
            var width = header.getBoundingClientRect().width;
            var height = header.getBoundingClientRect().height;
            self.baseDimensions = { top: 0, bottom: height, left: 0, right: width, width: width, height: height };
            self.background = header.querySelector('toolbar-background');
            
            var toolbar = header.querySelector('[toolbar-scroll]');
            self.legacyToolbarHeight = self.getDimensions(toolbar).height;
            self.title = toolbar.querySelector('.toolbar-title');
            self.fakeToolbar = header.querySelector('[toolbar-fake]');
            self.fakeToolbar.style.height = height + 'px';
            self.fakeToolbar.style.minHeight = self.legacyToolbarHeight+ 'px';
            self.handleStyle(self.baseDimensions);
            
            self.content = self.app.getComponent('toolbar-example');
            
            
            self.content.addTouchMoveListener(function() {
                //self.reloadStyles();
            });
            
            self.content.addScrollEventListener(function() {
                 self.reloadStyles();
            });
            
        });
    }
    
    reloadStyles() {
        this.handleStyle(this.el.nativeElement.getBoundingClientRect());
    }
    
    handleStyle(dim) {
        let difference = dim.bottom - this.baseDimensions.top;
        if (difference > 56) {
            
            //this.title.style.top = (difference - this.legacyToolbarHeight) + 'px';
            this.fakeToolbar.style.height = difference + 'px';
            //this.title.style.transform = 'scale(' + ((this.titleZoom - 1) * this.ratio(dim) + 1) + ',' + ((this.titleZoom - 1) * this.ratio(dim) + 1) + ')';
            this.title.style.top = (difference - this.legacyToolbarHeight) + 'px';
            this.title.style.transform = 'scale(' + ((this.titleZoom - 1) * this.ratio(dim) + 1) + ',' + ((this.titleZoom - 1) * this.ratio(dim) + 1) + ')';
        } else {            
            this.title.style.top = '0px';
            this.fakeToolbar.style.height = '56px';
            this.title.style.transform = 'scale(1,1)';
            //this.content.scrollTo(0, 0, 0);
        }
        //console.log("diff: " + difference);
        //console.log(difference - this.legacyToolbarHeight);
        if (difference - this.legacyToolbarHeight > 0) {
            
        }
        // if ((dim.bottom - baseDimensions.top) > legacyToolbarH * 2 && fab.hasClass('hide')) {
        //     //fab.removeClass('hide');
        // }
        //this.background.style.opacity = (this.ratio(dim)).toString();
        //this.fakeToolbar.style.opacity = (1 - this.ratio(dim)).toString();
        /* Uncomment the line below if you want shadow inside picture (low performance) */
        //element.css('box-shadow', '0 -'+(dim.height*3/4)+'px '+(dim.height/2)+'px -'+(dim.height/2)+'px rgba(0,0,0,'+ratio(dim)+') inset');
    }
      
    ratio(dim) {
        var r = (dim.bottom - this.baseDimensions.top) / dim.height;
        //console.log(dim.bottom);
        console.log(r);
        if (r < 0) return 0;
        if (r > 1) return 1;
        return Number(r.toString().match(/^\d+(?:\.\d{0,2})?/));
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

