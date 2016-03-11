import {Page, NavController, IonicApp} from 'ionic-angular';
import {ContentChild} from 'angular2/core';
// import {SnackbarManager, Snackbar} from '../../components/snackbar/snackbar';
import {Snackbar, SnackbarComponent} from '../../components/snackbar/snackbar.1';

@Page({
  templateUrl: 'build/pages/page1/page1.html',
  directives: [SnackbarComponent],
  providers: [Snackbar]
})
export class Page1 {
    
    count: number = 0;
    
    constructor(private nav: NavController, private snackbar: Snackbar) {
    }
    
    ngAfterViewInit() {
        
    }
    
    showSimpleSnackbar() {
        
        this.snackbar.make("Teste " + this.count++).show();
        
        // let snackbar = new Snackbar({
        //    message: 'Test Message',
        //    action: {
        //        text: "UNDO",
        //        handler: () => {
        //            alert("UNDO");
        //        }
        //    }
        // });
        
        // this.mng.show(this.nav, snackbar);
    }
        
}
