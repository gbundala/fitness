import React, { Component } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  getDailyReminderValue,
  getMetricMetaInfo,
  timeToString,
} from "../utils/helpers";
import DateHeader from "./DateHeader";
import FitSlider from "./FitSlider";
import FitStepper from "./FitStepper";
import { Ionicons } from "@expo/vector-icons";
import TextButton from "./TextButton";
import { removeEntry, submitEntry } from "../utils/api";
import { purple, white } from "../utils/colors";
import { addEntry } from "../redux/entry/entry.actions";
import { add } from "react-native-reanimated";
import { connect } from "react-redux";
import { CommonActions } from "@react-navigation/native";

const SubmitBtn = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={
        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.androidSubmitBtn
      }
      onPress={onPress}
    >
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  );
};

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  };

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState((state) => {
      const count = state[metric] + step;

      return {
        ...state,
        [metric]: count > max ? max : count,
      };
    });
  };

  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step;

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      };
    });
  };

  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value,
    }));
  };

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    //Update redux
    this.props.dispatch(
      addEntry({
        [key]: entry,
      })
    );

    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    }));

    //Navigate to Home using NavigationActions
    this.toHome();

    //Update Async Storage: i.e.Save to 'DB' -- RN Async Storage used as abstract concept of the DB
    submitEntry({ key, entry });

    //Clear Local Notification
  };

  reset = () => {
    const key = timeToString();

    // Update Redux
    this.props.dispatch(
      addEntry({
        [key]: getDailyReminderValue(),
      })
    );

    //Update 'DB'
    removeEntry(key);
  };

  toHome = () => {
    const { navigation } = this.props;
    navigation.dispatch(CommonActions.goBack());
  };

  render() {
    const metaInfo = getMetricMetaInfo();

    //Conditionally render this only after user logs in the data
    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === "ios" ? "ios-happy" : "md-happy"}
            size={100}
          />
          <Text>You already logged your information for today!</Text>
          <TextButton style={{ padding: 10 }} onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      );
    }

    //Conditionally render this if the user has not yet logged data
    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />

        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...otherProps } = metaInfo[key];
          const value = this.state[key];
          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === "slider" ? (
                <FitSlider
                  value={value}
                  onChange={(value) => this.slide(key, value)}
                  {...otherProps}
                />
              ) : (
                <FitStepper
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...otherProps}
                />
              )}
            </View>
          );
        })}

        <SubmitBtn onPress={this.submit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30,
    marginLeft: 30,
  },
});

const mapStateToProps = (reduxstate) => {
  //FIXME: Refactor all key constants to 'today' to be more explicit
  const state = reduxstate.entry;
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === "undefined",
  };
};

export default connect(mapStateToProps)(AddEntry);
