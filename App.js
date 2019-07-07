import React, {Component} from 'react';
import { Text, View, AppRegistry, ScrollView, StyleSheet, Switch, Picker, Button} from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Runr from './Components/Runr'
import {name as appName} from './app.json';
import AsyncStorage from '@react-native-community/async-storage';
import Summary from './Components/Summary'
import History from './Components/History'

 console.disableYellowBox = true;


const contentContainer = {
    flex: 1,
    backgroundColor: '#e6e6e6',
}
styles=StyleSheet.create({
    title: {
        fontFamily: 'GeezaPro-Bold',
        flex: 5,
        fontSize: 20,
        color: '#000080',
    },
    pickerStyleHidden: {
        display: 'none'
    },
    pickerStyleDisplayed: {
        width: 50
    },
    OkayDisplayed: {
        height: 50,
        width: 100,
        color: 'green'
    },
    lastPicker: {
        width: 250
    },
    value: {
        fontFamily: 'GeezaPro',
        color: 'black'
    },
    valueHidden: {
        fontFamily: 'GeezaPro',
        color: 'lightgrey'
    }
});


class RunrScreen extends Component {
    render() {
        return (
            <View style={contentContainer}>
                <View style={{flex:1, alignItems: 'center'}}>
                    <Text style={{flex:7}}></Text>
                    <Text style={styles.title}>Runr</Text>
                </View>
                <View style={{flex:11}}>
                    <Runr style={{flex:1}}/>
                </View>
            </View>
        );
    }
}
class MakrScreen extends Component {
    constructor(){
        super()
        this.state = {
            pace: '8: 00',
            enabled: false,
            picker: false,
            minutes: 60000 * 8,
            seconds: 0,
            setPaceEnabled: false,
            okay: false,
            metersEnabled: false,
            setMetersEnabled: false,
            distance: 50,
            enableOptionButton: false,
            enableOptionPicker: false,
            option: 'Slow Down/ Speed Up',
            meters: 50,
            optionChosen: 'Slow Down/ Speed Up',
        }
    }


    componentDidMount() {
        this.loadEnabledUserSettings()
        this.loadUserSettings('meters')
        this.loadUserSettings('option')
        this.loadUserSettings('pace')
        this.getAllKeys()
        this.printAll()
    }

    printAll = async () => {
        let values
        try {
            values = await AsyncStorage.multiGet(['enabled', 'meters', 'option', 'pace'])
        } catch(e) {
            console.log(e)
        }
        console.log(values)
    }




    loadEnabledUserSettings = async() =>{
        try {
            const value = await AsyncStorage.getItem('enabled')
            if(value !== null) {
                if(JSON.parse(value)){
                    this.setState({
                        enabled: ! this.state.enabled,
                        setPaceEnabled: ! this.state.setPaceEnabled,
                        metersEnabled: ! this.state.metersEnabled,
                        enableOptionButton: ! this.state.enableOptionButton
                    });
                }
            } else {
                this.storeData('enabled', JSON.stringify(this.state.enabled))
            }
        } catch(e) {
            console.log(e)
        }

    }
    clearAll = async () => {
        try {
            await AsyncStorage.clear()
        } catch(e) {
            console.log(e)
        }
        console.log('User Cleared')
    }

    loadUserSettings = async (key) => {
        try {
            let value = await AsyncStorage.getItem(key)
            if (value !== null){
                if (key === 'meters'){
                    this.setState({
                        distance : JSON.parse(value)
                    });
                } else if (key === 'option'){
                    this.setState({
                        option : value
                    });
                } else {
                    this.setState({
                        pace : this.convertMillis(JSON.parse(value))
                    });
                }
            } else {
                if (key === 'meters'){
                    this.storeData('meters', JSON.stringify(this.state.meters))
                } else if (key === 'option'){
                    this.storeData('option', this.state.optionChosen)
                } else {
                    this.storeData('pace', JSON.stringify(this.state.minutes + this.state.seconds))
                }
            }
        } catch(e) {
            console.log(e)
        }
    }





