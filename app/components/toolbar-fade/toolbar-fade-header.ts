import {Directive, Component, ElementRef, NgZone} from 'angular2/core';

import {IONIC_DIRECTIVES, IonicApp} from 'ionic-framework/ionic';

@Component({
    selector: 'toolbar-fade-header',
    template: `
       
        <toolbar-background>
             <toolbar-header-picture><img src="./img/ionic.png" /></toolbar-header-picture>
        </toolbar-background>
        <ion-toolbar toolbar-fake primary></ion-toolbar>
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
    
    private titleZoom: number = 1.5; 
    private baseDimensions: any;
    private legacyToolbarHeight: number;
    private title: HTMLElement; 
    private background: HTMLElement;
    private fakeToolbar: HTMLElement;
    private content: any;
    private toolbar: HTMLElement;
    
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
            
            self.toolbar = header.querySelector('[toolbar-scroll]');
            self.legacyToolbarHeight = self.getDimensions(self.toolbar).height;
            self.title = self.toolbar.querySelector('.toolbar-title');
            self.fakeToolbar = header.querySelector('[toolbar-fake]');
            self.fakeToolbar.style.height = height + 'px';
            self.fakeToolbar.style.minHeight = self.legacyToolbarHeight+ 'px';
            self.handleStyle(self.baseDimensions);
            
            self.content = self.app.getComponent('toolbar-example');
            
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
        if (difference >= 56) {            
            this.fakeToolbar.style.height = difference + 'px';            
            this.title.style.transform = 'translate3d(0,' + (difference - this.legacyToolbarHeight) + 'px,0) ' + 
                        'scale(' + ((this.titleZoom - 1) * this.ratio(dim) + 1) + ',' + ((this.titleZoom - 1) * this.ratio(dim) + 1) + ')';
        } else {
            this.fakeToolbar.style.height = '56px';
            this.title.style.transform = 'translate3d(0,0,0)  scale(1,1)';
            this.fakeToolbar.style.position = 'relative';
            this.toolbar.style.position = 'relative';             
        }
        
        let toolbg = this.fakeToolbar.querySelector('.toolbar-background');
        if(difference <= 130) {
            if(!toolbg.classList.contains('fill')) {
                this.fakeToolbar.querySelector('.toolbar-background').classList.add('fill');
            }
        } else {
            this.fakeToolbar.querySelector('.toolbar-background').classList.remove('fill');
        }
    }
      
    ratio(dim) {
        var r = (dim.bottom - this.baseDimensions.top - 56) / (dim.height);
        if (r < 0) return 0;
        if (r > 1) return 1;
        console.log(r);
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

