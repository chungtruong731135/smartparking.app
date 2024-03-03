import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, FlatList, Image, TextInput } from 'react-native';
import { TD_Header, TDTextInputNew, FooterMenu } from '../components';
import { Colors } from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import API from '../services/GlobalAPI';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const HistoryEventVehicleScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { branchDetails } = route.params;
  const [vehicleList, setVehicleList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const fetchVehicles = async () => {
    try {
      const response = await API.requestPOST_SP('/api/v1/eventvehicles/search-event-vehicles', {
        pageNumber: 1,
        pageSize: 100,
        branchId: branchDetails.id,
        laneDirection: 'OUT',
        plateNumber: ''
      });
      if (response && response.data) {
        setVehicleList(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin xe', error);
    }
  };

  const searchVehicles = async (plateNumber) => {
    try {
      const response = await API.requestPOST_SP('/api/v1/eventvehicles/search-event-vehicles', {
        pageNumber: 1,
        pageSize: 100,
        branchId: branchDetails.id,
        laneDirection: 'OUT',
        plateNumber: plateNumber
      });
      if (response && response.data) {
        setVehicleList(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm thông tin xe', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [branchDetails.id]);

  useFocusEffect(
    React.useCallback(() => {
      fetchVehicles();
    }, [])
  );

  const Item = ({ plateImage, plateNumber, dateTimeEvent }) => (
    <View style={styles.item} onPress={() => handleItemPress(item)}>
      <Image source={{ uri: "http://10.0.2.2:5000/" + plateImage }} style={styles.image} />
      <View style={styles.separator}></View>
      <View style={styles.infoContainer}>
        <Text style={styles.plateNumber}>{plateNumber}</Text>
        <Text style={styles.dateTime}>{moment(dateTimeEvent).format('DD/MM/YYYY HH:mm')}</Text>
      </View>
    </View>
  );

  const handleItemPress = (item) => {
    navigation.navigate('VehicleDetailScreen', { vehicleDetails: item, fromHistory: true });
  };

  return (
    <View style={styles.container}>
      <TD_Header
        title="Lịch sử xe ra khỏi bãi"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
        leftComponent
        checkrightComponent={true}
        setShowSearch={setShowSearch}
        // navigationRight="TDTextInputNew"
        isHome  
      />
      {showSearch && (
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập PlateNumber..."
          onChangeText={(text) => searchVehicles(text)}
        />
      )}
      <Text style={styles.header}>{branchDetails.name}</Text>
      <Text style={styles.subHeader}>Số lượng xe đã ra khỏi bãi: {vehicleList.length} chiếc</Text>
      <FlatList
        data={vehicleList}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <Item {...item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
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
  },
  subHeader: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
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
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  separator: {
    width: 1,
    height: '100%', 
    backgroundColor: 'grey',
    marginHorizontal: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5, 
  },
  dateTime: {
    fontSize: 14,
  },
  searchInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});


export default HistoryEventVehicleScreen;