    convertMillis = (millis) =>{
        let minutes = Math.floor(millis / 60000);
        let seconds = Number.parseFloat(((millis % 60000) / 1000)).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    togglePicker = () =>{
        this.setState({
            picker: ! this.state.picker,
            setPaceEnabled: ! this.state.setPaceEnabled,
            okay: ! this.state.okay
        });
    }


    toggleEnabled = () =>{
        this.setState({
            enabled: ! this.state.enabled,
            setPaceEnabled: ! this.state.setPaceEnabled,
            metersEnabled: ! this.state.metersEnabled,
            enableOptionButton: ! this.state.enableOptionButton
        });
        this.removeValue('enabled')
        this.storeData('enabled', JSON.stringify(! this.state.enabled))
    }


    print = () =>{
        console.log("Minutes: " + this.state.minutes)
        console.log("Seconds: " + this.state.seconds)
    }

    updatePace = () =>{
        this.togglePicker()
        let newPace = this.convertMillis(this.state.minutes + this.state.seconds)
        this.setState({
            pace: newPace
        });
        this.removeValue('pace')
        this.storeData('pace', JSON.stringify(this.state.minutes + this.state.seconds))
        this.getAllKeys()

    }
    toggleMeters = () => {
        this.setState({
            metersEnabled: ! this.state.metersEnabled,
            okay: ! this.state.okay,
            setMetersEnabled: ! this.state.setMetersEnabled,
        });

    }
    toggleOptions = () => {
        this.setState({
            enableOptionButton: ! this.state.enableOptionButton,
            okay: ! this.state.okay,
            enableOptionPicker: ! this.state.enableOptionPicker
        });
    }
    updateOption = () => {
        this.toggleOptions()
        this.setState({
            option: this.state.optionChosen
        });
        this.removeValue('option')
        this.storeData('option', this.state.optionChosen)
        this.getAllKeys()
    }


    updateDistance = () => {
        this.toggleMeters()
        this.setState({
            distance: this.state.meters
        });
        this.removeValue('meters')
        this.storeData('meters', JSON.stringify(this.state.meters))
        this.getAllKeys()
    }

    storeData = async (key, item) => {
        try {
          await AsyncStorage.setItem(key, item)
        } catch (e) {
            console.log(e)
        }
    }

    removeValue = async (key) => {
        try {
            await AsyncStorage.removeItem(key)
        } catch(e) {
            console.log(e)
        }
        console.log(key + " Has been removed")
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
            <View style={contentContainer}>
                <View style={{flex:1, alignItems: 'center'}}>
                    <Text style={{flex:7}}></Text>
                    <Text style={styles.title}>Makr</Text>
                </View>

                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 5,

                  }}
                />
                <View style={{flex:11}}>

                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flex:1}}>
                        <Text style={{fontFamily: 'GeezaPro-Bold', fontSize: 20}}>Enabled</Text>
                        <Switch onValueChange = {this.toggleEnabled} value = {this.state.enabled}/>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flex: 1}}>
                        <Button
                            title={"Set Pace"}
                            color= "blue"
                            onPress={this.togglePicker}
                            disabled={! this.state.setPaceEnabled}
                            />
                        <Text style={this.state.enabled? styles.value : styles.valueHidden }>Pace: {this.state.pace}</Text>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flex: 1}}>
                        <Text onPress={this.updatePace}  style={this.state.picker && this.state.okay ? styles.OkayDisplayed : styles.pickerStyleHidden}>SET</Text>
                        <View>
                            <Picker
                                selectedValue={this.state.minutes}
                                style={this.state.picker ? styles.pickerStyleDisplayed : styles.pickerStyleHidden}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({minutes: itemValue})
                                }>
                                <Picker.Item label="0" value={0}/>
                                <Picker.Item label="1" value={1 * 60000}/>
                                <Picker.Item label="2" value={2 * 60000} />
                                <Picker.Item label="3" value={3 * 60000}/>
                                <Picker.Item label="4" value={4 * 60000} />
                                <Picker.Item label="5" value={5 * 60000} />
                                <Picker.Item label="6" value={6 * 60000} />
                                <Picker.Item label="7" value={7 * 60000} />
                                <Picker.Item label="8" value={8 * 60000}/>
                                <Picker.Item label="9" value={9 * 60000} />
                                <Picker.Item label="10" value={10 * 60000} />
                                <Picker.Item label="11" value={11 * 60000} />
                                <Picker.Item label="12" value={12 * 60000} />
                                <Picker.Item label="13" value={13 * 60000} />
                                <Picker.Item label="14" value={14 * 60000 }/>
                                <Picker.Item label="15" value={15 * 60000} />
                                <Picker.Item label="16" value={16 * 60000} />
                                <Picker.Item label="17" value={17 * 60000} />
                                <Picker.Item label="18" value={18 * 60000} />
                                <Picker.Item label="19" value={19 * 60000} />
                                <Picker.Item label="20" value={20 * 60000} />
                                <Picker.Item label="21" value={21 * 60000} />
                                <Picker.Item label="22" value={22 * 60000} />
                                <Picker.Item label="23" value={23 * 60000} />
                                <Picker.Item label="24" value={24 * 60000} />
                                <Picker.Item label="25" value={25 * 60000} />
                                <Picker.Item label="26" value={26 * 60000} />
                                <Picker.Item label="27" value={27 * 60000} />
                                <Picker.Item label="28" value={28 * 60000} />
                                <Picker.Item label="29" value={29 * 60000} />
                                <Picker.Item label="30" value={30 * 60000} />
                            </Picker>
                        </View>

                        <View>
                            <Picker
                                selectedValue={this.state.seconds}
                                style={this.state.picker ? styles.pickerStyleDisplayed : styles.pickerStyleHidden}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({seconds: itemValue})
                                }>
                                <Picker.Item label="0" value={0}/>
                                <Picker.Item label="1" value={1 * 1000}/>
                                <Picker.Item label="2" value={2 * 1000} />
                                <Picker.Item label="3" value={3 * 1000}/>
                                <Picker.Item label="4" value={4 * 1000} />
                                <Picker.Item label="5" value={5 * 1000} />
                                <Picker.Item label="6" value={6 * 1000} />
                                <Picker.Item label="7" value={7 * 1000} />
                                <Picker.Item label="8" value={8 * 1000}/>
                                <Picker.Item label="9" value={9 * 1000} />
                                <Picker.Item label="10" value={10 * 1000} />
                                <Picker.Item label="11" value={11 * 1000} />
                                <Picker.Item label="12" value={12 * 1000} />
                                <Picker.Item label="13" value={13 * 1000} />
                                <Picker.Item label="14" value={14 * 1000 }/>
                                <Picker.Item label="15" value={15 * 1000} />
                                <Picker.Item label="16" value={16 * 1000} />
                                <Picker.Item label="17" value={17 * 1000} />
                                <Picker.Item label="18" value={18 * 1000} />
                                <Picker.Item label="19" value={19 * 1000} />
                                <Picker.Item label="20" value={20 * 1000} />
                                <Picker.Item label="21" value={21 * 1000} />
                                <Picker.Item label="22" value={22 * 1000} />
                                <Picker.Item label="23" value={23 * 1000} />
                                <Picker.Item label="24" value={24 * 1000} />
                                <Picker.Item label="25" value={25 * 1000} />
                                <Picker.Item label="26" value={26 * 1000} />
                                <Picker.Item label="27" value={27 * 1000} />
                                <Picker.Item label="28" value={28 * 1000} />
                                <Picker.Item label="29" value={29 * 1000} />
                                <Picker.Item label="30" value={30 * 1000} />
                                <Picker.Item label="31" value={31 * 1000}/>
                                <Picker.Item label="32" value={32 * 1000} />
                                <Picker.Item label="33" value={33 * 1000}/>
                                <Picker.Item label="34" value={34 * 1000} />
                                <Picker.Item label="35" value={35 * 1000} />
                                <Picker.Item label="36" value={36 * 1000} />
                                <Picker.Item label="37" value={37 * 1000} />
                                <Picker.Item label="38" value={38 * 1000}/>
                                <Picker.Item label="39" value={39 * 1000} />
                                <Picker.Item label="40" value={40 * 1000} />
                                <Picker.Item label="41" value={41 * 1000} />
                                <Picker.Item label="42" value={42 * 1000} />
                                <Picker.Item label="43" value={43 * 1000} />
                                <Picker.Item label="44" value={44 * 1000 }/>
                                <Picker.Item label="45" value={45 * 1000} />
                                <Picker.Item label="46" value={46 * 1000} />
                                <Picker.Item label="47" value={47 * 1000} />
                                <Picker.Item label="48" value={48 * 1000} />
                                <Picker.Item label="49" value={49 * 1000} />
                                <Picker.Item label="50" value={50 * 1000} />
                                <Picker.Item label="51" value={51 * 1000} />
                                <Picker.Item label="52" value={52 * 1000} />
                                <Picker.Item label="53" value={53 * 1000} />
                                <Picker.Item label="54" value={54 * 1000} />
                                <Picker.Item label="55" value={55 * 1000} />
                                <Picker.Item label="56" value={56 * 1000} />
                                <Picker.Item label="57" value={57 * 1000} />
                                <Picker.Item label="58" value={58 * 1000} />
                                <Picker.Item label="59" value={59 * 1000} />
                            </Picker>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flex: 1}}>
                        <Button
                            title={"Set Meters Intervals"}
                            color= "blue"
                            onPress={this.toggleMeters}
                            disabled={! this.state.metersEnabled}
                            />
                        <Text style={this.state.enabled? styles.value : styles.valueHidden }>Intervals: {this.state.distance}</Text>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flex: 1}}>
                        <Text onPress={this.updateDistance}  style={this.state.setMetersEnabled && this.state.okay ? styles.OkayDisplayed : styles.pickerStyleHidden}>SET</Text>
                        <Picker
                            selectedValue={this.state.meters}
                            style={this.state.setMetersEnabled ? styles.pickerStyleDisplayed : styles.pickerStyleHidden}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({meters: itemValue})
                            }>
                            <Picker.Item label="50" value={50} />
                            <Picker.Item label="100" value={100} />
                            <Picker.Item label="150" value={150} />
                            <Picker.Item label="200" value={200} />
                            <Picker.Item label="250" value={250} />
                            <Picker.Item label="300" value={300} />
                            <Picker.Item label="350" value={350} />
                            <Picker.Item label="400" value={400} />
                        </Picker>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flex: 1}}>
                        <Button
                            title={"Set Option"}
                            color= "blue"
                            onPress={this.toggleOptions}
                            disabled={! this.state.enableOptionButton}
                            />
                        <Text style={this.state.enabled? styles.value : styles.valueHidden }>Option: {this.state.option}</Text>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flex: 1}}>
                        <Text onPress={this.updateOption}  style={this.state.enableOptionPicker && this.state.okay ? styles.OkayDisplayed : styles.pickerStyleHidden}>SET</Text>

                        <Picker
                            selectedValue={this.state.optionChosen}
                            style={this.state.enableOptionPicker ? styles.lastPicker : styles.pickerStyleHidden}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({optionChosen: itemValue})
                            }>
                            <Picker.Item label="Slow Down/ Speed Up" value={'Slow Down/ Speed Up'} />
                            <Picker.Item label="Say Current Pace" value={"Say Current Pace"} />
                        </Picker>
                    </View>





                </View>

            </View>
        );
    }
}
class TrakrScreen extends Component {
    render() {
        return (
            <View style={contentContainer}>
                <View style={{flex:1, alignItems: 'center'}}>
                    <Text style={{flex:7}}></Text>
                    <Text style={styles.title}>Trackr</Text>
                </View>
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 5,

                  }}
                />
                <View style={{flex:11}}>
                    <History />
                </View>
            </View>
        );
    }
}



const TabNavigator = createBottomTabNavigator({
    Makr: MakrScreen,
    Runr: RunrScreen,
    Trakr: TrakrScreen
});



AppRegistry.registerComponent(appName, () => WholeProj);
export default createAppContainer(TabNavigator);
