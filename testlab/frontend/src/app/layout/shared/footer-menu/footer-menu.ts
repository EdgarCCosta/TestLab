import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { importProvidersFrom } from '@angular/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-footer-menu',
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './footer-menu.html',
  styleUrl: './footer-menu.css',
})
export class FooterMenu {
  role = inject(AuthService).role;

  constructor (public router: Router) {}

}
