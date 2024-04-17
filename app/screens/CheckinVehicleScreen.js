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
    const [licensePlateText, setLicensePlateText] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [selectedTicket, setSelectedTicket] = useState('');
    const [dateTime, setDateTime] = useState(moment().toISOString());
    const [ticketList, setTicketList] = useState([]);
    const [plateImageData, setPlateImageData] = useState('');

    // console.log(imageSource)
    // console.log(selectedTicket)

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

    // const openImagePicker = () => {
    //   const options = {
    //       noData: true,
    //   };
  
    //     launchImageLibrary(options, async response => {
    //       console.log(response.assets);
    //         if (response.assets && response.assets.length > 0) {
    //             const selectedImageUri = response.assets[0].uri;

    //             const selectedImageType = response.assets[0].type;
    //             const typeParts = selectedImageType.split('/');
    //             const imageExtension = typeParts[1];

    //             const selectedImageName = response.assets[0].fileName;
    //             console.log(selectedImageType)
                
    //             setImageSource(selectedImageUri);
    //             setImageType(imageExtension);
    //             setImageTypeOriginal(selectedImageType) //kieu dang image/jpex ex.
    //             setImageName(selectedImageName);

    //             try {
    //                 const base64Image = await getBase64Image(selectedImageUri);
    //                 const licensePlateText = await analyzeImage(base64Image);

    //                 setLicensePlate(licensePlateText);
    //                 setVehicleNumber(processLicensePlateText(licensePlateText));

    //                 const imageData = await getImageData(selectedImageUri);
    //                 setPlateImageData(imageData);

    //             } catch (error) {
    //                 console.error('Error in image picking or analysis:', error);
    //             }
    //         }
    //     });
    // };
    const uploadImageToServer = async (base64Image) => {
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: base64Image,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
    
        const response = await axios.post(
          'http://tdparking-api.hanhchinhcong.org/LicencePlate/UploadingSingleFile',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
    
        // Xử lý dữ liệu trả về từ API nếu cần
        console.log('Response from server:', response);
        
        // Trả về kết quả xử lý từ API nếu cần
        return response.data;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error; // Re-throw the error for higher-level handling if needed
      }
    };

    const openCamera = () => {
      const options = {
        saveToPhotos: true,
        mediaType: 'photo',
        includeBase64: true, // Sử dụng base64 để lấy ảnh từ camera
        quality: 1,
      };
    
      launchCamera(options, async response => {
        console.log('Full response:', response);
        if (response.assets && response.assets.length > 0) {
          const selectedImageBase64 = response.assets[0].base64; // Lấy base64 của ảnh từ response
          const selectedImageUri = response.assets[0].uri;
          const selectedImageType = response.assets[0].type;
    
          setImageSource(selectedImageUri);
          setImageType(selectedImageType);
    
          try {
            const licensePlateText = await uploadImageToServer(selectedImageBase64);
    
            setLicensePlate(licensePlateText);
            setVehicleNumber(processLicensePlateText(licensePlateText));
    
            // Nếu cần xử lý thêm dữ liệu trả về từ API
          } catch (error) {
            console.error('Error in image capturing or analysis:', error);
          }
        } else {
          console.error('No assets found or camera access denied');
        }
      });
    };
    
  
    const analyzeImage = async (imageUri) => {
      const formData = new FormData();
      formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'plate_image.jpg',
      });
  
      try {
          const response = await axios.post('http://tdparking-api.hanhchinhcong.org/docs/LicencePlate/UploadingSingleFile', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
  
          // Xử lý phản hồi từ API và trích xuất thông tin cần thiết
          const plateText = response.data.plateNumber;
          console.log(plateText);
          setLicensePlateText(plateText);
          return plateText;
      } catch (error) {
          console.error('Error analyzing image:', error.response ? error.response.data : error.message);
          throw error; // Ném lỗi để xử lý ở cấp cao hơn nếu cần
      }
  };
  
    const processLicensePlateText = (text) => {
      return text.replace(/\n/g, ' ');
    };
  
    const getBase64Image = async (imageUri) => {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result.split(',')[1];
            resolve(base64data);
          };
          reader.onerror = (error) => reject(error);
        });
    };

    const getImageData = async (imageUri) => {
      const response = await fetch(imageUri);
      const blob = await response.blob();
    
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result.split(',')[1];
          resolve(base64data);
        };
        reader.onerror = (error) => reject(error);
      });
    };

    const enterVehicle = async () => {
      try {
        if (imageSource) {
          const plateNumber = vehicleNumber; 
          const detectedPlateNumber = vehicleNumber; 
          const dateTimeEvent = moment(dateTime).toISOString(); 
          const plateImage = {
            name: imageName,
            extension: `.${imageType}`,
            data: `data:${imageTypeOriginal};base64,${plateImageData}`, 
          };
          const vehicleImage = 'string'; 
          const hardwareSyncId = 'string'; 
          const description = 'string';
          const status = 0; 
          const branchId = branchDetails.id;
          const ticketId = selectedTicket; 
    
          console.log('Request body:', {
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
    
          console.log(response)

          if (response) {
            console.log('Request thành công:', response.data);
            alert('Xe vào thành công!');
            navigation.goBack();
          } else {
            console.error('Request không thành công:', response);
          }
    
          // navigation.goBack();
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
          value={vehicleNumber}
          onChangeText={(text) => setVehicleNumber(text)}
          // editable={false}
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
