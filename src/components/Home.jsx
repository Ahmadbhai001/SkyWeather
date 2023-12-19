import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [currentTemperature, setCurrentTemperature] = useState('');
  const [currentWeatherCondition, setCurrentWeatherCondition] = useState('');

  

  const API_KEY = '7351c1a574c5a47b19f2928c6918caf1';
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
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn('Location permission denied:',err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        console.log('Error getting location: ', error);
        // Fallback to a default location if obtaining current location fails
         getWeatherByCity('Faisalabad');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const getWeatherByCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`,
      );

      if (!response.data) {
        throw new Error('Weather information not available');
      }

      setCurrentCity(response.data.name);
      setCurrentTemperature(response.data.main.temp.toString());
      
    } catch (error) {
      console.error('Error fetching weather:', error.message);
    }
  };

  const getWeatherByCity = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!response.data) {
        throw new Error('City not found');
      }

      setCurrentCity(response.data.name);
      setCurrentTemperature(response.data.main.temp.toString());
      
    } catch (error) {
      console.error('Error fetching weather:', error.message);
    }
  };

  const handleSearch = async () => {
    if (searchText) {
      getWeatherByCity(searchText);
      setSearchText('');
    } else {
      requestLocationPermission();
    }
  };
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

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
    requestLocationPermission();

  }, []);

  useEffect(() => {
    
    getWeatherByCity('Faisalabad');
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      await requestLocationPermission();
    };
  
    requestPermission();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#87CEFA"
        translucent={false}
      />
      {/* search bar section*/}
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
        {currentCity ? `${currentCity}, Pakistan` : 'Loading...'}
        </Text>
      </View>

      <View style={styles.dateView}>
        <Text style={{fontWeight: 'bold', fontSize: 10}}>{currentDate}</Text>
      </View>

      <Image
      source={require('../assets/weatherimage.png')}
        style={{height: 200, width: 200, alignSelf: 'center', marginTop: 20}}
      />
      <View style={styles.temperatureView}>
        <Text style={{color: '#87CEFA', fontWeight: 'bold', fontSize: 30}}>
        {Math.round(parseFloat(currentTemperature))} °C
        </Text>
      </View>
      
    </View>
  );
};

export default Home;

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
});
