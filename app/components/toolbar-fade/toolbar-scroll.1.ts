import {Directive, Component, ElementRef, NgZone} from 'angular2/core';

import {IONIC_DIRECTIVES, IonicApp, Content} from 'ionic-framework/ionic';

import './raf';


@Component({
    selector: 'parallax',
    template: `
        <div class="parallax-container">
            <div class="parallax"><img src="./img/pao.jpg"></div>
        </div>`
})
class Parallax {
    constructor(private el: ElementRef) { }
}

@Component({
    selector: 'toolbar-fade-header',
    template: `
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
    private content: Content;
    private toolbar: HTMLElement;
    private parallax: HTMLElement;
    private ticking = false;

    private parallaxHtml: string = `<div class="parallax-container">
                                        <div class="parallax"><img src="./img/pao.jpg"></div>
                                    </div>`;

    constructor(private el: ElementRef, private app: IonicApp) {
    }

    ngOnInit() {
        this.toolbar = this.el.nativeElement.querySelector('[toolbar-scroll]');
        this.background = this.toolbar.querySelector('.toolbar-background');
        this.background.innerHTML = this.parallaxHtml;
        this.parallax = this.background.querySelector('.parallax img');
        this.title = this.toolbar.querySelector('ion-title');
        this.content = this.app.getRegisteredComponent(Content);
    }

    ngAfterViewInit() {
        var self = this;

        window.setTimeout(() => {
            
            let rgb = this.getAverageRGB(this.parallax);
            this.background.style.background = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 1)';
            
            var header = self.el.nativeElement;
            var width = header.getBoundingClientRect().width;
            var height = header.getBoundingClientRect().height;
            self.baseDimensions = { top: 0, bottom: height, left: 0, right: width, width: width, height: height };

            self.legacyToolbarHeight = self.getDimensions(self.toolbar).height;
            self.handleStyle(self.baseDimensions);

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
        var parallax_dist = this.baseDimensions.height - difference;
        var parallax = Math.round((parallax_dist * (difference / (difference + this.baseDimensions.height))));

        if (difference >= 56) {
            this.background.style.transform = 'translate3d(0,' + (difference - this.baseDimensions.height) + 'px,0)';
            this.title.style.transform = 'translate3d(0,' + (difference - this.legacyToolbarHeight) + 'px,0) ' +
                'scale(' + ((this.titleZoom - 1) * this.ratio(dim) + 1) + ',' + ((this.titleZoom - 1) * this.ratio(dim) + 1) + ')';
            this.toolbar.style.transform = 'translate3d(0,0,0)';
            this.parallax.style.transform = 'translate3d(-50%,' + parallax + 'px,0)';
        } else {
            
            this.title.style.transform = 'translate3d(0,0,0)  scale(1,1)';
            this.toolbar.style.transform = 'translate3d(0,' + (difference - this.legacyToolbarHeight) + 'px,0)';
        }

        if (difference <= 130) {
            if (!this.background.classList.contains('fill')) {
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
    
    getAverageRGB(imgEl) {

        var blockSize = 5, // only visit every 5 pixels
            defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = { r: 0, g: 0, b: 0 },
            count = 0;

        if (!context) {
            return defaultRGB;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            /* security error, img on diff domain */
            return defaultRGB;
        }

        length = data.data.length;

        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        return rgb;

    }
}

