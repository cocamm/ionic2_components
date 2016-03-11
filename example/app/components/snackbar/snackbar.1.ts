import {Component, DynamicComponentLoader, ElementRef, Injectable, Renderer} from 'angular2/core';

import {IonicApp, Content} from 'ionic-angular';


class SnackbarNotification {
    
    constructor(public message?: string, public action?: any, public duration?: number) {
    }
}



@Injectable()
export class Snackbar {
    
    not: SnackbarNotification;
    
    constructor(private snackCmp: SnackbarComponent) {
        
    }
    
    make() {
        this.not = new SnackbarNotification("teste");
    }
    
    show() {
        this.snackCmp.show(this.not);
    }
}


@Component({
    selector: 'snackbar',
    template: `<div #container></div>`
})
export class SnackbarComponent {
    
    constructor(private elementRef: ElementRef, private dcl: DynamicComponentLoader) {
        console.log(elementRef);
    }
    
    show(notification: SnackbarNotification) {
        this.dcl.loadIntoLocation(SnackbarContainer, this.elementRef, 'container');
    }
}


@Component({
    selector: 'snackbar-container',
    template:`
        <div class="snackbar-wrapper">
            <div class="snackbar-content">
                Teste
            </div>
            <div class="snackbar-action" >
                <button (click)="click()" clear class="snackbar-button button button-clear disable-hover">
                    teste
                </button>
            </div>
        </div>`
})
class SnackbarContainer {
    constructor(private elementRef: ElementRef) {
        
    }
    
    ngAfterViewInit() {
        setTimeout(() => {
           document.querySelector('ion-content').classList.add('snackbar-open'); 
           
           setTimeout(() => {
               document.querySelector('ion-content').classList.remove('snackbar-open'); 
           },3500);
        });
    }
}

