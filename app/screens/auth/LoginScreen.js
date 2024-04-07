import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Platform,
} from 'react-native';

import API, { setAuthToken } from '../../services/GlobalAPI';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../redux/global/Actions'


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoginError('');
    const urlService = 'api/tokens';
    const data = {
      email: email,
      password: password,
    };
      
    try {
      const response = await API.requestPOST_Login(urlService, data);
      if (response && response.token) {
        setAuthToken(response.token);
        dispatch(actions.setAccessToken(response.token));

        navigation.reset({
          index: 0,
          routes: [{ name: 'AppStack' }],
        });
        
      } else {
        setLoginError('Email hoặc mật khẩu không đúng.');
      }
    } catch (error) {
      console.log('Lỗi đăng nhập:', error);
      setLoginError('Đã xảy ra lỗi khi đăng nhập.');
    }
    
  };
  

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.appTitle}>Hệ thống bãi đỗ xe thông minh</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
      </View>

      {loginError ? (
        <Text style={styles.errorText}>{loginError}</Text>
      ) : null}

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text>Đăng nhập</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <TouchableOpacity>
          <Text style={styles.footerText}>Đăng ký</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, 
    color: '#000'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  footerContainer: {
    marginTop: 20,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;
