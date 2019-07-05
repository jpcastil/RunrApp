import React, {Component} from 'react';
import {AppRegistry,StyleSheet,Text,View,AsyncStorage, Button, Alert, FlatList} from 'react-native';
import Summary from './Summary'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
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
        let returnVal = months[ parsed.getMonth() ] + ' ' + parsed.getDay() + ', ' + parsed.getFullYear()
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
                                    });
                                    }} style={{fontSize: 30, color: 'blue', paddingRight: 10}}>>></Text>
                            </View>
                        </View>
                        }
                    />
                </View>

                <View style={[! this.state.display ? styless.displayNone : styless.displayFlex]}>
                    <Summary runObject={this.state.runObject} func={this.changeDisplay}/>
                </View>
            </View>
       );
   }
}
