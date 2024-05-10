import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import API from '../../services/GlobalAPI';
import { TD_Header, TDTextInputNew, FooterMenu } from '../../components';
import { Colors } from '../../theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation, useRoute  } from '@react-navigation/native';

const TicketManagementScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { branchDetails } = route.params;
  const [ticketList, setTicketList] = useState([]);

  const fetchTickets = async () => {
    try {
      const response = await API.requestPOST_SP('/api/v1/tickets/search', {
        pageNumber: 1,
        pageSize: 100
      });
      if (response && response.data) {
        setTicketList(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin thẻ', error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchTickets();
    }, [])
  );

  const Item = ({ name, cardNumber, isActive, onEdit, onDelete }) => (
    <TouchableOpacity style={styles.item}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Tên thẻ: {name}</Text>
        <Text style={styles.cardNumber}>Mã thẻ: {cardNumber}</Text>
        <Text style={isActive ? styles.active : styles.inactive}>
          {isActive ? 'Được dùng' : 'Chưa được dùng'}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.icon}>
          <Icon name="edit" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  const handleEditPress = (item) => {
    navigation.navigate('TicketDetailsScreen', { ticketId: item.id, branchDetails });
  };
  

  return (
    <View style={styles.container}>
      <TD_Header
        title="Quản lý thẻ"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
        leftComponent
        checkrightComponent={true}
        // setShowSearch={setShowSearch}
        // navigationRight="TDTextInputNew"
        isHome  
      />
      <FlatList
        data={ticketList}
        renderItem={({ item }) => (
            <Item
            {...item}
            onEdit={() => handleEditPress(item)}
            onDelete={() => handleDeletePress(item)}
            />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => navigation.navigate('AddTicketScreen', {branchDetails})}
        >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
    color: '#000'
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5, 
    color: '#000'
  },
  cardNumber: {
    fontSize: 14,
    color: '#000'
  },
  active: {
    fontSize: 14,
    color: 'red'
  },
  inactive: {
    fontSize: 14,
    color: 'green'
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  floatingButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

export default TicketManagementScreen;
