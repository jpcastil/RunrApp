import React, {Component} from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import WholeProj from './Components/WholeProj'
const contentContainer = {
    flex: 1,
    backgroundColor: 'lightgray',
}

class MakrScreen extends Component {
    render() {
        return (
            <View style={contentContainer}>
                <View style={{flex:1, alignItems: 'center'}}>
                    <Text style={{flex:7}}></Text>
                    <Text style={{flex:5}}>Runr</Text>
                </View>
                <View style={{flex:11}}>
                    <WholeProj style={{flex:1}}/>

                </View>
            </View>
        );
    }
}

class RunrScreen extends Component {
    render() {
        return (
            <View >
                <Text>Home!</Text>
            </View>
        );
    }
}
class TrakrScreen extends Component {
    render() {
        return (
            <View >
                <Text>Home!</Text>
            </View>
        );
    }
}



const TabNavigator = createBottomTabNavigator({
    Makr: MakrScreen,
    Runr: RunrScreen,
    Trakr: TrakrScreen
});

export default createAppContainer(TabNavigator);
