import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { WeatherService } from './weather.service';
import { GeocodingResult } from './weather.model';
import { wmoToWeather, getPersianWeekday } from './wmo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cityName = '';
  searchSubject = new Subject<string>();

  selectedCity: GeocodingResult | null = null;
  currentWeather: any = null;
  dailyForecast: any[] = [];
  lastCheckedCityName = '';

  updateFlag = false;
  isDarkMode = true;
  isLoading = false;

  constructor(
    private weatherService: WeatherService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    }
  
    this.searchSubject
      .pipe(
        switchMap(city => {
          const trimmedCity = city?.trim();
          if (!trimmedCity) {
            this.isLoading = false;
            return of(null);
          }
          return this.weatherService.searchCity(trimmedCity);
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response.results && response.results.length > 0) {
            this.selectedCity = response.results[0];
        
  
            this.fetchAllWeatherData(
              this.selectedCity.latitude,
              this.selectedCity.longitude
            );
          } else {
            console.log('شهری پیدا نشد');
            this.selectedCity = null;
            this.currentWeather = null;
            this.dailyForecast = [];
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('خطا در جستجوی شهر:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  
    this.loadInitialCity();
  }

  loadInitialCity() {
    const lastCity = localStorage.getItem('lastCity');
    const initialCity = lastCity?.trim() ? lastCity : 'Tehran';

    this.cityName = initialCity;
    this.isLoading = true;
    this.searchSubject.next(initialCity);
  }

  saveLastCity(city: string) {
    localStorage.setItem('lastCity', city);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  onSearch() {
    const city = this.cityName.trim();
    if (!city) return;

    this.isLoading = true;
    this.searchSubject.next(city);
  }

  fetchAllWeatherData(lat: number, lon: number) {
    forkJoin({
      current: this.weatherService.getCurrentWeather(lat, lon),
      daily: this.weatherService.getDailyForecast(lat, lon),
      hourly: this.weatherService.getHourlyForecast(lat, lon)
    }).subscribe({
      next: (data) => {
        console.log('داده‌های دریافت شده:', data);
  
        if (data.current && data.current.current) {
          const weather = wmoToWeather(data.current.current.weather_code);
  
          this.currentWeather = {
            temp: Math.round(data.current.current.temperature_2m),
            humidity: data.current.current.relative_humidity_2m,
            windSpeed: data.current.current.wind_speed_10m,
            label: weather.label,
            emoji: weather.icon
          };
        } else {
          this.currentWeather = null;
        }
  
        if (data.daily && data.daily.daily) {
          this.dailyForecast = data.daily.daily.time.map((date, i) => {
            const w = wmoToWeather(data.daily.daily.weather_code[i]);
  
            return {
              day: getPersianWeekday(date),
              emoji: w.icon,
              maxTemp: Math.round(data.daily.daily.temperature_2m_max[i]),
              minTemp: Math.round(data.daily.daily.temperature_2m_min[i])
            };
          });
        } else {
          this.dailyForecast = [];
        }
  
     
        if (this.selectedCity) {
  
          const previousCity = localStorage.getItem('lastCity');
          if (previousCity) {
            this.lastCheckedCityName = previousCity;
          }
          
        
          this.saveLastCity(this.selectedCity.name);
        }
  
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('خطا در دریافت داده‌های هواشناسی:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  
}
