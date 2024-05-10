import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import API from '../../../services/GlobalAPI';
import { TD_Header } from '../../../components';
import { Colors } from '../../../theme';

const AddTicketScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { branchDetails } = route.params;
  
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const handleSave = async () => {
    try {
      const response = await API.requestPOST_SP('/api/v1/tickets', {
        name: name,
        cardNumber: cardNumber,
        branchId: branchDetails.id
      });
      if (response && response.data) {
        Alert.alert('Thành công', 'Thẻ đã được thêm thành công!');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Thêm thẻ thất bại, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error adding new ticket', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cố gắng thêm thẻ.');
    }
  };

  return (
    <View style={styles.container}>
      <TD_Header
        title="Thêm Thẻ Mới"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
        isHome  
      />
      <View style={styles.form}>
        <Text style={styles.label}>Tên thẻ:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên thẻ"
        />
        <Text style={styles.label}>Mã thẻ:</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="Nhập mã thẻ"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  input: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    color: '#000'
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  }
});

export default AddTicketScreen;
