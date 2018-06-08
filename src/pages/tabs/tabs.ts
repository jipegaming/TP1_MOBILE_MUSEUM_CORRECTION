import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { HomePage } from '../home/home';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab3Root = AboutPage;

  constructor(public navCtrl: NavController, private platform: Platform, private barcodeScanner: BarcodeScanner, private sqlite: SQLite, private iab: InAppBrowser) {
    this.platform.ready()
      .then(() => {
      })
  }

  launchScanner() {
    console.log('go scan');
    this.barcodeScanner.scan()
      .then(barcodeData => {
        this.checkOeuvre(barcodeData.text);
      }).catch(err => {
        console.log('Error', err);
      });
  }

  checkOeuvre(code) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('UPDATE oeuvres SET checked = 1 WHERE code = ' + code, {})
          .then((data) => {
            const browser = this.iab.create('http://tcc.1click.pf/museum/index.php?mat=XJSLW7ZGD9&oeuvre=' + code, '_blank');
            browser.on('exit').subscribe(event => {
              console.log("browser exit", data);
              this.navCtrl.setRoot(TabsPage);
            });
          });
      });
  }

}
