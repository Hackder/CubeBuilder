import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ColorChromeModule } from 'ngx-color/chrome';
import { ColorCircleModule } from 'ngx-color/circle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './pages/editor/editor.component';
import { ViewportComponent } from './components/viewport/viewport.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ViewportComponent,
    ColorPickerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ColorChromeModule,
    ColorCircleModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
