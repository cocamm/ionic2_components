import {Page, NavController} from 'ionic-framework/ionic';

import {ToolbarHeader} from '../../components/toolbar-fade/toolbar-scroll.2'; 

@Page({
    templateUrl: 'build/pages/toolbar/toolbar.html', 
    directives: [ToolbarHeader]
})
export class ToolbarPage {
    
    constructor(private nav: NavController) {
    }
}
