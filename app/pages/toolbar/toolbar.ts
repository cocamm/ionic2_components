import {Page, NavController} from 'ionic-angular';

import {ToolbarHeader} from '../../components/toolbar-scroll/toolbar-scroll'; 

@Page({
    templateUrl: 'build/pages/toolbar/toolbar.html', 
    directives: [ToolbarHeader]
})
export class ToolbarPage {
    
    constructor(private nav: NavController) {
    }
}
