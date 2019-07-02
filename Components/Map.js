import React, {Component} from 'react';
import {AppRegistry,StyleSheet,Text,View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';


const styles = StyleSheet.create({
     container: {
       ...StyleSheet.absoluteFillObject,
       height: 400,
       width: 400,
       justifyContent: 'flex-end',
       alignItems: 'center',
     },
     map: {
       ...StyleSheet.absoluteFillObject,
     },
});




export default class Map extends Component {



    constructor(){
        super();
        this.state = {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121
            },
            location: {latitude:null, longitude:null},
            error: null

        }
    }

    componentDidMount(){
        /*let geoOptions = {
            enableHighAccuracy: true,
            timeOut: 20000,
            maximumAge: 60 * 60 * 24
        };*/
        let options = {
            enableHighAccuracy: false,
            timeOut: 100,
            maximumAge: 60 * 60 * 24,
            distanceFilter: 0
        };
        this.setState({ready:false, error: null });
        navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoFailure, options);

        }

    geoSuccess = (position) => {
        this.setState({
            ready:true,
            location: {lattitude: position.coords.latitude,longitude:position.coords.longitude },
            region: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121
            }
        })
        console.log("Latitude" + " " +position.coords.latitude + "  " + "longitude" + " " + position.coords.longitude);


    }

    geoFailure = (err) => {
        this.setState({error: err.message});
    }



    render() {
        return (
            <MapView
                style={styles.map}
                region={this.state.region}
                >
            <MapView.Marker
                coordinate={{latitude: this.state.region.latitude,
                longitude: this.state.region.longitude}}
                title={"Home"}
                description={"This is a test"}
                />
            </MapView>
      );
    }

}

AppRegistry.registerComponent('Map', () => Map);
