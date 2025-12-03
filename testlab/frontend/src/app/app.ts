import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  constructor(private translate: TranslateService, public router: Router) { 
    // 🛑 1. Establece los idiomas disponibles y el idioma por defecto
    translate.addLangs(['en', 'es', 'eu']);
    
    // 2. Establece 'es' como idioma por defecto (fallback)
    translate.setDefaultLang('es'); 

    // 3. Usa el idioma del navegador si está disponible (en, es, eu), si no, usa 'es'
    const browserLang = translate.getBrowserLang();
    const supportedLangs = ['en', 'es', 'eu'];
    
    // Si el idioma del navegador es soportado, lo usa; si no, usa el predeterminado ('es')
    const initialLang = browserLang && supportedLangs.includes(browserLang) ? browserLang : 'es';
    this.translate.use(initialLang);
  }

  ngOnInit() {
    // Usa el idioma por defecto (esto dispara la carga de en.json)
    // this.translate.use('es'); 
  }
}