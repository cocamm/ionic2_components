# Custom Ionic2 Components
<h2>Snackbar</h2>
<br />
<img src="/resources/screenshots/snackbar.gif" />
<br />
I tried to make it simple.
<br />
Currently it depends from Ionic 2, because I'm using the ViewController to show and hide the snackbar.
<br />
Any idea to enhance, plz let me know.
<br />
Import and put the SnackbarManager in your providers list in the main file.
<br />
<br />
app.ts
<pre>
<code>
import {SnackbarManager} from './components/snackbar/snackbar';

@App({
  template: "&lt;ion-nav [root]="rootPage"&gt;&lt;/ion-nav&gt;",
  providers: [SnackbarManager],
  config: {}
})
</code>
</pre>
<br />
Import the SnackbarManager and the Snackbar in your desired page file.
<br />
<br />
page1.ts
<pre>
<code>
import {SnackbarManager, Snackbar} from '../../components/snackbar/snackbar';
</code>
</pre>
<br />
Inject the SnackbarManager in constructor
<pre>
<code>
constructor(private nav: NavController, private mng: SnackbarManager) {
}
</code>
</pre>
<br />
Call it using:
<br />
<pre>
<code>
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
</code>
</pre>
<br />
<h2>Toolbar Scroll</h2>
<br />
<img src="/resources/screenshots/toolbarscroll.gif" />
<br />
I wanted something like the coordinator layout in native android applications.<br />
I created to use in an own project. So, it has some fixed values like some heights, positions..etc.<br />
If the user scroll fast on device, might occur some flickers. When the user scrolls on device has a little delay to call
the scroll handler and I don't know why =/ <br/>
If this issue has a solution, plz tell me =)
<br />
<br />
Import the toolbar.scss in your theme. //TODO: Use the style property inside the component
<br />
<br />
In your page put the directive and give an id to <strong>ion-content</strong><br />
<ul>
  <li>mainColor - The color of the toolbar
    <ul>
      <li>toolbar - It will get the color that you define in your <ion-toolbar></li>
      <li>image - It will get the main color of the image</li>
    </ul>
  </li>
  <li>
    contentId - the id that you give for your content
  </li>
</ul>
<br />
toolbar.html
<pre>

&#x3C;toolbar mainColor=&#x22;toolbar&#x22; contentId=&#x22;toolbar-example&#x22;&#x3E;
    &#x3C;img src=&#x22;./img/pao.jpg&#x22;&#x3E;
    &#x3C;ion-toolbar primary&#x3E;
        &#x3C;ion-buttons left&#x3E;
            &#x3C;button&#x3E;
                &#x3C;ion-icon name=&#x22;arrow-back&#x22;&#x3E;&#x3C;/ion-icon&#x3E;
            &#x3C;/button&#x3E;
        &#x3C;/ion-buttons&#x3E;
        &#x3C;ion-title&#x3E;Ionic Title&#x3C;/ion-title&#x3E;
        &#x3C;ion-buttons end&#x3E;
            &#x3C;button&#x3E; 
                &#x3C;ion-icon name=&#x22;more&#x22;&#x3E;&#x3C;/ion-icon&#x3E;
            &#x3C;/button&#x3E;
        &#x3C;/ion-buttons&#x3E;
    &#x3C;/ion-toolbar&#x3E;
    &#x3C;button fab primary fab-bottom fab-right&#x3E;
        &#x3C;ion-icon name=&#x22;add&#x22;&#x3E;&#x3C;/ion-icon&#x3E;
    &#x3C;/button&#x3E;
&#x3C;/toolbar&#x3E;

</pre>








