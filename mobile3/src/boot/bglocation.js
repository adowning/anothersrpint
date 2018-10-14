import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import DeviceInfo from 'react-native-device-info';
// import PouchDB from 'pouchdb-react-native'

// const localDB = new PouchDB('myDB')
// const syncUrl = 'http://192.168.1.10:5984/test'
// const remoteDb = new PouchDB(syncUrl, {ajax: {cache: false}})
// localDB.changes({since: 'now', live: true})
// .on('change', () => {
//   localDB.replicate.to(remoteDb);
// })
// This is your plugin object. It can be exported to be used anywhere.
const BgLocation = {
    // The install method is all that needs to exist on the plugin object.
    // It takes the global Vue object as well as user-defined options.

    init() {
  
      this.deviceId = DeviceInfo.getUniqueID()
      this.battery = DeviceInfo.getBatteryLevel()
      const foreground = false

      // We call Vue.mixin() here to inject functionality into all components.
      const state = {
        region: null,
        locations: [],
        stationaries: [],
        isRunning: false,

        // batt: this.DeviceInfo.getBatteryLevel()
        // deviceId: DeviceInfo.getUniqueID()
      };

      function logError(msg) {
        console.log(`[ERROR] getLocations: ${msg}`);
      }
  
      const handleHistoricLocations = locations => {
        let region = null;
        const now = Date.now();
        const latitudeDelta = 0.01;
        const longitudeDelta = 0.01;
        const durationOfDayInMillis = 24 * 3600 * 1000;
  
        const locationsPast24Hours = locations.filter(location => {
          return now - location.time <= durationOfDayInMillis;
        });
  
        if (locationsPast24Hours.length > 0) {
          // asume locations are already sorted
          const lastLocation =
            locationsPast24Hours[locationsPast24Hours.length - 1];
          region = Object.assign({}, lastLocation, {
            latitudeDelta,
            longitudeDelta
          });
        }
        this.setState({ locations: locationsPast24Hours, region });
      };
  
    //   BackgroundGeolocation.getValidLocations(
    //     handleHistoricLocations.bind(this),
    //     logError
    //   );
  
      BackgroundGeolocation.on('start', () => {
        // service started successfully
        // you should adjust your app UI for example change switch element to indicate
        // that service is running
        console.log('[DEBUG] BackgroundGeolocation has been started ',BackgroundGeolocation);
        // this.setState({ isRunning: true });

        state.isRunning = true
      });
  
      // BackgroundGeolocation.on('http', () => {
      //   console.log('[DEBUG] http');
      // });

      BackgroundGeolocation.on('stop', () => {
        console.log('[DEBUG] BackgroundGeolocation has been stopped');
        // this.setState({ isRunning: false });
        this.state.isRunning = false

      });
  
      BackgroundGeolocation.on('authorization', status => {
        console.log(
          '[INFO] BackgroundGeolocation authorization status: ' + status
        );
        if (status !== BackgroundGeolocation.AUTHORIZED) {
          // we need to set delay after permission prompt or otherwise alert will not be shown
          setTimeout(() =>
            Alert.alert(
              'App requires location tracking',
              'Would you like to open app settings?',
              [
                {
                  text: 'Yes',
                  onPress: () => BackgroundGeolocation.showAppSettings()
                },
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel'
                }
              ]
          ), 1000);
        }
      });
  
      BackgroundGeolocation.on('error', ({ message }) => {
        Alert.alert('BackgroundGeolocation error', message);
      });
  
      BackgroundGeolocation.on('location', location => {
        // console.log('[DEBUG] BackgroundGeolocation location', location);
       location.deviceId = this.deviceId
        console.log('[DEBUG] Locationo update: ');
        // BackgroundGeolocation.startTask(taskKey => {
        //           localDB.post(location)
        //   .then(result => {
        //     BackgroundGeolocation.endTask(taskKey);
        //   })
        // })
        // BackgroundGeolocation.startTask(taskKey => {
        //   localDB.post(location)
        //   .then(result => {
        //     if (this._sync) {
        //       this._sync.cancel()
        //       this._sync = null
        //     }
             
        //       this._sync = PouchDB.sync(localDB, remoteDb, {live: true, retry: true})
        //         .on('error', error => console.error('Sync Error', error))
        //         .on('change', info => console.log('Sync change', info))
        //         .on('paused', info => console.log('Sync paused', info))
        //    BackgroundGeolocation.endTask(taskKey);

        //   })
        //   .catch(error => console.error('Error during create Item', error, error.message))
        // //   requestAnimationFrame(() => {
        // //     const longitudeDelta = 0.01;
        // //     const latitudeDelta = 0.01;
        // //     const region = Object.assign({}, location, {
        // //       latitudeDelta,
        // //       longitudeDelta
        // //     });
        // //     const locations = this.state.locations.slice(0);
        // //     locations.push(location);
        // //     // this.setState({ locations, region });
        // // this.state.locations = locations
        // // this.state.region = region

        // //     BackgroundGeolocation.endTask(taskKey);
        // //   });
        // });
      });
  
      BackgroundGeolocation.on('stationary', (location) => {
        console.log('[DEBUG] BackgroundGeolocation stationary', location);
        BackgroundGeolocation.startTask(taskKey => {
          requestAnimationFrame(() => {
            const stationaries = this.state.stationaries.slice(0);
            if (location.radius) {
              const longitudeDelta = 0.01;
              const latitudeDelta = 0.01;
              const region = Object.assign({}, location, {
                latitudeDelta,
                longitudeDelta
              });
              const stationaries = this.state.stationaries.slice(0);
              stationaries.push(location);
              // this.setState({ stationaries, region });
              this.state.stationaries = stationaries
              this.state.region = region
      
            }
            BackgroundGeolocation.endTask(taskKey);
          });
        });
      });
  
      BackgroundGeolocation.on('foreground', () => {
        console.log('[INFO] App is in foreground');
      this.foreground = true
      });
  
      BackgroundGeolocation.on('background', () => {
        console.log('[INFO] App is in background');
        this.foreground = false   
      });
  
    //   BackgroundGeolocation.checkStatus(({ isRunning }) => {
    //     // this.setState({ isRunning });
    //     this.state.isRunning = isRunning
    //   });

      function toggleTracking() {

      this.deviceId = DeviceInfo.getUniqueID()
      this.battery = DeviceInfo.getBatteryLevel()
      BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
        console.log('xx')
        console.log(this.deviceId)
        if (isRunning) {
          // BackgroundGeolocation.stop();
          return false;
        }
  
        if (!locationServicesEnabled) {
          Alert.alert(
            'Location services disabled',
            'Would you like to open location settings?',
            [
              {
                text: 'Yes',
                onPress: () => BackgroundGeolocation.showLocationSettings()
              },
              {
                text: 'No',
                onPress: () => console.log('No Pressed'),
                style: 'cancel'
              }
            ]
          );
          return false;
        }
  
        if (authorization == 99) {
          console.log('asdf 1 ', this.deviceId)
          BackgroundGeolocation.configure({
            reset: true,
            interval: 7000,
            fastestInterval: 6000,
            activitiesInterval: 10000,
            startOnBoot: true,
            notificationTitle: 'Andrews App',
            notificationText: 'Tracking enabled',
            notificationIconColor: 'blue',
            locationProvider: 2,
            desiredAccuracy: 0,
            stationaryRadius: 0,
            distanceFilter: 0,
            debug: true,
            startForeground: true,
            stopOnStillActivity: false,
            stopOnTerminate: false,
            maxLocations: 1000,
             url: 'https://openwhisk.ng.bluemix.net/api/v1/web/andrewsgroup_dev/default/deviceupdates-dev-getuserlist.json',
            // url: 'http://192.168.1.10:5984/test/',
            syncUrl: 'https://openwhisk.ng.bluemix.net/api/v1/web/andrewsgroup_dev/default/deviceupdates-dev-getuserlistbulk.json',
            syncThreshold: 100,
            httpHeaders: {
'Content-Type': 'application/json'
            },
            postTemplate: {
              lat: '@latitude',
              lon: '@longitude',
              provider: 'gps',
              accuracy: '@accuracy',
              radius: '@radius',
              provider: '@provider',
             time: '@time',
             bearing: '@bearing',
            speed: '@speed',
            deviceId: this.deviceId,
            batt: this.battery
            }})
          // calling start will also ask user for permission if needed
          // permission error will be handled in permisision_denied event
          BackgroundGeolocation.start();
        } 
        
         else if (authorization == BackgroundGeolocation.AUTHORIZED) {
          console.log('asdf 2 ', this.deviceId)

          BackgroundGeolocation.configure({
            reset: true,
            interval: 7000,
            fastestInterval: 6000,
            activitiesInterval: 10000,
            startOnBoot: true,
            notificationTitle: 'Andrews App',
            notificationText: 'Tracking enabled',
            notificationIconColor: 'blue',
            locationProvider: 2,
            desiredAccuracy: 0,
            stationaryRadius: 0,
            distanceFilter: 0,
            debug: true,
            startForeground: true,
            stopOnStillActivity: false,
            stopOnTerminate: false,
            maxLocations: 1000,
             url: 'https://openwhisk.ng.bluemix.net/api/v1/web/andrewsgroup_dev/default/deviceupdates-dev-getuserlist.json',
            // url: 'http://192.168.1.10:5984/test',
            syncUrl: 'https://openwhisk.ng.bluemix.net/api/v1/web/andrewsgroup_dev/default/deviceupdates-dev-getuserlistbulk.json',
            syncThreshold: 100,
            httpHeaders: {
'Content-Type': 'application/json'
            },
            postTemplate: {
              lat: '@latitude',
              lon: '@longitude',
              provider: 'gps',
              accuracy: '@accuracy',
              radius: '@radius',
              provider: '@provider',
             time: '@time',
             bearing: '@bearing',
            speed: '@speed',
            deviceId: this.deviceId,
            batt: this.battery
            }})
          // calling start will also ask user for permission if needed
          // permission error will be handled in permisision_denied event
          BackgroundGeolocation.start();
        } else {
          Alert.alert(
            'App requires location tracking',
            'Please grant permission',
            [
              {
                text: 'Ok',
                onPress: () => BackgroundGeolocation.start()
              }
            ]
          );
        }
      });
    }
   toggleTracking()
    }
  };
  
  export default BgLocation;