import {Directive, Component, ElementRef, NgZone, Input} from 'angular2/core';

import {IONIC_DIRECTIVES, IonicApp, Content} from 'ionic-angular';

(function() {
  var rafLastTime = 0;
  const win: any = window;
  if (!win.requestAnimationFrame) {
    win.requestAnimationFrame = function(callback, element) {
      var currTime = Date.now();
      var timeToCall = Math.max(0, 16 - (currTime - rafLastTime));

      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);

      rafLastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!win.cancelAnimationFrame) {
    win.cancelAnimationFrame = function(id) { clearTimeout(id); };
  }
})();

export const raf = window.requestAnimationFrame.bind(window);
export const cancelRaf = window.cancelAnimationFrame.bind(window);


export function rafFrames(framesToWait, callback) {
  framesToWait = Math.ceil(framesToWait);

  if (framesToWait < 2) {
    raf(callback);

  } else {
    setTimeout(() => {
      raf(callback);
    }, (framesToWait - 1) * 17);
  }
}


@Component({
    selector: 'toolbar',
    template: `
        <div class="fake-background">
            <div class="fake-title">{{toolbarTitle}}</div>
            <div class="parallax-container">
                <div class="parallax"><ng-content select="img"></ng-content></div>
            </div>
        </div> 
        <ng-content></ng-content>`,
    directives: [IONIC_DIRECTIVES]
})
export class ToolbarHeader {

    private titleZoom: number = 1.5;
    private baseDimensions: any;
    private legacyToolbarHeight: number;
    private title: any;
    private fakeTitle: any;
    private background: any;
    private content: Content;
    private toolbar: any;
    private toolbarBackground: any;
    private parallax: any;
    private fabButton: any;
    
    private toolbarTitle: any;
    private _mainColor: string;
    
    //toolbar or image
    @Input()
    get mainColor(): string {
        return this._mainColor;
    }
    
    set mainColor(value: string) {
        this._mainColor = value;
    }

    constructor(private el: ElementRef, private app: IonicApp, private zone: NgZone) {        
    }

    ngOnInit() {
        this.toolbar = this.el.nativeElement.querySelector('ion-toolbar');
        this.background = this.el.nativeElement.querySelector('.fake-background');
        this.parallax = this.background.querySelector('.parallax img');
        this.title = this.toolbar.querySelector('.toolbar-title');
        this.content = this.app.getComponent("toolbar-example");
        this.toolbarTitle = this.title.textContent;
        this.fakeTitle = this.el.nativeElement.querySelector('.fake-title');
        this.toolbarBackground = this.toolbar.querySelector('.toolbar-background');
        this.fabButton = this.el.nativeElement.querySelector('[fab]');
    }

    ngAfterViewInit() {
        var self = this;

        window.setTimeout(() => {
            if(this._mainColor && this._mainColor == 'image') {
                let rgb = this.getAverageRGB(this.parallax);
                this.background.style.background = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 1)';
            } else {                
                this.background.style.background = this.toolbar.querySelector('.toolbar-background').style.background;
            }
            
            var header = self.el.nativeElement;
            var width = header.getBoundingClientRect().width;
            var height = header.getBoundingClientRect().height;
            self.baseDimensions = { top: 0, bottom: height, left: 0, right: width, width: width, height: height };

            self.legacyToolbarHeight = self.getDimensions(self.toolbar).height;
            self.handleStyle();
            
            // self.content.addScrollListener(function() {
            //      self.reloadStyles();
            // });
            self.content.getNativeElement().children[0].removeEventListener('scroll');
            self.zone.runOutsideAngular(function() {
                self.content.getNativeElement().children[0].addEventListener('scroll', function() {
                    self.reloadStyles();
                });
            });
        }, 121);
    }

    latestKnownScrollY = 0;
    ticking = false;
    
    reloadStyles() {        
        this.latestKnownScrollY = this.content.getContentDimensions().scrollTop;
        this.requestTick();
    }
    
    requestTick() {
        var self = this;
        if(!this.ticking) {
            requestAnimationFrame(function() {
                self.handleStyle();
            });
        }
	   this.ticking = true;
    }
    
    moveThings(parallax, toolbarPosition) {
        
        this.parallax.style.transform = 'translate3d(-50%,' + parallax + 'px,0)';
        this.toolbar.style.transform = 'translate3d(0,' + toolbarPosition + 'px, 0)';
    }

    handleStyle() {
        var self = this;
        this.ticking = false; 
        let currentScroll = this.content.getContentDimensions().scrollTop;        
        let bottom = 205 - currentScroll;
        let difference = bottom - this.baseDimensions.top;
        var parallax_dist = this.baseDimensions.height - difference;
        var parallax = Math.round((parallax_dist * (difference / (difference + this.baseDimensions.height))));
        self.parallax.style.transform = 'translate3d(-50%,' + parallax + 'px,0)';
        
        if (difference >= 56) {
            self.title.style.opacity = 0;
            self.fakeTitle.style.opacity = 1;
            self.fakeTitle.style.transform = 'translate3d(0, 0px, 0)';
        } else {
            self.title.style.opacity = 1;
            self.fakeTitle.style.opacity = 0;
            self.fakeTitle.style.transform = 'translate3d(0, ' + (55 - difference) + 'px, 0)';
        }
        
        if (difference <= 130) {
            if (this.fabButton) {
                if (!this.fabButton.classList.contains('hidden')) {
                    this.fabButton.classList.add('hidden');
                }
            }
            this.background.classList.add('fill');
        } else { 
            if (this.fabButton) {      
                this.fabButton.classList.remove('hidden');  
            }
            this.background.classList.remove('fill');
        }
        
        if(difference <= 60) {
            this.toolbarBackground.style.opacity = 1;
        } else {
            this.toolbarBackground.style.opacity = 0;
        }
    }

    ratio(bottom, height) {
        var r = (bottom - 70) / (height);
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

