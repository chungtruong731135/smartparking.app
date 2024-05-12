import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TD_Header, TDTextInputNew } from '../../components';
import { Colors } from '../../theme';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setAuthToken } from '../../services/GlobalAPI';
import { actions } from '../../redux/global/Actions'

const UserProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        { text: "Đồng ý", onPress: () => performLogout() }
      ]
    );
  };

  const performLogout = () => {
    setAuthToken(null);  // Remove the auth token
    dispatch(actions.setAccessToken(null));  // Update the state in Redux

    // Reset the navigation stack and redirect to the Login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  return (
    <View style={styles.container}>
      <TD_Header
        title="Thông tin người quản lý"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
        leftComponent
        // checkrightComponent={true}
        isHome  
      />
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('UserDetailsScreen')}>
          <Text style={styles.menuText}>Thông tin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('ChangePassWordScreen')} >
          <Text style={styles.menuText}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuText}>Đăng xuất</Text>
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
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  menu: {
    margin: 20,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 18,
    color: '#000'
  },
});

export default UserProfileScreen;
