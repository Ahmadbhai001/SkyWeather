import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';

import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PermissionsAndroid } from 'react-native';

const HomeWeather = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [currentTemperature, setCurrentTemperature] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [weatherDescription, setWeatherDescription] = useState('');
  const [weatherImage, setWeatherImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentDate = () => {
      const date = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return date.toLocaleDateString(undefined, options);
    };
    setCurrentDate(getCurrentDate());

    // Task 1: Implement geolocation to fetch the user's current location coordinates
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        // Task 2: Set up API requests using a library to fetch weather data
        fetchWeatherData(latitude, longitude);
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

    
  }, []);

  
  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (!granted) {
          requestLocationPermission();
        } else {
          fetchCurrentLocationWeather();
        }
      } catch (err) {
        console.warn(err);
      }
    };

    checkLocationPermission();
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    setLoading(true);
    const apiKey = '7351c1a574c5a47b19f2928c6918caf1';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      const {main, name, weather} = response.data;
      const {temp} = main;
      const {description, icon} = weather[0];

      setCurrentCity(name);
      setCurrentTemperature(temp);
      setWeatherDescription(description);
      setWeatherImage(`https://openweathermap.org/img/w/${icon}.png`);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocationWeather = async () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, fetch location data
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            fetchWeatherData(latitude, longitude);
          },
          error => {
            console.log(error);
          },
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
      } else {
        console.log('Location permission denied');
        // Handle the case where the user denies location permission
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSearch = async () => {
    if (searchText) {
      setSearchText('');
      try {
        const apiKey = '7351c1a574c5a47b19f2928c6918caf1';
        const searchApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchText}&units=metric&appid=${apiKey}`;

        const response = await axios.get(searchApiUrl);
        const {main, name, weather} = response.data;
        const {temp, description, icon} = main;

        setCurrentCity(name);
        setCurrentTemperature(temp);
        setWeatherDescription(weather[0].description);
        setWeatherImage(
          `https://openweathermap.org/img/w/${weather[0].icon}.png`,
        );
        setShowSearch(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // Handle the error (e.g., show an error message to the user)
      }
    } else {
      requestLocationPermission();
    }
  };
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#87CEFA"
        translucent={false}
      />
    {loading?(<ActivityIndicator style={styles.indicator} size="large"  color="#fff" />):(<View>
        <View style={styles.searchView}>
          {showSearch && (
            <TextInput
              style={styles.input}
              placeholder="Search City"
              placeholderTextColor={'#fff'}
              onChangeText={setSearchText}
              value={searchText}
              onSubmitEditing={handleSearch}
              selectionColor={'#fff'}
            />
          )}
  
          <TouchableOpacity style={styles.searchIcon} onPress={toggleSearch}>
            <Ionicons name="search" size={25} color="#000" />
          </TouchableOpacity>
        </View>
        {/*country or city name and date section */}
        <View style={styles.countryView}>
          <Ionicons name="location-outline" size={25} color="#fff" />
          <Text style={{fontWeight: 'bold', fontSize: 20}}>
            {currentCity},pakistan
          </Text>
        </View>
  
        <View style={styles.dateView}>
          <Text style={{fontWeight: 'bold', fontSize: 10}}>{currentDate}</Text>
        </View>
        {/* Weather description and image */}
        <View style={styles.weatherInfoView}>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
            {weatherDescription}
          </Text>
          {weatherImage !== '' && (
            <Image source={{uri: weatherImage}} style={styles.weatherImage} />
          )}
        </View>
  
        <View style={styles.temperatureView}>
          <Text style={{color: '#87CEFA', fontWeight: 'bold', fontSize: 30}}>
            {Math.round(parseFloat(currentTemperature))} °C
          </Text>
        </View>
        </View>)}
      {/* search bar section*/}
      
      
    </View>
  );
};

export default HomeWeather;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEFA',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    width: '82%',
    fontWeight: 'bold',
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 5,
  },
  searchIcon: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 10,
    marginLeft: 15,
  },
  countryView: {
    marginTop: 55,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dateView: {
    alignItems: 'center',
  },
  temperatureView: {
    backgroundColor: '#fff',
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextdayView: {
    height: 230,
    width: 100,
    backgroundColor: '#fff',
    marginTop: 50,
    borderRadius: 100,
    alignItems: 'center',
  },
  weatherInfoView: {
    alignItems: 'center',
    marginTop: 10,
  },
  weatherImage: {
    width: 150,
    height: 150,
    marginTop: 5,
  },
  indicator: {
        
        alignSelf:'center'
              
    }
});
