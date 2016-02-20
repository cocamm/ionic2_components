import {Page, NavController} from 'ionic-framework/ionic';
import {SnackbarManager, Snackbar} from '../../components/snackbar/snackbar';

@Page({
  templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {
    
    count: number = 0;
    
    constructor(private nav: NavController, private mng: SnackbarManager) {
    }
    
    showSimpleSnackbar() { 
        
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
