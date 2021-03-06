import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar } from "react-native";
import { Picker } from "@react-native-community/picker";
import DatePicker from "./_datePicker";
import ScrollList from "./_lists";
import { Actions } from "react-native-router-flux";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class MyPage extends React.Component {
    state = {
      selected: "today",
      uid: "",
      startTime: this.props.startTime || new Date().getFullYear() + "-" + (((new Date().getMonth() + 1) <= 10) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + ((new Date().getDate() <= 10) ? "0" + new Date().getDate() : new Date().getDate()),
      endTime: this.props.endTime || new Date().getFullYear() + "-" + (((new Date().getMonth() + 1) <= 10) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + (((new Date().getDate() + 1) <= 10) ? "0" + (new Date().getDate() + 1) : (new Date().getDate() + 1)),
      show: true,
    };

  _updateStartTime = (value) => {
    this.setState({
      startTime: value,
    });
  };

  _updateEndTime = (value) => {
    this.setState({
      endTime: value,
    });
  };

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.startTime !== this.state.startTime || prevState.endTime !== this.state.endTime) {
      this._setTerm(this.state.selected);
    }
  }

  // 기간 지정, 지정 후 제출 했을 때만 넘어감
  _setTerm = (selected) => {
    if (selected === "today") {
      this.setState({
        startTime: this.props.startTime || new Date().getFullYear() + "-" + (((new Date().getMonth() + 1) <= 10) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + ((new Date().getDate() <= 10) ? "0" + new Date().getDate() : new Date().getDate()),
        endTime: this.props.endTime || new Date().getFullYear() + "-" + (((new Date().getMonth() + 1) <= 10) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + (((new Date().getDate() + 1) <= 10) ? "0" + (new Date().getDate() + 1) : (new Date().getDate() + 1)),
      });
    } else if (selected === "total") {
      this.setState({
        startTime: "2020-01-01",
        endTime: this.props.endTime || new Date().getFullYear() + "-" + (((new Date().getMonth() + 1) <= 10) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + (((new Date().getDate() + 1) <= 10) ? "0" + (new Date().getDate() + 1) : (new Date().getDate() + 1)),
      });
    }
  };

  render() {
    return (
      <SafeAreaProvider>
        <View style={styles.navBar}>
          {/* 상단 바 */}
          <Text style={styles.navText}>근태기록</Text>
        </View>
        <View style={styles.selectBox}>
          {/* 선택 박스 */}
          <Picker
            selectedValue={this.state.selected}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue) =>
              {
                if (itemValue === "today") {
                 this.setState({ 
                  selected: itemValue,
                  startTime: this.props.startTime || new Date().getFullYear() + "-" + (((new Date().getMonth() + 1) <= 10) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + ((new Date().getDate() <= 10) ? "0" + new Date().getDate() : new Date().getDate()),
                  endTime: this.props.endTime || new Date().getFullYear() + "-" + (((new Date().getMonth() + 1) <= 10) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + (((new Date().getDate() + 1) <= 10) ? "0" + (new Date().getDate() + 1) : (new Date().getDate() + 1))
                 })
                } else if ( itemValue === "total" ) {
                  this.setState({
                    selected: itemValue,
                    startTime: "2020-01-01",
                    endTime: this.props.endTime || new Date().getFullYear() + "-" + (((new Date().getMonth() + 1) <= 10) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + (((new Date().getDate() + 1) <= 10) ? "0" + (new Date().getDate() + 1) : (new Date().getDate() + 1))
                  })
                } else {
                  this.setState({
                    selected: itemValue
                  })
                }
              }
            }
          >
            <Picker.Item label="오늘" value="today" />
            <Picker.Item label="전체" value="total" />
            <Picker.Item label="기간 지정" value="userSelect" />
          </Picker>
        </View>
        {this.state.selected === "userSelect" ? (
          <View style={styles.calendarBox}>
            {/* 날짜 선택기 */}
            <View style={styles.divideBox}>
              {/* 날짜 시작 */}
              <DatePicker updateState={this._updateStartTime} />
            </View>
            <View style={styles.divideBox}>
              {/* 날짜 끝 */}
              <DatePicker updateState={this._updateEndTime} />
            </View>
          </View>
        ) : null}
        <View style={styles.mainView}>
         {this.state.show ? 
         <ScrollList 
           startTime={this.state.startTime}
           endTime={this.state.endTime}
         /> : null}
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  navBar: {
    flex: 0.7,
    backgroundColor: "#007bff",
    justifyContent: "center",
  },
  selectBox: {
    flex: 0.5,
    flexDirection: "row",
  },
  calendarBox: {
    flex: 0.7,
    borderBottomColor: "#007bff",
    borderBottomWidth: 0.5,
    flexDirection: "row",
  },
  divideBox: {
    flex: 1,
  },
  mainView: {
    flex: 6,
  },
  navText: {
    marginTop: 15,
    marginLeft: 15,
    fontSize: 25,
    fontWeight: "bold",
    alignContent: "center",
    alignItems: "center",
    color: "white",
  },
  normalText: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 15,
  },
  button: {
    flex: 1,
    width: 130,
    height: 200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#007bff",
    margin: 5,
  },
  datebox: {
    width: 150,
    height: 100,
    marginHorizontal: -23,
    marginVertical: 7
  }
});
