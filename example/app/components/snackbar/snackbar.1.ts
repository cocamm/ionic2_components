import {Component, DynamicComponentLoader, ElementRef, Injectable, ComponentRef} from 'angular2/core';

import {IonicApp, Content, Events} from 'ionic-angular';
import {Subject} from 'rxjs/Subject';


class SnackbarNotification {

    constructor(public index, public message?: string, public action?: any, public duration?: number) {
    }
}

@Injectable()
export class Snackbar {

    not: SnackbarNotification;
    index: number = 0;

    constructor(private events: Events) {
    }

    make(message?: string, action?: any, duration?: number) {
        this.not = new SnackbarNotification(this.index, message, action, duration);
        this.events.publish('snackbar:add', this.not);
        return this;
    }

    show() {
        this.events.publish('snackbar:show', this.index);
        this.index++;
    }
}


@Component({
    selector: 'snackbar',
    template: `<div #container></div>`
})
export class SnackbarComponent {

    private queue: Array<SnackbarNotification> = [];
    private active: boolean = false;
    private cmpRefs: Array<ComponentRef> = [];

    constructor(private elementRef: ElementRef, private dcl: DynamicComponentLoader, private events: Events) {

        events.subscribe('snackbar:hide', () => {
            this.hide();
        });

        this.events.subscribe('snackbar:add', (notification) => {
            this.queue.push(notification[0]);
        });

        this.events.subscribe('snackbar:show', (index) => {
            if (!this.active) {
                this.showNext();
            }
        });
    }
    
    ngOnDestroy() {
        this.events.unsubscribe('snackbar:add', () => {});
        this.events.unsubscribe('snackbar:show', () => {});
        this.events.unsubscribe('snackbar:hide', () => {});
    }

    private showNext() {
        let notification = this.queue[0];

        this.dcl.loadIntoLocation(SnackbarContainer, this.elementRef, 'container')
            .then((res) => {
                res.instance.notification = notification;
                this.cmpRefs.push(res);
            });

        this.active = true;
    }

    show(index: number) {
    }

    private hide() {
        
        this.queue.shift();
        this.active = false;
        
        setTimeout(() => {
            this.cmpRefs[0].dispose();
            this.cmpRefs.shift();
        }, 500);

        if (this.queue.length > 0) {
            setTimeout(() => {
                this.showNext();
            }, 500);
        }
    }
}


@Component({
    selector: 'snackbar-container',
    template: `
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
class SnackbarContainer {

    notification: any;
    duration: number = 3500;

    constructor(private elementRef: ElementRef, private events: Events) {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            document.querySelector('ion-content').classList.add('snackbar-open');

            setTimeout(() => {
                document.querySelector('ion-content').classList.remove('snackbar-open');
                this.events.publish('snackbar:hide', this.notification);                
            }, this.notification.duration ? this.notification.duration : this.duration);
        });
    }
    
    ngOnDestroy() {
        
    }
}

