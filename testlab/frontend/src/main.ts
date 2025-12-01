import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';


// Importa el JS de Bootstrap (bundle incluye Popper)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



bootstrapApplication(App,  {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    ...appConfig.providers
  ]
})
  .catch((err) => console.error(err));
