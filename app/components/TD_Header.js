/* eslint-disable react-native/no-inline-styles */
import React, { useState , useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Header, Avatar } from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome5Pro';

const TD_Header = (props) => {
  const navigation = useNavigation();
  const { showBackButton = true, ...otherProps } = props;
  const [modalVisible, setModalVisible] = useState(false);

  const { checkrightComponent, checkDisable, navigationRight, style } = props;

  const _renderleftComponent_stack = () => {
    if (!showBackButton) return null;

    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" color="white" size={20} underlayColor="#00000000" style={{ paddingStart: 0, marginHorizontal: 20 }} />
      </TouchableOpacity>
    );
  };

  const _renderrightComponent = () => (
    <TouchableOpacity onPress={() => props.setShowSearch && props.setShowSearch(prevState => !prevState)}>
      <Icon name="search" color="white" size={20} style={{ marginHorizontal: 20 }} />
    </TouchableOpacity>
  );

  const _renderrightComponentNo = () => (
    <TouchableOpacity>
      <Icon name="arrow-left" color="transparent" size={20} underlayColor="#00000000" style={{ paddingStart: 0, marginHorizontal: 20 }} />
    </TouchableOpacity>
  );

  return (
    <>
      {!checkDisable && (
        <Header
          statusBarProps={{ barStyle: 'light-content', backgroundColor: 'transparent', translucent: true }}
          barStyle="light-content"
          containerStyle={{
            justifyContent: 'space-around',
            alignItems: 'center',
            height: 80,
            paddingTop: 10,
            zIndex: 1000
          }}
          leftComponent={<_renderleftComponent_stack />}
          rightComponent={checkrightComponent ? <_renderrightComponent /> : <_renderrightComponentNo />}
          centerComponent={{
            text: props.title,
            style: { color: '#fff', fontSize: 16, textTransform: 'uppercase', fontWeight: '500' },
          }}
          style={{}}
        />
      )}
      {checkDisable && <Header statusBarProps={{ barStyle: 'light-content', backgroundColor: 'transparent', translucent: true }} />}
    </>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});

export default TD_Header;
