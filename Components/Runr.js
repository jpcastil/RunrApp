import React, {Component} from 'react';
import {AppRegistry,StyleSheet,Text,View,AsyncStorage, Button, Alert, SafeAreaView, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
import Tts from 'react-native-tts';
import Summary from './Summary'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December']
const styles = StyleSheet.create({
    buttonLayout: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    fill: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    container: {
        height: '60%',
    },
    centerItem: {
        alignItems: 'center'
    },
    centerItemTop: {
        alignItems: 'center',
    },
    ValueTop: {
        color:'#00334d',
        fontSize: 35,
        borderWidth: 10,
        borderColor: '#00334d',
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderRadius: 10,
    },
    fontF : {
        fontFamily: 'GeezaPro-Bold'
    },
    fillUp : {
        ...StyleSheet.absoluteFillObject,
        flex:3,
    },
    switchToRow : {
        flexDirection: 'row'
    },
    flexOne : {
        flex: 1,
    },
    bgOrange : {
        backgroundColor: 'orange'
    },
    bgBlue: {
        backgroundColor: 'blue'
    },
    flexThree: {
        flex: 3,
        borderWidth: 3,
        borderColor: '#00334d'
    },
    alignVertically: {
        justifyContent: 'center',
    },
    flexTwo: {
        flex: 2
    },
    alignHorizontally: {
        alignItems: 'center'
    },
    subT: {
        fontSize: 20
    },
    map : {
        ...StyleSheet.absoluteFillObject,
    },
    startButton : {
        fontSize: 50,
    },
    hideAll : {
        display: 'none',
    },



});

function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344
        }
        if (unit == "N") {
            dist = dist * 0.8684
        }
        return dist;
    }
}

let instantPace = {
    lat1: null,
    long1: null,
    time1: null,

    lat2: null,
    long2: null,
    time2 : null,
}
let coordinates = []

const options = {
    enableHighAccuracy: true,
    timeOut: 20000,
    maximumAge: 60 * 60 * 24,
    distanceFilter: 10
};
let latitudes = []
let longitudes = []
let times = []
const timeOptions = {
  container: {
    shadowOffset:{  width: 10,  height: 10,  },
    shadowColor: 'black',
    shadowOpacity: 0.87,
    backgroundColor: '#00334d',
    borderRadius: 10,
    alignItems:'center',
  },
  text: {
    fontSize: 90,
    color: '#FFF',
  }
};

