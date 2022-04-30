/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuranService {
  url = 'https://api.quran.sutanlab.id/surah';

  constructor(private _http: HttpClient) { }

  getAudioSurahs(): Observable<any> {
    return this._http.get(this.url);
  }

}
