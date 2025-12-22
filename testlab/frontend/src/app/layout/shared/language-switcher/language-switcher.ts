import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true, // Crucial para aplicaciones modernas
  imports: [CommonModule, TranslateModule], 
  template: `
    <div class="d-flex justify-content-center">
      <button 
        *ngFor="let lang of languages"
        (click)="changeLanguage(lang)"
        class="btn btn-sm mx-1"
        [ngClass]="{'btn-primary': translateService.currentLang === lang, 'btn-secondary': translateService.currentLang !== lang}">
        
        {{ 'LANG_BUTTON.' + lang.toUpperCase() | translate }}
      </button>
    </div>
  `,
  styles: [`
    /* Puedes añadir estilos específicos aquí si no usas Bootstrap directamente */
  `]
})
export class LanguageSwitcher {
  
  public translateService = inject(TranslateService);
  
  // Lista de idiomas soportados
  // Asegúrate de que estas claves coincidan con tu lógica en app.component.ts
  public languages = ['es', 'en', 'eu']; 

  /**
   * Cambia el idioma activo de la aplicación.
   * @param lang El código del idioma ('es', 'en', 'eu').
   */
  changeLanguage(lang: string) {
    this.translateService.use(lang);
  }
}