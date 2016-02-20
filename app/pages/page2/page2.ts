import {Page, NavController} from 'ionic-framework/ionic';

import {ToolbarPage} from '../toolbar/toolbar';
@Page({
    templateUrl: 'build/pages/page2/page2.html',
})
export class Page2 {
    constructor(private nav: NavController) {

    }
    
    showToolbarPage() {
        this.nav.push(ToolbarPage);
    }

}
