import {Page, NavController, IonicApp} from 'ionic-angular';
import {ContentChild} from 'angular2/core';
import {SnackbarManager, Snackbar} from '../../components/snackbar/snackbar';

@Page({
  templateUrl: 'build/pages/page1/page1.html'
})
export class Page1 {
    
    private snackbar: Snackbar;
    count: number = 0;
    
    constructor(private nav: NavController, private mng: SnackbarManager) {
    }
    
    ngAfterViewInit() {
        
    }
    
    showSimpleSnackbar() {
        
        let snackbar = new Snackbar({
           message: 'Test Message',
           action: {
               text: "UNDO",
               handler: () => {
                   alert("UNDO");
               }
           }
        });
        
        this.mng.show(this.nav, snackbar);
    }
        
}
