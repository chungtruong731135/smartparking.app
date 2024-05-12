import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, FlatList, Image, TextInput, Modal, ActivityIndicator } from 'react-native';
import { TD_Header, TDTextInputNew, FooterMenu } from '../../components';
import { Colors } from '../../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import API, { SERVER_URL } from '../../services/GlobalAPI';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

const MAIN_HomeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { branchDetails } = route.params;
  const [vehicleList, setVehicleList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const fetchVehicles = async () => {
    try {
      const response = await API.requestPOST_SP('/api/v1/eventvehicles/search-event-vehicles', {
        pageNumber: 1,
        pageSize: 1000,
        branchId: branchDetails.id,
        laneDirection: 'IN',
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
        pageSize: 1000,
        branchId: branchDetails.id,
        laneDirection: 'IN',
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
      <Image source={{ uri: SERVER_URL + "/" + plateImage }} style={styles.image} />
      <View style={styles.separator}></View>
      <View style={styles.infoContainer}>
        <Text style={styles.plateNumber}>{plateNumber}</Text>
        <Text style={styles.dateTime}>{moment(dateTimeEvent).format('DD/MM/YYYY HH:mm')}</Text>
      </View>
    </View>
  );

  const handleItemPress = (item) => {
    navigation.navigate('VehicleDetailScreen', { id: item.id, vehicleDetails: item, branchDetails });
  };

  const readNfc = async () => {
    setModalVisible(true);
    try {
        await NfcManager.requestTechnology(NfcTech.Ndef);
        const tag = await NfcManager.getTag();

        if (tag.ndefMessage) {
            let ndefRecords = tag.ndefMessage;

            for (const record of ndefRecords) {
                const textDecoder = new TextDecoder('utf-8');
                const text = textDecoder.decode(new Uint8Array(record.payload));

                if (text.includes('Id:')) {
                    const ticketIdFromTag = text.match(/Id:\s*(.+)\n/)[1];

                    setSelectedTicket(ticketIdFromTag);
                    navigation.navigate('VehicleDetailsByTicketScreen', { ticketId: ticketIdFromTag, branchDetails, fromHistory: false  });
                }
            }
        }
    } catch (error) {
        alert('Đã thoát!');
    } finally {
        NfcManager.cancelTechnologyRequest();
        setModalVisible(false);
    }
};

  return (
    <View style={styles.container}>
      <TD_Header
        title="Xe trong bãi"
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
          placeholderTextColor="#000"
        />
      )}
      <Text style={styles.header}>{branchDetails.name}</Text>
      <Text style={styles.subHeader}>Số lượng xe trong bãi: {vehicleList.length} chiếc</Text>
      <FlatList
        data={vehicleList}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <Item {...item} branchDetails={branchDetails} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={readNfc}
        >
        <Icon name="ticket" size={24} color="#fff" />
      </TouchableOpacity>
      <FooterMenu navigation={navigation} branchDetails={branchDetails} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}
        >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.modalText}>Vui lòng đưa thẻ đến gần thiết bị Android của bạn.</Text>
            <TouchableOpacity
                style={styles.cancelButtonModal}
                onPress={() => {
                setModalVisible(false);
                NfcManager.cancelTechnologyRequest(); // Ngưng yêu cầu NFC nếu người dùng hủy
                }}
            >
                <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
    color: '#000',
  },
  subHeader: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
    color: '#000',
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
    color: '#000',
  },
  dateTime: {
    fontSize: 14,
    color: '#000',
  },
  searchInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: '#000',
  },
  floatingButton: {
    position: 'absolute',
    right: 30,
    bottom: 100,
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
    },
    modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: '#000'
  },
  cancelButtonModal: {
    backgroundColor: 'red', // Màu nền cho nút hủy
    borderRadius: 20, // Bo tròn góc
    padding: 10, // Đệm xung quanh nội dung trong nút
    elevation: 2, // Độ nổi của nút, tạo hiệu ứng bóng
    marginTop: 10, // Khoảng cách từ nội dung trên
  },
  cancelButtonText: {
    color: 'white', // Màu chữ
    fontWeight: 'bold', // Độ đậm của chữ
    textAlign: 'center', // Căn giữa chữ trong nút
  }
});


export default MAIN_HomeScreen;
