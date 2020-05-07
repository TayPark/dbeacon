import React, { Component } from "react";
import {
  StyleSheet,
  BackHandler,
} from "react-native";
import Main from "./Components/Main";
import Login from "./Components/Login";
import Register from "./Components/Register";
import MyPage from "./Components/MyPage";
import {
  Scene,
  Router,
  Overlay,
  Modal,
  Stack,
} from "react-native-router-flux";

import AsyncStorage from '@react-native-community/async-storage';
import { StackViewStyleInterpolator } from "react-navigation-stack";

const DBEACON_TOKEN = 'dblab_dbeacon';

const prefix = Platform.OS === "android" ? "mychat://mychat/" : "mychat://";

const transitionConfig = () => ({
  screenInterpolator: StackViewStyleInterpolator.forFadeFromBottomAndroid,
});

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
    this.homeBackPressHandler = BackHandler.addEventListener(
      "homeBackPress",
      () => {
        BackHandler.exitApp();
      }
    );
  }

  componentWillUnmount() {
    this.homeBackPressHandler.remove();
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