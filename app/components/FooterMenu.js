import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../theme';

const FooterMenu = ({ navigation, branchDetails }) => {
  return (
    <View style={styles.footerMenu}>
      <TouchableOpacity
       style={styles.menuItem}
       onPress={() => navigation.navigate('HistoryEventVehicleScreen', { branchDetails })}
       >
        <Icon name="history" size={20} color="#ffffff" />
        <Text style={styles.menuText}>Lịch sử</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => navigation.navigate('BlacklistScreen', { branchDetails })}
      >
      <Icon name="ban" size={20} color="#ffffff" />
      <Text style={styles.menuText}>Blacklist</Text>
  </TouchableOpacity>


  <TouchableOpacity 
    style={[styles.menuItem, styles.featuredItem]}
    onPress={() => navigation.navigate('CheckinVehicleScreen', { branchDetails })}
  >
    <View style={styles.iconBackground}>
      <Icon name="camera" size={30} color={Colors.blue} />
    </View>
  </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem]}
        onPress={() => navigation.navigate('RevenueStatisticsScreen')}
        >
        <Icon name="line-chart" size={20} color="#ffffff" />
        <Text style={styles.menuText}>Doanh thu</Text>
    </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UserProfileScreen')}>
        <Icon name="user" size={20} color="#ffffff" />
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    footerMenu: {
        flexDirection: 'row',
        backgroundColor: Colors.blue,
        justifyContent: 'space-around',
        paddingVertical: 10,
      },
      menuItem: {
        alignItems: 'center',
        flex: 1,
      },
      menuText: {
        color: '#ffffff',
        fontSize: 10,
        marginTop: 5,
      },
      featuredItem: {
        transform: [{ scale: 1.2 }],
        paddingBottom: 10, 
      },
      featuredText: {
        fontWeight: 'bold', 
      },
      iconBackground: {
        width: 50,
        height: 50,
        borderRadius: 25, 
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5, 
        elevation: 5,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
});

export default FooterMenu;
