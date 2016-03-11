import {Page, NavController, IonicApp} from 'ionic-angular';
import {ContentChild} from 'angular2/core';
import {SnackbarManager, Snackbar} from '../../components/snackbar/snackbar';

//import {Snackbar} from '../../components/snackbar/snackbar.1';

@Page({
  templateUrl: 'build/pages/page1/page1.html',
  //directives: [Snackbar]
})
export class Page1 {
    
    private snackbar: Snackbar;
    count: number = 0;
    
    constructor(private nav: NavController, private mng: SnackbarManager) {
    }
    
    // constructor(private nav: NavController, private app: IonicApp) {
        
    // }
    
    ngAfterViewInit() {
        // this.snackbar = this.app.getComponent("snackbar") as Snackbar;
    }
    
    showSimpleSnackbar() { 
        //this.snackbar.show();
        
        let snackbar = new Snackbar({
           message: 'Teste ' + ++this.count,
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
