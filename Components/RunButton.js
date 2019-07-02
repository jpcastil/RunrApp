import React, {Component} from 'react';
import {AppRegistry,StyleSheet,Text,View, Button} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

export default class RunButton extends Component {

    constructor(){
        super();
        this.state = {
            title: "Start Run"
        }
    }

    

    render() {
        return (
            <Button
                title= {this.state.title}
                ></Button>

      );
    }

}

AppRegistry.registerComponent(RunButton, () => RunButton);
