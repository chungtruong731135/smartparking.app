import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import API from '../../../services/GlobalAPI';
import { TD_Header } from '../../../components';
import { Colors } from '../../../theme';
import { useNavigation } from '@react-navigation/native';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và Nhập lại mật khẩu mới không khớp.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await API.requestPUT_SP('/api/personal/change-password', {
        password: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      });
      
      if (response) {
        Alert.alert('Thành công', 'Đổi mật khẩu thành công!.');
        navigation.goBack();
      } else {
        Alert.alert('Thất bại', `Lỗi khi đổi mật khẩu, hãy kiểm tra lại`);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password.');
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <TD_Header
        title="Change Password"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
      />
      <View style={styles.form}>
        <Text style={styles.label}>Mật khẩu cũ:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <Text style={styles.label}>Mật khẩu mới:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Text style={styles.label}>Nhập lại mật khẩu mới:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Thay đổi mật khẩu</Text>
        </TouchableOpacity>
      )}
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
    color: '#000',
    fontWeight: 'bold',
  },
  input: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    color: '#000',
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChangePasswordScreen;
