import {Page, NavController, IonicApp} from 'ionic-angular';

import {ToolbarPage} from '../toolbar/toolbar';
@Page({
    templateUrl: 'build/pages/page2/page2.html',
})
export class Page2 {
    constructor(private nav: NavController, private app: IonicApp) {
        
    }
    
    showToolbarPage() {
        this.nav.push(ToolbarPage);
    }

}
