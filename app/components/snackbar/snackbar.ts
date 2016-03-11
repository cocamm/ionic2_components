import {Component, Renderer, ElementRef, Injectable, Inject, Optional, forwardRef} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {Animation, Transition, TransitionOptions, Config, Icon, NavParams, ViewController, NavController, Events, IonicApp} from 'ionic-angular';


// Config.setModeConfig('ios', {
//     'snackbarEnter': 'snackbar-slide-in',
//     'snackbarLeave': 'snackbar-slide-out'
// });

// Config.setModeConfig('md', {
//     'snackbarEnter': 'snackbar-md-slide-in',
//     'snackbarLeave': 'snackbar-md-slide-out'
// });

class SnackbarNotification {
    
    constructor(public message?: string, public action?: any, public duration?: number) {
    }
}


export class Snackbar {
    
    message: string;
    action: any;
    duration: number;
    nav: NavController;
    
    constructor(opts: {
        message?: string,
        action?: any,
        duration?: number
    } = {}) {
        this.message = opts.message;
        this.action = opts.action;
        this.duration = opts.duration;
    }
    
    static make(opts: {
        message?: string,
        action?: any,
        duration?: number
    } = {}) {        
        return new Snackbar(opts);
    }
}

@Injectable()
export class SnackbarManager {

    private queue: Array<SnackbarNotification> = [];
    private active: boolean = false;
    private nav: NavController;
    
    constructor(events: Events, config: Config, private app: IonicApp) {        
        events.subscribe('snackbar:hide', () => {
            this.hide();
        });
        
        config.set('ios', 'snackbarEnter', 'snackbar-slide-in');
        config.set('ios', 'snackbarLeave', 'snackbar-slide-out');
        config.set('android', 'snackbarEnter', 'snackbar-md-slide-in');
        config.set('android', 'snackbarLeave', 'snackbar-md-slide-out');
    }
    
    show(nav: NavController, snackbar: Snackbar) {
        this.nav = nav;
        let not = new SnackbarNotification(snackbar.message, snackbar.action, snackbar.duration);
        this.queue.push(not);
        if(!this.active) {
            this.showNext();
        }
    }
    
    dismiss() {
        console.log(this.app.getComponent("snackbarcontainer"));
        this.app.getRegisteredComponent(SnackbarComponent).dismiss();
    }
    
    private hide() {
        this.queue.shift();
        this.active = false;
        
        if(this.queue.length > 0) {
            setTimeout(() => {
                this.showNext();
            }, 500);
        }
    }
    
    private showNext() {
        this.nav.present(new SnackbarView(this.queue[0]));
        this.active = true;
    }
}

class SnackbarView extends ViewController {

    constructor(not: SnackbarNotification) {        
        super(SnackbarComponent, {notification: not});        
        this.viewType = 'snackbar';
    }
    
    getTransitionName(direction) {
        let key = 'snackbar' + (direction === 'back' ? 'Leave' : 'Enter');
        return this._nav && this._nav.config.get(key);
    }
    
    setMessage(message: string) {
        this.data.message = message;
    }
    
    addButton(button) {
        this.data.buttons.push(button);
    }

    setDelay(delay: number) {
        this.data.delay = delay;
    }
    
    static create(opts: {
        message?: string,
        cssClass?: string,
        buttons?: Array<any>,
        delay?: number
    } = {}) {        
        return new Snackbar(opts);
    }
}

@Component({
    selector: 'snackbar-container',
    template:`
        <div class="snackbar-wrapper">
            <div class="snackbar-content">
                {{notification.message}}
            </div>
            <div class="snackbar-action" *ngIf="notification.action">
                <button (click)="click(notification.action)" clear class="snackbar-button button button-clear disable-hover">
                    {{notification.action.text}}
                </button>
            </div>
        </div>`
})
class SnackbarComponent {
    private notification: SnackbarNotification;
    private htmlEle: any;
    private ionContent: any;

    constructor(
        private _viewCtrl: ViewController,
        private _config: Config,
        private elementRef: ElementRef,
        params: NavParams,
        renderer: Renderer,
        private events: Events
    ) {
        this.notification = params.data.notification;
    }

