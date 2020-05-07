import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
  DeviceEventEmitter
} from "react-native";
import {
  Actions,
} from "react-native-router-flux";
import Beacons from 'react-native-beacons-manager';
import { SafeAreaView } from 'react-native-safe-area-context';
import {PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment'
const DBEACON_TOKEN = 'dblab_dbeacon';

async function requestPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
  } catch (err) {
    console.warn(err);
  }
}

requestPermission();

Beacons.detectIBeacons();

Beacons.startRangingBeaconsInRegion('Region1');

class NavBar extends Component {
  //상단바 컴포넌트
  render() {
    return (
      <View style={styles.navBar}>
        <Text style={styles.navBarText}>MainPage</Text>
      </View>
    );
  }
}

class Button extends Component {
  //버튼
  async _SendFunction(text) {
    try{
      const val = await AsyncStorage.getItem(DBEACON_TOKEN);
      if(val !== null){
        const UserInfo = JSON.parse(val);
        fetch("https://api.chiyak.duckdns.org/records/insert", {
          method: "POST", 
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uid: UserInfo['uid'],
            name: UserInfo['name'],
            depart: UserInfo['depart'],
            type: text
          })
        })
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData);
        })
        .done();
      }
    }
    catch(e) {
      console.log(e);
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity
            activeOpacity = { .5 } 
            disabled={this.props.ButtonStateHolder}
            onPress={() => this._SendFunction(this.props.type)}
        >
          <Image
            source={this.props.source}
            style={{ width: "100%", height: "100%" }}
          />
          <View />
        </TouchableOpacity>
      </View>
    );
  }
}

class User extends Component {
  //유저 컴포넌트
  state = {
    UserName: '',
    UserDep: ''
  };
  async _getUserInfo() {
    try{
      const val = await AsyncStorage.getItem(DBEACON_TOKEN);
      if(val !== null){
        const UserInfo = JSON.parse(val);
        this.setState({UserName:UserInfo['name']});
        this.setState({UserDep:UserInfo['depart']});
      }
    }
    catch(e) {
      console.log(e);
    }
  } 
  async _userLogout() {
    try {
      await AsyncStorage.removeItem(DBEACON_TOKEN);
      alert("로그아웃 완료!");
      Actions.Login();
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }
  componentDidMount() {
    this._getUserInfo();
  }
  render() {
    return (
      <View style={styles.user}>
        <View
          style={{ flex: 1.5, flexDirection: "row", alignItems: "center" }}
        >
          <View style={{ width: 110 }}>
            <Image
              style={{ height: "100%", width: "100%" }}
              source={require("../assets/man.jpeg")}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text> {this.state.UserName} </Text>
            <Text> {this.state.UserDep} </Text>
          </View>
        </View>
        <View
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              borderWidth: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => 
              Actions.MyPage()
            }
          >
            <Text style={{fontSize: 18}}>전체이력</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              borderWidth: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => null}
          >
            <Text style={{fontSize: 18}}>최근이력</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              height: 50,
              flexDirection: "row",
              borderWidth: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => this._userLogout()}
          >
            <Text style={{fontSize: 18}}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class ButtonGroup extends Component {
  // 버튼 컴포넌트
  constructor(){
 
    super();
 
    this.state={
      ButtonStateHolder : false
    }
    this.listener = DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
      if (data.beacons.length) {
        this.setState({
          ButtonStateHolder : false
        })
      }
      else {
        this.setState({
          ButtonStateHolder : true
        })
      }
    });
  }
  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners()
  }
  render() {
    return (
      <View style={styles.buttonGroup}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Button 
              source={require("../assets/출근1.png")}
              ButtonStateHolder={this.state.ButtonStateHolder}
              type='출근'
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button 
              source={require("../assets/퇴근1.png")} 
              ButtonStateHolder={this.state.ButtonStateHolder}
              type='퇴근'
            />
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Button 
              source={require("../assets/외근1.png")} 
              ButtonStateHolder={this.state.ButtonStateHolder}
              type='외근'
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button 
              source={require("../assets/복귀1.png")} 
              ButtonStateHolder={this.state.ButtonStateHolder}
              type='복귀'
            />
          </View>
        </View>
      </View>
    );
  }
}

class Mainpage extends Component {
  //메인페이지
  render() {
    return (
      <View style={styles.container}>
        <NavBar />
        <User />
        <ButtonGroup />
        <View style={{width:"100%", height:"5%"}}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  navBar: {
    width:"100%",
    height:"5%",
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
  },

  navBarText: {
    fontSize: 20,
    color: "white",
  },
  user: {
    width:"100%",
    height:"30%",
    backgroundColor: "white",
  },
  buttonGroup: {
    width:"100%",
    height:"60%",
    backgroundColor: "white",
  },
  taps: {
    height: 80,
    backgroundColor: "white",
  },
  and: {
    flex: 1,
  },
});

export default Mainpage;