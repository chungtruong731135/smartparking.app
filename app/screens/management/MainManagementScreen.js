import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TD_Header, TDTextInputNew } from '../../components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../theme';

const MainScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { branchDetails } = route.params;

  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
  };
  
  return (
    <View style={styles.container}>
      <TD_Header
        title="Quản lý"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
        leftComponent
        // checkrightComponent={true}
        isHome  
      />
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UserProfileScreen', { branchDetails })}>
          <Text style={styles.menuText}>Thông tin người quản lý</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('TicketsManagementScreen' , { branchDetails })}>
          <Text style={styles.menuText}>Quản lý thẻ</Text>
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

export default MainScreen;
