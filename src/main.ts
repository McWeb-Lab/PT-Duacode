import { bootstrapApplication } from '@angular/platform-browser';
import { MainComponent } from './app/components/main/main.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(MainComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes)
  ]
})
  .catch((err) => console.error(err));
