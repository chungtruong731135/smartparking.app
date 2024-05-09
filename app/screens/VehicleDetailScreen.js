import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TD_Header, TDTextInputNew } from '../components';
import { Colors } from '../theme';
import moment from 'moment';
import API from '../services/GlobalAPI';
import { SERVER_URL } from '../services/GlobalAPI';

const VehicleDetailScreen = () => {
  const route = useRoute();
  const { id, vehicleDetails, fromHistory, branchDetails } = route.params;

  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [ticketInfo, setTicketInfo] = useState(null);
  const navigation = useNavigation();
  const [blacklistReason, setBlacklistReason] = useState('');
  const [showBlacklistInput, setShowBlacklistInput] = useState(false);


  const fetchVehicles = async () => {
    try {
      const response = await API.requestGET_SP(`/api/v1/eventvehicles/${id}`);
      if (response && response.data) {
        setVehicleInfo(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin xe', error);
    }
  };

  const fetchTicketInfo = async () => {
    try {
      const response = await API.requestGET_SP(`/api/v1/tickets/${vehicleDetails.ticketId}`);
      setTicketInfo(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin vé', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchTicketInfo(); 
  }, []);
  
  const handleBlackListPress = () => {
    setShowBlacklistInput(true);
  };

  const handleAddToBlacklist = async () => {
    try {
      const response = await API.requestPOST_SP('/api/v1/vehicleblacklists', {
        plateNumber: vehicleDetails.plateNumber,
        branchId: branchDetails.id,
        description: blacklistReason,
      });

      if (response && response.data) {
        alert('Xe đã được thêm vào danh sách đen!');
        navigation.goBack();
      } else {
        alert('Thêm vào danh sách đen không thành công. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào danh sách đen', error);
      alert('Thêm vào danh sách đen không thành công. Vui lòng thử lại sau.');
    }
    setShowBlacklistInput(false);
  };

  const handleCancel = () => {
    setShowBlacklistInput(false);
  };

  const handleExitPress = async () => {
    try {
      const response = await API.requestPOST_SP('/api/v1/eventvehicles/exit', { id: vehicleDetails.id });
      if (response && response.data) {
        alert('Xe đã ra thành công!');
        navigation.goBack();
      } else {
        alert('Xe ra không thành công. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Lỗi khi thực hiện hành động xe ra', error);
      alert('Xe ra không thành công. Vui lòng thử lại sau.');
    }
  };
  

  return (
    <View style={styles.container}>
      <TD_Header
        title="Thông tin chi tiết xe"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
        leftComponent
        checkrightComponent={true}
        // navigationRight="TDTextInputNew"
        isHome  
      />  
      {vehicleInfo ? (
        <>
          <View style={styles.imageContainer}>
              {vehicleInfo.plateImage
              ? <Image source={{ uri: SERVER_URL + `/` + vehicleInfo.plateImage }} style={styles.image} />
              : <Text>Không có ảnh</Text>
              }
          </View>
          <Text style={styles.plateNumber}>{vehicleInfo.plateNumber}</Text>
          <Text style={styles.info}>Thời gian vào: {moment(vehicleInfo.dateTimeEvent).format('DD/MM/YYYY HH:mm')}</Text>
          {ticketInfo && (
              <Text style={styles.info}>Mã thẻ xe: {ticketInfo.cardNumber}</Text>
          )}
          <Text style={styles.info}>Mô tả: {vehicleInfo.description}</Text>

          {fromHistory !== true && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.blackListButton]} onPress={handleBlackListPress}>
                <Text style={styles.blackListButtonText}>Thêm vào danh sách đen</Text>
              </TouchableOpacity>
              <View style={styles.buttonSpacer} />
              <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={handleExitPress}>
                <Text style={styles.exitButtonText}>Xe ra</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <Text style={styles.info}>Không có thông tin</Text>
      )}

      <Modal animationType="slide" transparent={true} visible={showBlacklistInput}>
        <View style={styles.modalView}>
          <View style={styles.formContainer}>
            <Text style={styles.info}>Lý do thêm vào danh sách đen:</Text>
            <TextInput
              style={styles.blacklistInput}
              placeholder="Lý do thêm vào danh sách đen..."
              onChangeText={(text) => setBlacklistReason(text)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.blackListButton} onPress={handleAddToBlacklist}>
                <Text style={styles.blackListButtonText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center', 
    justifyContent: 'flex-start', 
  },
  imageContainer: {
    width: '90%', 
    height: 400,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  image: {
    width: '100%', 
    height: '100%',
    resizeMode: 'contain',
  },
  plateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    padding: 5,
    borderRadius: 5, 
    width: '80%',
    alignSelf: 'center',
    color: '#000'
  },
  info: {
    fontSize: 18, 
    marginVertical: 5, 
    textAlign: 'center', 
    color : '#000'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%', // Điều chỉnh lại chiều rộng
    padding: 10, // Thêm padding cho container
  },
  button: {
    flex: 1, 
    borderRadius: 5,
    padding: 10,
    alignItems: 'center', 
  },
  blacklistInputContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  blackListButton: {
    backgroundColor: '#add8e6',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    width: '48%', // Điều chỉnh lại chiều rộng
    marginRight: 4, // Thêm margin phải
  },
  blacklistInput: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    color: '#000'
  },
  exitButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    width: '45%',
  },
  blackListButtonText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center', 
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  buttonSpacer: {
    width: 10, 
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  formContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    width: '48%', // Điều chỉnh lại chiều rộng
    marginLeft: 4, // Thêm margin trái
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
  

export default VehicleDetailScreen;
