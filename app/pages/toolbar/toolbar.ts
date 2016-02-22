import {Page, NavController} from 'ionic-framework/ionic';

import {ToolbarFadeHeader} from '../../components/toolbar-fade/toolbar-scroll';

@Page({
    templateUrl: 'build/pages/toolbar/toolbar.html',
    directives: [ToolbarFadeHeader]
})
export class ToolbarPage {
    
    constructor(private nav: NavController) {
    }
}