    onPageLoaded() {       
        let duration = this.notification.duration ? this.notification.duration : 3500;
        this.htmlEle = this.elementRef.nativeElement.querySelector('.snackbar-wrapper');
        
        setTimeout(() => {
            this.dismiss();
        }, duration);
    }

    click(button, dismissDelay?) {
        let shouldDismiss = true;

        if (button.handler) {            
            if (button.handler() === false) {                
                shouldDismiss = false;
            }
        }

        if (shouldDismiss) {
            setTimeout(() => {
                this.dismiss();
            }, dismissDelay || this._config.get('pageTransitionDelay'));
        }

    }

    dismiss(): Promise<any> {   
        return this._viewCtrl.dismiss(null, 'snackbar');
    }
    
    ngOnDestroy() {        
        this.htmlEle.classList.remove('snackbar-leave');
        this.events.publish('snackbar:hide', this.notification);
    }
}



class SnackbarSlideIn extends Transition {
    constructor(enteringView, leavingView, opts: TransitionOptions) {
        super(opts);

        let ele = enteringView.pageRef().nativeElement;
        let wrapper = new Animation(ele.querySelector('.snackbar-wrapper'));
        wrapper.fromTo('translateY', '100%', '0%');
        
        let fabAnimation = new Animation(document.querySelector('button[fab-bottom]'));
        fabAnimation.fromTo('translateY', '100%', '0%');
        
        this.easing('cubic-bezier(0.25, 0.8, 0.25, 1)').duration(400).add(wrapper).add(fabAnimation);
        
        
    }
}
Transition.register('snackbar-slide-in', SnackbarSlideIn);


class SnackbarSlideOut extends Transition {
    constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
        super(opts);

        let ele = leavingView.pageRef().nativeElement;
        let wrapper = new Animation(ele.querySelector('.snackbar-wrapper'));

        wrapper.fromTo('translateY', '0%', '100%');

        this.easing('cubic-bezier(0.55, 0, 0.55, 0.2)').duration(300).add(wrapper);
    }
}
Transition.register('snackbar-slide-out', SnackbarSlideOut);


class SnackbarMdSlideIn extends Transition {
    constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
        super(opts);

        let ele = enteringView.pageRef().nativeElement;        
        let wrapper = new Animation(ele.querySelector('.snackbar-wrapper'));
        wrapper.fromTo('translateY', '100%', '0%');
        
        let fab = document.querySelector('button[fab-bottom]');
        if(fab) {
            let fabAnimation = new Animation(fab);
            fabAnimation.fromTo('translateY', '0px', '-56px');
            this.easing('cubic-bezier(0.25, 0.8, 0.25, 1)').duration(400).add(wrapper).add(fabAnimation);
        } else {
            this.easing('cubic-bezier(0.25, 0.8, 0.25, 1)').duration(400)
        }
        
        // .classList.add('snackbar-open');
        
        //document.querySelector('ion-content').classList.add('snackbar-open');
    }
}
Transition.register('snackbar-md-slide-in', SnackbarMdSlideIn);


class SnackbarMdSlideOut extends Transition {
    constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
        super(opts);

        let ele = leavingView.pageRef().nativeElement;
        let wrapper = new Animation(ele.querySelector('.snackbar-wrapper'));
        wrapper.fromTo('translateY', '0%', '100%');
        
        let fab = document.querySelector('button[fab-bottom]');
        if(fab) {
            let fabAnimation = new Animation(fab);
            fabAnimation.fromTo('translateY', '-56px', '0px');
            this.easing('cubic-bezier(0.55, 0, 0.55, 0.2)').duration(300).add(wrapper).add(fabAnimation);
        } else {
            this.easing('cubic-bezier(0.55, 0, 0.55, 0.2)').duration(300).add(wrapper);
        }
        // this.easing('cubic-bezier(0.55, 0, 0.55, 0.2)').duration(300).add(wrapper);
        
        
        // document.querySelector('ion-content').classList.remove('snackbar-open');
        
        // document.querySelector('button[fab-bottom]').classList.remove('snackbar-open');
    }
}
Transition.register('snackbar-md-slide-out', SnackbarMdSlideOut);

