import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TD_Header, TDTextInputNew } from '../components';
import { Colors } from '../theme';

const UserProfileScreen = ({ navigation }) => {
  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
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
        <TouchableOpacity style={styles.menuItem} >
          <Text style={styles.menuText}>Thông tin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} >
          <Text style={styles.menuText}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} >
          <Text style={styles.menuText}>Ngôn ngữ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} >
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
    color: '#fff'
  },
});

export default UserProfileScreen;
