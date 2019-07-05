import React, {Component} from 'react';
import {AppRegistry,StyleSheet,Text,View,AsyncStorage, Button, Alert, SafeAreaView, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
import Tts from 'react-native-tts';

stylo=StyleSheet.create({
    textValueBold : {
        fontSize: 16,
        fontFamily: 'GeezaPro-Bold'
    },
    textValue: {
        fontSize: 16,
        fontFamily: 'GeezaPro'
    },
    backGroundGrey: {
        backgroundColor:'#f2f2f2'
    },
    centerAlign: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

});

export default class Summary extends Component {

    constructor(props){
        super(props)

    }


    render() {
        return (
            <View style={{flex: 1}}>
                <View style={[stylo.centerAlign, stylo.backGroundGrey]}>
                    <Text style={{fontSize: 40, fontFamily: 'GeezaPro'}}>{this.props.runObject.day}</Text>
                    <Text>{this.props.runObject.date}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={stylo.centerAlign}>
                        <Text style={stylo.textValueBold}>Distance</Text>
                        <Text style={stylo.textValue}>{this.props.runObject.distance}</Text>
                    </View>
                    <View style={stylo.centerAlign}>
                        <Text style={stylo.textValueBold}>Time</Text>
                        <Text style={stylo.textValue}>{this.props.runObject.time}</Text>
                    </View>
                </View>
                <View style={[stylo.centerAlign, stylo.backGroundGrey]}>
                    <Text style={stylo.textValueBold}>Average</Text>
                    <Text style={stylo.textValue}>{this.props.runObject.pace}</Text>
                </View>
                <View style={stylo.centerAlign}>
                    <Button
                      title="Rendr"
                      color="red"
                    />
                </View>
                <View style={{flex: 3, backgroundColor:'#f2f2f2'}}>
                </View>
                <View style={stylo.centerAlign}>
                    <Button
                        onPress={this.props.func}
                        title="I'm Done"
                        color="blue"
                    />
                </View>


            </View>
       );
   }
}
