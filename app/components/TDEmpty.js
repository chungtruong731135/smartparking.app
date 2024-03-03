/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

const TDEmpty = props => {
  const { noidung } = props;

  return (
    <View style={styles.headerText}>
      <Text style={{ textAlign: 'center' }}>{noidung ? noidung : 'Không có dữ liệu'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
});

export default TDEmpty;
