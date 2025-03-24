import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
} from '@angular/animations';

// import { SwUpdate } from '@angular/service-worker';

import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(
          ':enter, :leave',
          style({ position: 'absolute', width: '100%' }),
          { optional: true }
        ),
        group([
          query(
            ':leave',
            [
              animate(
                '300ms ease-in',
                style({ opacity: 0, transform: 'translateX(-10%)' })
              ),
            ],
            { optional: true }
          ),
          query(
            ':enter',
            [
              style({ opacity: 0, transform: 'translateX(10%)' }),
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'translateX(0%)' })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  showInstallButton = false;

  title = 'automotive-services';
  showHomeMobile: boolean = true;

  deferredPrompt: any; // Allows to show the install prompt
  setupButton: any;

  constructor(private router: Router) {}

  ngOnInit() {
    AOS.init();

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      console.log('beforeinstallprompt fired');
      if (this.setupButton == undefined) {
        this.setupButton = document.getElementById('setup_button');
      }
      // Show the setup button
      this.setupButton.style.display = 'inline';
      this.setupButton.disabled = false;
    });
  }
  installApp() {
    // Show the prompt
    this.deferredPrompt.prompt();
    this.setupButton.disabled = true;
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA setup accepted');
        // hide our user interface that shows our A2HS button
        this.setupButton.style.display = 'none';
      } else {
        console.log('PWA setup rejected');
      }
      this.deferredPrompt = null;
    });
  }

  prepareRoute(outlet: any) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
