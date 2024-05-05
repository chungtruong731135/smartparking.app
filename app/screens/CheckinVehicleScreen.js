import React, { useState , useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TD_Header } from '../components';
import { Colors } from '../theme';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import moment from 'moment';
import API from '../services/GlobalAPI';
import { ImagePicker, launchCamera } from 'react-native-image-picker';

const CheckinVehicleScreen = ({ route }) => {
    const { branchDetails } = route.params;
    const navigation = useNavigation();

    const [imageSource, setImageSource] = useState(null);
    const [imageType, setImageType] = useState(null);
    const [imageTypeOriginal, setImageTypeOriginal] = useState(null);
    const [imageName, setImageName] = useState(null);

    const [licensePlate, setLicensePlate] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [detectedPlateNumber, setDetectedPlateNumber] = useState('');
    const [selectedTicket, setSelectedTicket] = useState('');
    const [dateTime, setDateTime] = useState(moment().toISOString());
    const [ticketList, setTicketList] = useState([]);
    const [plateImageData, setPlateImageData] = useState('');

    useEffect(() => {
      const timer = setInterval(() => {
        setDateTime(moment().toISOString());
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
    }, []);

    useEffect(() => {
      const fetchTickets = async () => {
        try {
          const response = await API.requestPOST_SP('/api/v1/tickets/search', {
            pageNumber: 1,
            pageSize: 100,
            branchId: branchDetails.id,
            isActive: false,
          });

            setTicketList(response.data); 

        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      };
  
      fetchTickets();
    }, []);

    const uploadImageToServer = async (imageUri) => {
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
    
        console.log('Uploading image with data:', formData);
    
        const response = await axios.post(
          'http://tdparking-api.hanhchinhcong.org/LicencePlate/UploadingSingleFile',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        return response.data;
      } catch (error) {
        console.error('Error uploading image:', error);
        console.error('Error details:', error.response ? error.response.data : error.message);
        throw error;
      }
    };

    const openCamera = () => {
      const options = {
        saveToPhotos: true,
        mediaType: 'photo',
        includeBase64: true,
        quality: 1, // Giảm chất lượng để giảm dung lượng file
        maxWidth: 800, // Giới hạn chiều rộng tối đa của hình ảnh
        maxHeight: 600, // Giới hạn chiều cao tối đa của hình ảnh
      };
    
      launchCamera(options, async response => {
        if (response?.assets && response?.assets.length > 0) {
          const selectedImageUri = response?.assets[0]?.uri;
          const selectedImageType = response?.assets[0]?.type;
          const currentTime = moment().format('YYYYMMDDHHmmss');
          const randomValue = Math.floor(Math.random() * 1000);
          const imageFileName = `plate_${currentTime}_${randomValue}`; // Tạo tên file ảnh

          setImageSource(selectedImageUri);
          setImageType(selectedImageType);
          setImageName(imageFileName);

          try {
            const base64Data = response.assets[0]?.base64;
            
            setPlateImageData(base64Data);

            const licensePlateResponse = await uploadImageToServer(selectedImageUri);
    
            const textPlate = licensePlateResponse?.data[0]?.textPlate;

            setLicensePlate(licensePlateResponse);
            setVehicleNumber(textPlate);
            setDetectedPlateNumber(textPlate);

          } catch (error) {}
        } else {
          console.error('No assets found or camera access denied');
        }
      }, error => {
        console.error('Error while opening camera:', error);
      });
    };

    const enterVehicle = async () => {
      try {
        if (imageSource) {
          const plateNumber = vehicleNumber; 
          const detectedPlateNumber = vehicleNumber; 
          const dateTimeEvent = moment(dateTime).toISOString(); 
          const imageExtension = imageType.split('/')[1];
          const plateImage = {
            name: imageName,
            extension: `.${imageExtension}`,
            data: `data:${imageType};base64,${plateImageData}`, 
          };
          const vehicleImage = 'string'; 
          const hardwareSyncId = 'string'; 
          const description = 'string';
          const status = 0; 
          const branchId = branchDetails.id;
          const ticketId = selectedTicket; 
    
          // Gọi API
          const response = await API.requestPOST_SP('/api/v1/eventvehicles/enter', {
            plateNumber,
            detectedPlateNumber,
            dateTimeEvent,
            plateImage,
            vehicleImage,
            hardwareSyncId,
            description,
            status,
            branchId,
            ticketId,
          });
    
          if (response) {
            console.log('Request thành công:', response.data);
            alert('Xe vào thành công!');
            navigation.goBack();
          } else {
            console.error('Request không thành công:', response);
          }
    
        } else {
          console.error('Không có ảnh được chọn.');
        }
      } catch (error) {
        console.error('Error entering vehicle:', error);
      }
    };
    

  return (
    <View style={styles.container}>
      <TD_Header
        title="Check-in Xe"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
        leftComponent
        checkrightComponent={true}
        isHome  
      />  

      <TouchableOpacity style={styles.imageContainer} onPress={openCamera}>
        {imageSource ? (
          <Image source={{ uri: imageSource }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholderText}>Chưa có ảnh</Text>
        )}
      </TouchableOpacity>

      {/* {licensePlateText !== '' && (
        <Text style={styles.licensePlateText}>{processLicensePlateText(licensePlateText)}</Text>
      )} */}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Biển số xe:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập biển số xe"
          placeholderTextColor= '#a3a3a3'
          value={vehicleNumber}
          onChangeText={(text) => setVehicleNumber(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Biển số xe được phát hiện:</Text>
        <TextInput
          style={styles.input}
          placeholder="Biển số xe được phát hiện"
          placeholderTextColor= '#a3a3a3'
          value={detectedPlateNumber}
          // onChangeText={(text) => setVehicleNumber(text)}
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Thời gian:</Text>
        <TextInput
          style={[styles.input, styles.boldText]}
          placeholder="Thời gian"
          placeholderTextColor= '#a3a3a3'
          value={moment(dateTime).locale('vi').format('DD [tháng] MM [năm] YYYY, H:mm:ss')}
          onChangeText={(text) => setDateTime(text)}
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Vé xe:</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={selectedTicket}
            style={styles.input}
            itemStyle={{ justifyContent: 'flex-start' }}
            onValueChange={(itemValue, itemIndex) => setSelectedTicket(itemValue)}
          >
            {ticketList.map((ticket) => (
              <Picker.Item key={ticket.id} label={ticket.name} value={ticket.id} />
            ))}
        </Picker>
        </View>
        
      </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} >
            <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.blackListButton} onPress={enterVehicle}>
            <Text style={styles.blackListButtonText}>Xe vào</Text>
        </TouchableOpacity>
      </View>
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
    width: '95%',
    height: 200,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imagePlaceholderText: {
    color: 'grey',
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.blue,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  boldText: {
    fontWeight: 'bold',
  },
  licensePlateText: {
    color: 'black',
    fontSize: 18,
    marginTop: 10,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    color: 'green',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginTop: 90
  },
  cancelButton: {
    backgroundColor: 'gray',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    width: '48%',
    marginLeft: 4,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  blackListButton: {
    backgroundColor: '#add8e6',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    width: '48%', // Điều chỉnh lại chiều rộng
    marginRight: 4, // Thêm margin phải
  },
  blackListButtonText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center', 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingRight: 10
  },
  inputLabel: {
    width: '30%',
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    color: '#000'
  },
  picker: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '70%',
    marginTop: 20,
  },
});

export default CheckinVehicleScreen;
