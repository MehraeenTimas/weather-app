import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GeocodingResponse,
  WeatherResponse
} from './weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private geocodingUrl = 'https://weathergeo.arusha.dev/v1/search';
  private weatherUrl = 'https://weather.arusha.dev/v1/forecast';

  constructor(private http: HttpClient) {}

  searchCity(cityName: string): Observable<GeocodingResponse> {
    const params = new HttpParams()
      .set('name', cityName)
      .set('count', '5')
      .set('language', 'fa')
      .set('format', 'json');

    return this.http.get<GeocodingResponse>(this.geocodingUrl, { params });
  }

  getCurrentWeather(lat: number, lon: number): Observable<WeatherResponse> {
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lon.toString())
      .set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day')
      .set('timezone', 'auto');

    return this.http.get<WeatherResponse>(this.weatherUrl, { params });
  }

  getDailyForecast(lat: number, lon: number): Observable<WeatherResponse> {
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lon.toString())
      .set('daily', 'temperature_2m_max,temperature_2m_min,weather_code')
      .set('forecast_days', '7')
      .set('timezone', 'auto');

    return this.http.get<WeatherResponse>(this.weatherUrl, { params });
  }

  getHourlyForecast(lat: number, lon: number): Observable<WeatherResponse> {
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lon.toString())
      .set('hourly', 'temperature_2m')
      .set('forecast_days', '1')
      .set('timezone', 'auto');

    return this.http.get<WeatherResponse>(this.weatherUrl, { params });
  }
}
