import React, { Component } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { connect } from "react-redux";
import { addEntry, receiveEntries } from "../redux/entry/entry.actions";
import { fetchCalenderResults } from "../utils/api";
import { getDailyReminderValue, timeToString } from "../utils/helpers";
import { Agenda } from "react-native-calendars";
import { white } from "../utils/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import MetricCard from "./MetricCard";
import { AppLoading } from "expo";

class History extends Component {
  state = {
    ready: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    console.log("called in Component Did Mount", timeToString());
    console.log(this.props.navigation);

    fetchCalenderResults()
      .then((entries) => dispatch(receiveEntries(entries)))
      .then(({ entries }) => {
        if (true) {
          //FIXME: return the conditional statement -->  !entries[timeToString()]
          dispatch(
            addEntry({
              [timeToString()]: getDailyReminderValue(),
            })
          );
        }
      })
      .then(() =>
        this.setState(() => ({
          ready: true,
        }))
      )
      .catch((error) => {
        console.log("error in receiving or dispatching entries", error);
      });

    //TODO: Try to implement the Async Await version of this
    //     fetchCalenderResults = async () => {
    // const Entries =
    //     }
    //       .then((entries) => dispatch(receiveEntries(entries)))
    //       .then(({ entries }) => {
    //         if (!entries[timeToString()]) {
    //           dispatch(
    //             addEntry({
    //               [timeToString()]: getDailyReminderValue(),
    //             })
    //           );
    //         }
    //       })
    //       .catch((error) => {
    //         console.log("error in receiving entries", error);
    //       });
  }

  pressedDay;
  onDayPressed = (day) => {
    console.log("day pressed", day.dateString);
    this.pressedDay = day;
    console.log("this is pressed day value", this.pressedDay);
  };

  renderItem = (item, key) => {
    // const { entries } = this.props;
    // console.log("entries called", entries);
    console.log("item is called", item);
    console.log("key is called", this.pressedDay);
    const { today, ...metrics } = item;
    return (
      <View style={styles.item}>
        {today ? (
          <View>
            <Text style={styles.noDataText}>{today}</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("EntryDetail", {
                entryId: "2020-11-21",
              })
            }
          >
            <MetricCard metrics={metrics} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderDay = (day, item) => {
    console.log("Day in RenderDay", day);
    console.log("Item in RenderDay", item);

    // return (
    //   <View style={styles.item}>
    //     <Text></Text>
    //   </View>
    // );
  };

  renderEmptyDate = () => (
    <View style={styles.item}>
      <Text style={styles.noDataText}>No Data for this day 😊</Text>
    </View>
  );

  render() {
    const { ready } = this.state;
    if (ready === false) {
      return <AppLoading />;
    }

    const { entries } = this.props;
    const entriesArray = Object.keys(entries).map((key) => [
      [key],
      entries[key],
    ]);

    //FIXME: return empty for all those days that return null as the metric -- rechech the Agenda Component documentation
    const entriesObject = entriesArray.reduce((accumulator, currentValue) => {
      const key = currentValue[0];
      const value = currentValue[1];
      accumulator[key] = [value];
      return accumulator;
    }, {});

    console.log("Called in Render", entries);
    return (
      <Agenda
        //FIXME: renderEmptyDate is not passed. Fix the bug that renders an empty object before data is store in redux
        items={entriesObject}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
        onDayPress={this.onDayPressed}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === "ios" ? 16 : 2,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: "center",
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: "rgba(0,0,0,0.24)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

const mapStateToProps = (state) => ({
  entries: state.entry,
});

export default connect(mapStateToProps)(History);
