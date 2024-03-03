/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5Pro';

const TDTextInputNew = (props) => {
  const inputRef = useRef(null);

  const [hide, isHide] = useState(false);

  const {
    value,
    onChangeText,
    placeholder,
    title,
    isImportant,
    type,
    description,
    showEye,
    keyboardType,
    multiline,
    disable,
    icon,
    numberOfLines,
  } = props;

  return (
    <>
      {title ? (
        <TouchableOpacity
          style={[styles.textinputContainer, { backgroundColor: onChangeText ? 'transparent' : '#F3F3F3' }]}
          onPress={() => {
            onChangeText && inputRef.current.focus();
          }}>
          <Text style={styles.title}>
            {title}:<Text style={{ color: 'red', fontWeight: 'bold' }}>{isImportant ? ' *' : ''}</Text>
          </Text>
          {onChangeText ? (
            <TextInput
              ref={inputRef}
              editable={disable ? false : true}
              //keyboardType="numeric"
              placeholder={placeholder ? placeholder : ''}
              multiline={multiline ? multiline : false}
              onChangeText={(text) => {
                onChangeText(text);
              }}
              value={`${value ? value : ''}`}
              selectionColor={'gray'}
              clearButtonMode={disable ? 'never' : 'always'}
              style={styles.textinput}
              secureTextEntry={showEye && !hide}
              keyboardType={keyboardType ? keyboardType : 'default'}
              onFocus={() => { }}
            />
          ) : (
            <Text style={[styles.textinput]}>{value}</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.textinputContainerNoTitle, { backgroundColor: onChangeText ? 'transparent' : '#F3F3F3' }]}
          onPress={() => {
            onChangeText && inputRef.current.focus();
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {icon && <FontAwesome name={icon} size={16} color="#616161" style={{ marginRight: 5 }} />}
            {onChangeText ? (
              <TextInput
                ref={inputRef}
                editable={disable ? false : true}
                //keyboardType="numeric"
                placeholder={placeholder ? placeholder : ''}
                multiline={multiline ? multiline : false}
                onChangeText={(text) => {
                  onChangeText(text);
                }}
                value={`${value}`}
                selectionColor={'gray'}
                clearButtonMode={disable ? 'never' : 'always'}
                style={styles.textinputNoitle}
                secureTextEntry={showEye && !hide}
                keyboardType={keyboardType ? keyboardType : 'default'}
                onFocus={() => { }}
                numberOfLines={numberOfLines || 1}
              />
            ) : (
              <Text style={[styles.textinputNoitle]}>{value}</Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default TDTextInputNew;
const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { color: '#757575', fontSize: 14, fontWeight: 'bold' },
  textinputContainer: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    margin: 10,
    borderColor: '#abb4bd65',
    borderWidth: 0.5,
  },
  textinputContainerNoTitle: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#FFF',
    borderRadius: 4,
    marginHorizontal: 5,
    marginTop: 5,
    borderColor: '#abb4bd65',
    borderWidth: 0.5,
  },
  textinput: { flex: 1, marginTop: 5, fontWeight: '500', padding: Platform.OS === 'ios' ? 5 : 0 },
  textinputNoitle: { flex: 1, fontWeight: '500', padding: Platform.OS === 'ios' ? 5 : 0 },
  textinputIcon: { marginHorizontal: 10 },
});
