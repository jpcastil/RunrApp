import React, {Component} from 'react';
import {AppRegistry,StyleSheet,Text,View,AsyncStorage, Button, Alert, FlatList} from 'react-native';
import Summary from './Summary'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December']
styless=StyleSheet.create({
    backLight: {
        height: 90,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        backgroundColor: '#d9d9d9',
    },
    backDark: {
        height: 90,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        backgroundColor: '#cccccc',
    },
    displayNone: {
        display: 'none'
    },
    displayFlex: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    }



});


export default class History extends Component {

    constructor(){
        super()
        this.state = {
            flatListData: [],
            display: false,
            runObject : {
                day: 'PlaceHolderTest',
                date: 'PlaceHolder Date',
                distance: 'Distance',
                time: 'PlaceHolder Time',
                pace: 'PACEHolder',
            },
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
        }
    }

    changeDisplay = () => {
        this.setState({
            display: ! this.state.display
        });
    }

    componentDidMount(){
        this.updateFlatListData()
    }

    getFullDate = (starttime) => {
        let parsed = new Date(starttime)
        let returnVal = months[ parsed.getMonth() ] + ' ' + parsed.getDate() + ', ' + parsed.getFullYear()

        return returnVal
    }

    convertMillis = (millis) =>{
        let minutes = Math.floor(millis / 60000);
        let seconds = Number.parseFloat(((millis % 60000) / 1000)).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    getTime = (starttime, endTime) => {
        let parsedStart = new Date(starttime)
        let parsedEnd = new Date(endTime)
        let deltaMillis = parsedEnd - parsedStart
        let formatted = this.convertMillis(deltaMillis)
        return formatted

    }

    updateFlatListData = () => {
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (err, stores) => {
                let newArr = stores.filter(function(arr) {
                    if (arr[1][0] === '{'){
                        return true
                    } else {
                        return false
                    }
                })
                newArr = newArr.map(function(thing){
                    return JSON.parse(thing[1])
                })
                newArr.sort(function(a,b){
                    let aDate = new Date(a.starttime)
                    let bDate = new Date(b.starttime)
                    return bDate.getTime() - aDate.getTime() });
                this.setState({
                    flatListData: newArr
                });
          });
        });

    }


    printF = () =>{
        console.log(this.state.flatListData)
        let parsed1 = this.state.flatListData[0].starttime
        let parsed2 = new Date(parsed1)
        console.log(parsed2)
    }




    render() {
        return (
            <View style={{flex: 1}}>
                <View style={[this.state.display ? styless.displayNone : styless.displayFlex]}>
                    <Button
                        title="Refresh"
                        onPress={this.updateFlatListData}
                    />
                    <FlatList
                        data={this.state.flatListData}
                        renderItem={({item, index}) =>
                        <View style={[index % 2 === 0 ? styless.backLight : styless.backDark]} >
                            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                                <Text style={{fontFamily: 'GeezaPro-Bold', fontSize: 25}}>{this.getFullDate(item.starttime)}</Text>
                            </View>
                            <View style={{flex: 1,justifyContent: 'center', alignItems: 'center' }} >
                                <Text>{Number.parseFloat(item.distance).toFixed(2)} mi</Text>
                                <Text >Time: {this.getTime(item.starttime, item.endTime)}</Text>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                    <Text onPress={() => {

                                    let parsed = new Date(item.starttime)


                                    this.setState({
                                        display: ! this.state.display,
                                        runObject : {
                                            day: days[parsed.getDay()],
                                            date: this.getFullDate(item.starttime),
                                            distance: Number.parseFloat(item.distance).toFixed(2),
                                            time: this.getTime(item.starttime, item.endTime),
                                            pace: item.avgPace,
                                        },
                                        regionSummary:{
                                            latitude: item.startLocation.latitude,
                                            longitude: item.startLocation.longitude,
                                            latitudeDelta: item.distance * 0.03,
                                            longitudeDelta: item.distance * 0.03
                                        },
                                        coordinates: item.coordinates

                                    });
                                    }} style={{fontSize: 30, color: 'blue', paddingRight: 10}}>>></Text>
                            </View>
                        </View>
                        }
                    />
                </View>

                <View style={[! this.state.display ? styless.displayNone : styless.displayFlex]}>
                    <Summary runObject={this.state.runObject} func={this.changeDisplay} region={this.state.regionSummary} coordinates={this.state.coordinates}/>
                </View>
            </View>
       );
   }
}
