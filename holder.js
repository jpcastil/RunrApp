geoAppendPositionTime = (position) =>{
    this.updateDistance(position)



    let newDate = new Date()
    this.updateAveragePace(this.convertMillis((newDate - this.state.starttime) / this.state.distance  ))
    latitudes.push(position.coords.latitude)
    longitudes.push(position.coords.longitude)
    times.push(newDate)
    /*console.log(latitudes)
    console.log(longitudes)*/

    this.geoUpdateMap(position)

}


updateDistance = (position) =>{
    this.setState({
        distance: this.state.distance + distance(position.coords.latitude, position.coords.longitude, latitudes[latitudes.length - 1], longitudes[ longitudes.length - 1])
    });
}

reset = () => {
    latitudes = []
    longitudes = []
    times = []
    if (this.state.activeListening){
        this.geoActiveMute()
        this.geoPassiveListen()
    }
    this.setState({
        distance: 0,
        watchId: null,
        disabled: true,
        onRunBool: true,
        paused: false,
        stopwatchStart: false,
        stopwatchReset: true,
        starttime: null,
        currentTime: null,
        startLocation: {
            latitude: null,
            longitude: null,
        },
        pace: "0:00"
    });
}




render() {
    return (
        <View style={styles.fill}>
            <View style={styles.centerItem}>
                <Stopwatch laps msecs={false} start={this.state.stopwatchStart}
                    reset={this.state.stopwatchReset}
                    getTime={this.getFormattedTime} />
                <Text> Time </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <View style={styles.centerItemTop}>
                    <Text style={styles.ValueTop}>{this.state.pace}</Text>
                    <Text>Average (min/mi)</Text>
                </View>
               <View style={styles.centerItemTop}>
                   <Text style={styles.ValueTop}>{this.state.distance.toFixed(2)}</Text>
                   <Text>Distance (mi)</Text>
               </View>
           </View>

            <View style={styles.container}>
                <MapView
                    style={styles.fill}
                    region={this.state.region}
                    showsUserLocation={true}
                    >
                </MapView>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
               <Button
                   title= {this.state.paused ? "Continue" : "Pause"}
                   color= "#bfff80"
                   onPress={this.state.paused ? this.onRun : this.onNotRun}
                   disabled={this.state.onRunBool}
                   />

               <Button
                   title={this.state.onRunBool ? "Start" : "Finish"}
                   color={"blue"}
                   onPress={this.state.onRunBool ? this.onRun: this.onNotRun}
                   />
               <Button
                   title= "Reset"
                   color= "red"
                   onPress={this.reset}
                   disabled={ this.state.onRunBool }
                   />
            </View>

        </View>
   );
}






### Start
import React, {Component} from 'react';
import {AppRegistry,StyleSheet,Text,View,AsyncStorage, Button, Alert, SafeAreaView, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer'


const styles = StyleSheet.create({
    fill: {
        ...StyleSheet.absoluteFillObject,
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
        backgroundColor: 'black',
        color:'white'
    }

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
function convertMillis(millis){
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const options = {
    enableHighAccuracy: true,
    timeOut: 20000,
    maximumAge: 60 * 60 * 24,
    distanceFilter: 10
};

let latitudes = []
let longitudes = []
let times = []

export default class WholeProj extends Component {
    constructor() {
        super();
        this.state = {
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
            pace: '0:00',

        }
    }
    getFormattedTime(time) {
        this.currentTime = time;
    };
    componentDidMount(){
        this.geoListen()
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
    geoListen(){
        this.setState({
            watchId: navigator.geolocation.watchPosition(this.geoUpdateMap, this.geoFailure, options),
        });
    }
    reset(){
        console.log("All has been reset")
    }
    geoMute(){
        navigator.geolocation.clearWatch(this.state.watchId);
        navigator.geolocation.stopObserving();
    }
    geoFailure = (err) => {
        console.log(err.message);
    }
    appendData(position){
        let newDate = new Date()
        latitudes.push(position.coords.latitude)
        longitudes.push(position.coords.longitude)
        times.push(newDate)
    }
    appendStartData(position){
        let newDate = new Date()
        this.setState({
            startLocation: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            starttime: newDate
        });
    }
    changeIsRunning(){
        this.setState({
            isRunning: ! this.state.isRunning
        });
    }
    toggleStopwatch() {
        this.setState({
            stopwatchStart: !this.state.stopwatchStart,
            stopwatchReset: false
        });
    }

    startRun = () =>{
        this.geoMute()
        this.changeIsRunning()
        navigator.geolocation.getCurrentPosition(this.appendStartData, this.geoFailure, options);
        this.geoListen()
    }
    continueRun(){
        this.changeIsRunning()
    }
    pauseRun = () =>{
        this.geoMute()
        this.changeIsRunning()
        navigator.geolocation.getCurrentPosition(this.appendData, this.geoFailure, options);
        this.geoListen()
    }
    finishRun(){
        console.log("Run is done")
    }

     render() {
         return (
             <View style={styles.fill}>
                 <View style={styles.centerItem}>
                     <Stopwatch laps msecs={false} start={this.state.stopwatchStart}
                         getTime={this.getFormattedTime} />
                     <Text> Time </Text>
                 </View>
                 <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                     <View style={styles.centerItemTop}>
                         <Text style={styles.ValueTop}>{this.state.pace}</Text>
                         <Text>Average (min/mi)</Text>
                     </View>
                    <View style={styles.centerItemTop}>
                        <Text style={styles.ValueTop}>{this.state.distance.toFixed(2)}</Text>
                        <Text>Distance (mi)</Text>
                    </View>
                </View>

                 <View style={styles.container}>
                     <MapView
                         style={styles.fill}
                         region={this.state.region}
                         showsUserLocation={true}
                         >
                     </MapView>
                 </View>

                 <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Button
                        title="Pause"
                        color= "#bfff80"
                        />

                    <Button
                        title="Start"
                        color={"blue"}
                        />
                    <Button
                        title= "Reset"
                        color= "red"
                        />
                 </View>

             </View>
        );
    }

}


#### End
