export interface GeocodingResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  }
  
  export interface GeocodingResponse {
    results?: GeocodingResult[];
  }
  
  export interface CurrentWeather {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  }
  
  export interface HourlyWeather {
    time: string[];
    temperature_2m: number[];
  }
  
  export interface DailyWeather {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  }
  
  export interface WeatherResponse {
    current: CurrentWeather;
    hourly: HourlyWeather;
    daily: DailyWeather;
    timezone: string;
  }
  
  export interface WeatherInfo {
    label: string;
    icon: string;
  }
  