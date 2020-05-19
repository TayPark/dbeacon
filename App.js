import React, { Component } from "react";
import {
  StyleSheet,
  BackHandler,
  Alert
} from "react-native";
import Main from "./Components/Main";
import Login from "./Components/Login";
import Register from "./Components/Register";
import MyPage from "./Components/MyPage";
import EditProfile from "./Components/EditProfile";
import CheckPass from "./Components/CheckPass";
import LostPass from "./Components/LostPass"
import ChangePass from "./Components/ChangePass"
import {
  Scene,
  Router,
  Overlay,
  Modal,
  Stack,
  Actions,
} from "react-native-router-flux";

import AsyncStorage from '@react-native-community/async-storage';
import { StackViewStyleInterpolator } from "react-navigation-stack";

const DBEACON_TOKEN = 'dblab_dbeacon';

const prefix = Platform.OS === "android" ? "mychat://mychat/" : "mychat://";

const transitionConfig = () => ({
  screenInterpolator: StackViewStyleInterpolator.forFadeFromBottomAndroid,
});

export function alert (title, msg) {
  Alert.alert(
    title,
    msg,
    [
      { text: "확인" }
    ],
    { cancelable: true }
  )
}

export default class App extends Component {
  state = {
    isLogin: false,
  };

  async isLoggedin() {
    const val = await AsyncStorage.getItem(DBEACON_TOKEN);
    if (val !== null) {
      this.setState({ isLogin: true });
    } else {
      this.setState({ isLogin: false });
    }
  }

  componentDidMount() {
    this.isLoggedin();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    this.exitApp = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
    if (this.exitApp == undefined || !this.exitApp) {
      if(Actions.currentScene !== 'Main' || Actions.currentScene !== 'Login'){
        this.exitApp = true;

        this.timeout = setTimeout(
            () => {
                this.exitApp = false;
            },
            2000    // 2초
        );
      } else {
        this.exitApp = false;
        Actions.pop();
      }

    } else {
        clearTimeout(this.timeout);

        BackHandler.exitApp();  // 앱 종료
    }
    return true;
}
  render() {
    return (
        <Router
          sceneStyle={styles.scene}
          uriPrefix={prefix}
        >
          <Overlay key="overlay">
            <Modal key="modal" hideNavBar transitionConfig={transitionConfig}>
              {this.state.isLogin ? (
                <Stack
                  key="root"
                  titleStyle={{ alignSelf: "center" }}
                  hideNavBar
                >
                  <Scene key="Main" component={Main} title="main" initial />
                  <Scene key="Login" component={Login} title="Login" />
                  <Scene key="Register" component={Register} title="Register" />
                  <Scene key="MyPage" component={MyPage} title="MyPage" />
                  <Scene key="EditProfile" component={EditProfile} title="EditProfile" />
                  <Scene key="CheckPass" component={CheckPass} title="CheckPass" />
                  <Scene key="LostPass" component={LostPass} title="LostPass" />
                  <Scene key="ChangePass" component={ChangePass} title="ChangePass" />
                </Stack>
              ) : (
                <Stack
                  key="root"
                  titleStyle={{ alignSelf: "center" }}
                  hideNavBar
                >
                  <Scene key="Main" component={Main} title="main" />
                  <Scene key="Login" component={Login} title="Login" initial />
                  <Scene key="Register" component={Register} title="Register" />
                  <Scene key="MyPage" component={MyPage} title="MyPage" />
                  <Scene key="EditProfile" component={EditProfile} title="EditProfile" />
                  <Scene key="CheckPass" component={CheckPass} title="CheckPass" />
                  <Scene key="LostPass" component={LostPass} title="LostPass" />
                  <Scene key="ChangePass" component={ChangePass} title="ChangePass" />
                </Stack>
              )}
            </Modal>
          </Overlay>
        </Router>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
