import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { addEntry } from "../redux/entry/entry.actions";
import { removeEntry } from "../utils/api";
import { white } from "../utils/colors";
import { getDailyReminderValue, timeToString } from "../utils/helpers";
import MetricCard from "./MetricCard";
import TextButton from "./TextButton";

class EntryDetail extends Component {
  reset = () => {
    const { remove, goBack, entryId } = this.props;

    remove();
    goBack();
    removeEntry(entryId);
  };

  // shouldComponentUpdate(nextProps) {
  //   return nextProps.metrics !== null && !nextProps.metrics.today;
  // }

  render() {
    const { metrics } = this.props;

    return (
      <View style={styles.container}>
        {metrics !== null && !metrics.today ? (
          <MetricCard metrics={metrics} />
        ) : (
          <Text>No data today!</Text>
        )}
        <TextButton onPress={this.reset} style={{ margin: 20 }}>
          {" "}
          RESET
        </TextButton>
        {/* <TextButton  style={{ margin: 20 }}>
          {" "}
          SHARE
        </TextButton> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15,
  },
});

//TODO: Review whether the entire of the entries obj is pulled here. Refactor to the return prop for metrics to be 'metrics: state.entry[entryId]'
const mapStateToProps = (state, { route }) => {
  const { entryId } = route.params;
  const entries = state.entry;
  const metrics = entries[entryId];

  return {
    metrics,
  };
};

const mapDispatchToProps = (dispatch, { route, navigation }) => {
  const { entryId } = route.params;

  return {
    remove: () =>
      dispatch(
        addEntry({
          [entryId]:
            timeToString() === entryId ? getDailyReminderValue() : null,
        })
      ),
    goBack: () => navigation.goBack(),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail);
