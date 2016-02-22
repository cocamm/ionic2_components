import {Directive, Component, ElementRef, NgZone} from 'angular2/core';

import {IONIC_DIRECTIVES, IonicApp} from 'ionic-framework/ionic';

@Component({
    selector: 'toolbar-fade-header',
    template: `
        <div class="parallax-container">
            <div class="parallax"><img src="./img/pao.jpg"></div>
        </div>
        <ion-toolbar toolbar-scroll primary>
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
    private content: any;
    private toolbar: HTMLElement;
    private parallax: HTMLElement;
    
    constructor(private el: ElementRef, private _zone : NgZone, private app: IonicApp) { 
              
    }
    
    ngAfterViewInit() {   
        var self = this;
        
        window.setTimeout(() => {
            var header = self.el.nativeElement;
            var width = header.getBoundingClientRect().width;
            var height = header.getBoundingClientRect().height;
            
            self.baseDimensions = { top: 0, bottom: height, left: 0, right: width, width: width, height: height };
            self.toolbar = header.querySelector('[toolbar-scroll]');
            self.parallax = header.querySelector('.parallax img');
            self.background = self.toolbar.querySelector('.toolbar-background');
            self.legacyToolbarHeight = self.getDimensions(self.toolbar).height;
            self.title = self.toolbar.querySelector('ion-title');        
            self.handleStyle(self.baseDimensions);
            self.content = self.app.getComponent('toolbar-example');
            
            self.content.addScrollEventListener(function() {
                 self.reloadStyles();
            });
            
        }, 250);
    }
    
    reloadStyles() {        
        this.handleStyle(this.el.nativeElement.getBoundingClientRect());
    }
    
    handleStyle(dim) {
        
        let difference = dim.bottom - this.baseDimensions.top;
        console.log("dim.height", difference);
        var parallax_dist = this.baseDimensions.height - difference;
        console.log("parallax_dist", parallax_dist);
        var parallax = Math.round((parallax_dist * (difference / (difference + this.baseDimensions.height))));
        console.log("parallax", parallax);
        
        if (difference >= 56) {            
            this.background.style.height = difference + 'px';            
            this.title.style.transform = 'translate3d(0,' + (difference - this.legacyToolbarHeight) + 'px,0) ' + 
                        'scale(' + ((this.titleZoom - 1) * this.ratio(dim) + 1) + ',' + ((this.titleZoom - 1) * this.ratio(dim) + 1) + ')';
            this.toolbar.style.transform = 'translate3d(0,0,0)';
            this.parallax.style.transform = 'translate3d(-50%,' + parallax + 'px,0)';
        } else {
            this.background.style.height = '56px';
            this.title.style.transform = 'translate3d(0,0,0)  scale(1,1)';
            this.toolbar.style.transform = 'translate3d(0,' + (difference - this.legacyToolbarHeight) + 'px,0)';
        }
        
        if(difference <= 130) {
            if(!this.background.classList.contains('fill')) {
                this.background.classList.add('fill');
            }
        } else {
            this.background.classList.remove('fill');
        }
        
    }
      
    ratio(dim) {
        var r = (dim.bottom - this.baseDimensions.top - 56) / (dim.height);
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
            
            return { width: 0, height: 0, left: 0, top: 0 };
        }
    }
}

