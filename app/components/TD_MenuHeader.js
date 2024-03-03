/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useSelector } from 'react-redux';
import { ImageBackground, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-elements';

const TD_MenuHeader = (props) => {
  const userInfo = useSelector((state) => state.global.userInfo);

  return (
    <ImageBackground
      source={{}}
      style={{ width: undefined, padding: 20, paddingTop: 60, flexDirection: 'row', alignItems: 'center' }}>
      <Avatar
        size='medium'
        avatarStyle={{ borderRadius: 5 }}
        source={{
          uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg1'
        }}
      />
      <Text style={styles.name}>{fullname}</Text>
    </ImageBackground>
  );
};

export default TD_MenuHeader;

const styles = StyleSheet.create({
  name: {
    flex: 1,
    color: '#FFF',
    fontSize: 20,
    fontWeight: '500',
    marginStart: 10,
  },
});
