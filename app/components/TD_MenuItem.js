/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';

const TD_MenuItem = (props) => {
  const { navigation, navigate, icon, title, item, onPress, itemKey, selectKey, setSelectKey } = props;

  return (
    <TouchableOpacity
      style={{
        padding: 15,
        paddingLeft: 30,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
      }}
      onPress={
        onPress
          ? onPress
          : () => {
            if (navigate) {
              setSelectKey(itemKey);
              navigation.closeDrawer();
              navigation.navigate(navigate, {});
            }
          }
      }>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',

          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            name={icon || 'book'}
            solid
            size={24}
            color={'#9E9E9E'}
            style={{ width: 50 }}
          />
          <Text
            style={{
              color: '#424242',
              fontWeight: '600',
              paddingStart: 10
            }}>
            {title ? title : ''}
          </Text>
        </View>
        {/*  {item && item.value && item.value > 0 && <Badge value={`${item?.value ?? '0'}`} status={'error'} />} */}
        {<Text style={{ color: 'red' }}>{`${item && item.value && item.value > 0 ? item.value : ''}`}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default TD_MenuItem;

const styles = StyleSheet.create({});
