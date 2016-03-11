import {Page, NavController} from 'ionic-angular';

import {ToolbarScroll} from '../../components/toolbar-scroll/toolbar-scroll'; 

@Page({
    templateUrl: 'build/pages/toolbar/toolbar.html', 
    directives: [ToolbarScroll]
})
export class ToolbarPage {
    
    constructor(private nav: NavController) {
    }
}
