import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient, HttpClient } from '@angular/common/http'; // Asegúrate de importar HttpClient aquí
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { importProvidersFrom, inject } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { provideTransloco } from '@ngneat/transloco'; // *O* TranslateModule/core

// 🛑 Importa la función de configuración de la librería
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader'; 

// Importa el JS de Bootstrap (bundle incluye Popper)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



bootstrapApplication(App, {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(
        TranslateModule.forRoot({}) // Solo necesitamos forRoot vacío, ya que el loader se define aparte
    ),
    ...provideTranslateHttpLoader({
        // Opcional: puedes pasar configuraciones como prefix o suffix aquí
        prefix: './i18n/', 
        suffix: '.json'
    }),
    
    
    ...appConfig.providers
  ]
})
  .catch((err) => console.error(err));