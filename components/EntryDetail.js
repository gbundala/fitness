import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { white } from "../utils/colors";
import MetricCard from "./MetricCard";

class EntryDetail extends Component {
  render() {
    const { metrics } = this.props;
    console.log("called Metrics in EntryDetail", metrics);
    return (
      <View style={styles.container}>
        {/* <MetricCard metrics={metrics} /> */}
        <Text>
          Entry Detail - {JSON.stringify(this.props.route.params.entryId)}
        </Text>
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

const mapStateToProps = (state, { route }) => {
  const { entryId } = route.params;
  const { entries } = state.entry;
  console.log("Entry Id called in MapStateToProps", entryId);

  return {
    entryId,
    metrics: entries[entryId],
  };
};

export default connect(mapStateToProps)(EntryDetail);
