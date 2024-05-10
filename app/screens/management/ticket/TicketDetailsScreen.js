import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Switch, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import API from '../../../services/GlobalAPI';
import { TD_Header } from '../../../components';
import { Colors } from '../../../theme';
import { useFocusEffect } from '@react-navigation/native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

const TicketDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ticketId, branchDetails } = route.params;
  const [ticketDetails, setTicketDetails] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const fetchTicketDetails = async () => {
    try {
      const response = await API.requestGET_SP(`/api/v1/tickets/${ticketId}`);
      if (response && response.data) {
        setTicketDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching ticket details', error);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, []);

  useEffect(() => {
    NfcManager.start();
    return () => {
      // NfcManager.stop();
    };
  }, []);

  if (!ticketDetails) {
    return <View style={styles.center}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text>Loading ticket details...</Text>
    </View>
  }

  const handleSave = async () => {
    try {
      const updatedDetails = {
        id: ticketDetails.id,
        name: ticketDetails.name,
        cardNumber: ticketDetails.cardNumber,
        branchId : branchDetails.id
      };
  
      const response = await API.requestPOST_SP(`/api/v1/tickets/${ticketId}`, updatedDetails);
      if (response  && response.data) {
        alert('Cập nhật thông tin thẻ thành công!');
        navigation.goBack();
      } else {
        alert('Cập nhật thất bại, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error saving ticket details', error);
      alert('Có lỗi xảy ra khi cố gắng lưu thông tin.');
    }
  };
  
  const handleDelete = async () => {
        try {
            const response = await API.requestDELETE(`/api/v1/tickets/${ticketId}`);
            if (response && response.data ) {
                alert('Xoá thẻ thành công!');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error deleting ticket', error);
        }
    };

    const writeToNfc = async () => {
        setModalVisible(true);
        try {
            // Yêu cầu công nghệ NDEF để chuẩn bị ghi
            await NfcManager.requestTechnology(NfcTech.Ndef);
    
            // Chuẩn bị dữ liệu để ghi
            let textToWrite = `Id: ${ticketDetails.id}\nName: ${ticketDetails.name}\nCode: ${ticketDetails.cardNumber}`;
            let message = Ndef.encodeMessage([Ndef.textRecord(textToWrite)]);
    
            // Ghi thông tin lên thẻ NFC
            await NfcManager.ndefHandler.writeNdefMessage(message);
            console.log(message)
    
            setModalVisible(false);
            alert('Ghi thông tin lên thẻ NFC thành công!');
        } catch (error) {
            // console.error('Failed to write NFC tag:', error);
            setModalVisible(false);
            alert('Ghi thông tin lên thẻ NFC thất bại!');
            console.log(error);
        } finally {
            // Dọn dẹp sau khi hoàn tất ghi hoặc có lỗi
            NfcManager.cancelTechnologyRequest();
            setModalVisible(false);
        }
    };
    
  return (
    <View style={styles.container}>
      <TD_Header
        title="Chi tiết thẻ"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
        leftComponent
        // checkrightComponent={true}
        isHome  
      />
      <View style={styles.form}>
        <Text style={styles.label}>Tên thẻ:</Text>
        <TextInput
          style={styles.input}
          value={ticketDetails.name || ''}
          onChangeText={(text) => setTicketDetails({ ...ticketDetails, name: text })}
        />
        <Text style={styles.label}>Mã thẻ:</Text>
        <TextInput
          style={styles.input}
          value={ticketDetails.cardNumber || ''}
          onChangeText={(text) => setTicketDetails({ ...ticketDetails, cardNumber: text })}
        />

        <TouchableOpacity style={styles.nfcButton} onPress={writeToNfc}>
            <Text style={styles.buttonText}>Nhập vào thẻ cứng</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.buttonText}>Xoá thẻ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
        </View>
      </View>
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
                style={styles.cancelButton}
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
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  input: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    color: '#000'
  },
  nfcButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginTop: 20 // Giảm khoảng cách phía trên nếu cần
    },
    saveButton: {
        backgroundColor: 'blue',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '48%',
        marginLeft: 4,
    },
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '48%',
        marginRight: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center'
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
    cancelButton: {
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

export default TicketDetailsScreen;
