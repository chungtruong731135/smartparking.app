import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import API from '../../../services/GlobalAPI';
import { TD_Header } from '../../../components';
import { Colors } from '../../../theme';

const UserDetailScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await API.requestGET_SP('/api/personal/profile');
        if (response) {
          setUserInfo(response);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.center}>
        <Text>Không có thông tin.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TD_Header
        title="Thông tin tài khoản"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
      />
      <View style={styles.form}>
        <Text style={styles.label}>Tên tài khoản:</Text>
        <TextInput
          style={styles.input}
          value={userInfo.userName}
          editable={false}
        />
        <Text style={styles.label}>Họ:</Text>
        <TextInput
          style={styles.input}
          value={userInfo.firstName}
          editable={false}
        />
        <Text style={styles.label}>Tên đệm:</Text>
        <TextInput
          style={styles.input}
          value={userInfo.lastName}
          editable={false}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={userInfo.email}
          editable={false}
        />
        <Text style={styles.label}>Số điện thoại:</Text>
        <TextInput
          style={styles.input}
          value={userInfo.phoneNumber || ''}
          editable={false}
        />
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

export default UserDetailScreen;