export default class Runr extends Component {
    constructor() {
        super();
        this.state = {
            disabled: true,
            isRunning: false,
            watchId: null,
            paused: false,
            stopwatchStart: false,
            stopwatchReset: false,
            starttime: null,
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.04,
                longitudeDelta: 0.03
            },
            startLocation: {
                latitude: null,
                longitude: null,
            },
            distance: 0,
            pace: '00:00',
            pausedTitle: "Pause",
            pastTime: null,
            finished: false,
            runObject : {
                day: 'Thursday',
                date: 'July 4, 2019',
                distance: 5.1,
                time: '30:32',
                pace: '9: 61',
            },
            showScreen:false,
            coordinates: [
                { latitude: 37.8025259, longitude: -122.4351431 },
                { latitude: 37.7896386, longitude: -122.421646 },
                { latitude: 37.7665248, longitude: -122.4161628 },
                { latitude: 37.7734153, longitude: -122.4577787 },
                { latitude: 37.7948605, longitude: -122.4596065 },
                { latitude: 37.8025259, longitude: -122.4351431 }
            ],
            regionSummary:{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.04,
                longitudeDelta: 0.03
            },
            co: []


        }
    }
    componentDidMount() {

        this.geoListen()
        this.createObject()
    }



    createObject = async () => {
        let values
        try {
            values = await AsyncStorage.multiGet(['enabled', 'meters', 'option', 'pace'])
        } catch(e) {
            console.log(e)
        }
        this.setState({
            formData: values,
            firstPoint : null,
        });
    }

    showScreen = () => {
        console.log(this.state.runObject)
        this.setState({
            showScreen: ! this.state.showScreen
        });
    }

    printObject = () =>{
        console.log(latitudes)
    }
    checkDistance = (position) => {
        let currentTime = new Date()
        if (this.state.firstPoint === null){
            this.setState({
                firstPoint : position,
            });
        } else {
            let distanceTraveled = distance(position.coords.latitude, position.coords.longitude, this.state.firstPoint.coords.latitude, this.state.firstPoint.coords.longitude)
            let maxD = JSON.parse(this.state.formData[1][1]) * 0.000621371
            if (distanceTraveled >= maxD){
                this.setState({
                    firstPoint : position,
                });
                if(JSON.parse(this.state.formData[0][1])){
                    this.checkPace(distanceTraveled, currentTime)
                }

            }
        }
    }
    setCoordinatesObject = () => {
        this.setState({
            regionSummary: {
                latitude: this.state.startLocation.latitude,
                longitude: this.state.startLocation.longitude,
                latitudeDelta: this.state.distance * 0.03,
                longitudeDelta: this.state.distance * 0.03
            },
            co: coordinates
        });


    }




    checkPace = (distanceTraveled, currentTime) => {
        var deltaTime
        if (this.state.pastTime === null){
            deltaTime = currentTime - this.state.starttime
        } else {
            deltaTime = currentTime - this.state.pastTime
        }
        this.setState({
            pastTime: currentTime
        });
        var pace = deltaTime / distanceTraveled
        var desiredPace = JSON.parse(this.state.formData[3][1])
        var deltaPace = pace - desiredPace
        var sayPace = this.state.formData[2][1] !== 'Slow Down/ Speed Up'
        console.log(this.convertMillis(desiredPace))
        console.log(this.convertMillis(pace))

        if (sayPace){
            if (Math.abs(deltaPace) > 15000){
                let minutes = Math.floor(pace / 60000)
                let seconds = Number.parseFloat(((pace % 60000) / 1000)).toFixed(0)
                let stringToSay = "Pace is " + minutes + " and " + seconds + " seconds."
                Tts.speak(stringToSay);
            }
        } else {
            if (deltaPace > 15000) {

                console.log("ACTIVATED")
                Tts.speak("Speed Up!");

            } else if (deltaPace < - 15000){

                console.log("ACTIVATED")
                Tts.speak("Slow Down!");


            }
        }
    }


    toggleStopwatch() {
        this.setState({
            stopwatchStart: !this.state.stopwatchStart,
            stopwatchReset: false
        });
    }
    changeIsRunning(){
        this.setState({
            isRunning: ! this.state.isRunning
        });
    }
    changePaused(){
        this.setState({
            paused: ! this.state.paused
        });
    }
    appendStartData = (position) =>{
        this.checkDistance(position)
        this.setState({
            startLocation: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        })
    }

    appendData = (position) =>{
        this.checkDistance(position)
        let newDate = new Date()

        if (latitudes.length > 1){
            if (!(latitudes[ latitudes.length - 1] === null)){
                this.updateDistance(position)
                let newPace = this.convertMillis((newDate - this.state.starttime) / this.state.distance)
                this.updatePace(newPace)
            }
        }
        let x = {latitude: position.coords.latitude, longitude: position.coords.longitude}
        coordinates.push(x)
        latitudes.push(position.coords.latitude)
        longitudes.push(position.coords.longitude)
        times.push(newDate)
        console.log(coordinates)
    }


    sayPace(millis){
        let minutes = Math.floor(millis / 60000);
        let seconds = Number.parseFloat(((millis % 60000) / 1000)).toFixed(0);
        Tts.speak("Pace is " + minutes + "minutes and " + seconds + " seconds. ");
    }

    updatePace(newPace){
        this.setState({
            pace: newPace
        });
    }
    appendDataNull(position){
        let newDate = new Date()
        latitudes.push(position.coords.latitude)
        longitudes.push(position.coords.longitude)
        times.push(newDate)
        latitudes.push(null)
        longitudes.push(null)
        times.push(null)

    }
    changePausedTitle(){
        if (this.state.pausedTitle === "Pause"){
            this.setState({
                pausedTitle: "Continue"
            });
        } else {
            this.setState({
                pausedTitle: "Pause"
            });
        }
    }

    testSpeak = () =>{
        Tts.speak("Slow Down!");
    }
    reset = () =>{
        let latitudes = []
        let longitudes = []
        let times = []
        this.setState({
            disabled: true,
            isRunning: false,
            watchId: null,
            stopwatchStart: false,
            stopwatchReset: true,
            paused: false,
            starttime: null,
            startLocation: {
                latitude: null,
                longitude: null,
            },
            distance: 0,
            pace: '0:00',
            pausedTitle: "Pause"
        });
    }
    getFormattedTime(time) {
        this.currentTime = time;
    };
    geoMute(){
        navigator.geolocation.clearWatch(this.state.watchId);
        navigator.geolocation.stopObserving();
    }
    geoFailure = (err) => {
        console.log(err.message);
    }

    geoListen(){
        this.setState({
            watchId: navigator.geolocation.watchPosition(this.updateMap, this.geoFailure, options),
        });
    }
    updateMap = (position) => {
        this.setState({
            region: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.004,
                longitudeDelta: 0.004
            }
        })
        if (this.state.isRunning){
            this.appendData(position)
        }
    }
    enableButtons(){
        this.setState({
            disabled: ! this.state.disabled
        });
    }
    updateDistance = (position) =>{
        this.setState({
            distance: this.state.distance + distance(position.coords.latitude, position.coords.longitude, latitudes[latitudes.length - 1], longitudes[ longitudes.length - 1])
        });
    }
    convertMillis = (millis) =>{
        let minutes = Math.floor(millis / 60000);
        let seconds = Number.parseFloat(((millis % 60000) / 1000)).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }
    startRun = () =>{
        this.createObject()
        let newDate = new Date()
        this.setState({
            starttime: newDate,
            currentTime: newDate,
        })
        this.toggleStopwatch()
        this.enableButtons()
        this.changeIsRunning()
        this.geoMute()
        navigator.geolocation.getCurrentPosition(this.appendStartData, this.geoFailure, options);
        this.geoListen()
    }
    continueRun = () =>{
        this.geoMute()
        this.changePausedTitle()
        this.changeIsRunning()
        this.toggleStopwatch()
        navigator.geolocation.getCurrentPosition(this.appendData, this.geoFailure, options);
        this.geoListen()


    }
    pauseRun = () =>{
        this.changeIsRunning()
        this.toggleStopwatch()
        this.geoMute()
        navigator.geolocation.getCurrentPosition(this.appendDataNull, this.geoFailure, options);
        this.changePausedTitle()
        this.geoListen()
    }
    finishRun = () =>{
        this.toggleStopwatch()
        this.changeIsRunning()
        this.geoMute()
        navigator.geolocation.getCurrentPosition(this.finishFunction, this.geoFailure, options);
        this.geoListen()
    }
    finishFunction = (position) =>{
        let x = {latitude: position.coords.latitude, longitude: position.coords.longitude}
        coordinates.push(x)
        this.setCoordinatesObject()
        this.setState({
            finished: ! this.state.finished
        });
        let finalTime = new Date()

        let delta = finalTime - this.state.starttime
        let formatted = this.convertMillis(delta)
        this.updateDistance(position)
        let newPace = this.convertMillis((finalTime - this.state.starttime) / this.state.distance)
        this.updatePace(newPace)
        latitudes.push(position.coords.latitude)
        longitudes.push(position.coords.longitude)
        times.push(finalTime)


        let minutes = Math.floor(delta / 60000)
        let seconds = Number.parseFloat(((delta % 60000) / 1000)).toFixed(0)
        let paceT = (finalTime - this.state.starttime) / this.state.distance
        let paceMinutes = Math.floor(paceT / 60000)
        let paceSeconds = Number.parseFloat(((paceT % 60000) / 1000)).toFixed(0)

        Tts.speak("You ran "+Number.parseFloat(this.state.distance).toFixed(2)+" miles in " + minutes + " minutes and " + seconds + " seconds. " + "Average Pace was " + paceMinutes+" minutes and " + paceSeconds + " seconds.")

        var ObjStore = {
            endTime: finalTime,
            avgPace: newPace,
            lats: latitudes,
            longs: longitudes,
            times: times,
            starttime: this.state.starttime,
            distance: this.state.distance,
            coordinates: coordinates,
            startLocation: this.state.startLocation
        }
        coordinates = []
        latitudes = []
        longitudes = []
        times = []
        this.setState({
            runObject : {
                day: days[ this.state.starttime.getDay() ],
                date: months[ this.state.starttime.getMonth() ] + ' ' + this.state.starttime.getDate() + ', ' + this.state.starttime.getFullYear(),
                distance: Number.parseFloat(this.state.distance).toFixed(2),
                time: formatted,
                pace: newPace,
                co: coordinates,
                startLocation: this.state.startLocation,
            },
        })

        this.showScreen()
        this.storeRun(ObjStore)


    }

    storeRun = async (runObject) => {
        try {
            await AsyncStorage.setItem(runObject.starttime.toString(), JSON.stringify(runObject))
        } catch (e) {
            console.log(e)
        }
        this.reset()

    }
    getAllKeys = async () => {
        let keys = []
            try {
                keys = await AsyncStorage.getAllKeys()
            } catch(e) {
                console.log(e)
            }
            console.log(keys)
        }




    render() {
        return (
            <View style={styles.fill}>
                <View style={this.state.showScreen ? styles.hideAll: styles.fill}>
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 5,

                  }}
                />

                <View style={[styles.flexTwo, styles.alignVertically]}>
                    <Stopwatch
                        options= {timeOptions}
                        laps
                        msecs={false}
                        start={this.state.stopwatchStart}
                        getTime={this.getFormattedTime}
                        reset={this.state.stopwatchReset}/>
                </View>

                <View style={[styles.switchToRow, styles.flexOne]}>
                    <View style={[styles.flexOne, styles.alignHorizontally]}>
                        <Text style={[styles.ValueTop, styles.flexOne, styles.fontF]}>
                        {this.state.pace}
                        </Text>
                        <Text style={[styles.subT, styles.flexOne]}>
                            Average (min/mi)
                        </Text>
                    </View>

                    <View style={[styles.flexOne, styles.alignHorizontally]}>
                        <Text style={[styles.ValueTop, styles.flexOne, styles.fontF]}>
                            {Number.parseFloat(this.state.distance).toFixed(2)}
                        </Text>
                        <Text style={[styles.subT, styles.flexOne]}>
                            Distance (mi)
                        </Text>
                    </View>
                </View>


                <View style={[styles.flexThree]}>
                    <MapView
                        style={styles.map}
                        region={this.state.region}
                        showsUserLocation={true}
                        >
                    </MapView>
                </View>


                <View style={[styles.flexOne, styles.switchToRow, styles.alignHorizontally, styles.alignVertically]}>
                   <Button
                       title={this.state.pausedTitle}
                       color= "#990099"
                       onPress={this.state.pausedTitle === "Pause" ? this.pauseRun : this.continueRun}
                       disabled={this.state.disabled}
                       />
                       <TouchableOpacity
                          onPress={this.state.disabled ? this.startRun : this.finishRun}
                          style={{
                              borderWidth:1,
                              borderColor:'rgba(0,0,0,0.2)',
                              alignItems:'center',
                              justifyContent:'center',
                              width:100,
                              height:100,
                              backgroundColor:'#00334d',
                              borderRadius:50,
                          }}>
                        <Text style={{color:"white", fontSize: 30}}>{this.state.disabled ? "Start" : "Finish"}</Text>
                        </TouchableOpacity>

                   <Button
                       title= "Reset"
                       color= "#ff0000"
                       disabled={this.state.disabled}
                       onPress={this.reset}
                       />
               </View>
               </View>
               <View style={this.state.showScreen ? styles.fill : styles.hideAll}>
                   <Summary func={this.showScreen} runObject={this.state.runObject} region={this.state.regionSummary}  coordinates={this.state.co}/>
               </View>
            </View>
       );
   }
}
