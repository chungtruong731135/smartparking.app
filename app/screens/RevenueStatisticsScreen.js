// RevenueStatisticsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet ,TouchableOpacity, Modal, FlatList } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TD_Header, TDTextInputNew } from '../components';
import { Colors } from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import API from '../services/GlobalAPI';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const RevenueStatisticsScreen = () => {
  const route = useRoute();
  const { branchDetails } = route.params;
  const today = new Date();

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [checkoutData, setCheckoutData] = useState([]);

  const lastYear = new Date(new Date().setFullYear(today.getFullYear() - 1));
  const nextYear = new Date(new Date().setFullYear(today.getFullYear() + 1));

  const fetchMonthlyRevenue = async () => {
    try {
      const response = await API.requestPOST_SP('/api/v1/checkoutvehicleevents/calculate-monthly-total-amount', 
        {branchId: branchDetails.id,}
      );
      if (response && response.data) {
        const sortedData = response.data.sort((a, b) => new Date(a.month) - new Date(b.month));

        setMonthlyRevenue(sortedData);
        // Tính tổng doanh thu
        const total = response.data.reduce((acc, curr) => acc + curr.totalAmount, 0);
        setTotalRevenue(total);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin doanh thu', error);
    }
  };

  useEffect(() => {
    fetchMonthlyRevenue();
  }, []);

  const chartData = monthlyRevenue.length > 0 ? {
    labels: monthlyRevenue.map(item => new Date(item.month).toLocaleString('vi-VN', { month: 'numeric', year: 'numeric' })),
    datasets: [
      {
        data: monthlyRevenue.map(item => item.totalAmount),
      },
    ],
  } : null;

  const fetchCheckoutData = async () => {
    try {
      const response = await API.requestPOST_SP('/api/v1/checkoutvehicleevents/search-checkout-event', {
        pageNumber: 1,
        pageSize: 10,
        orderBy: [],
        branchId: branchDetails.id,
        fromDate: startDate.toISOString(),
        toDate: endDate.toISOString()
      });
  
      if (response && response.data) {
        setCheckoutData(response.data);
        console.log(checkoutData)
      }
    } catch (error) {
      console.error('Error fetching checkout data', error);
    }
  };

  const setEndDateTime = (date) => {
    const now = new Date();
    const updatedDate = new Date(date.setHours(now.getHours(), now.getMinutes(), now.getSeconds()));
    setEndDate(updatedDate);
  };
  
  return (
    <View style={styles.container}>
      <TD_Header
        title="Thống kê doanh thu"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
        isHome  
      />
      <Text style={styles.header}>Thống kê doanh thu</Text>
      <Text style={styles.infoText}>
        <Text style={styles.boldText}>Tổng doanh thu trong 5 tháng gần nhất: </Text>
        <Text style={styles.valueText}>{totalRevenue.toLocaleString('vi-VN')} đ</Text>
      </Text>

      {/* Biểu đồ doanh thu */}
      {chartData && (
        <LineChart
          data={chartData}
          width={350}
          height={220}
          yAxisLabel="đ"
          chartConfig={{
            backgroundColor: 'white',
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
            r: '6',
            strokeWidth: '2',
            },
          }}
          style={styles.chart}
        />
      )}

      <Text style={styles.header}>Thống kê doanh thu theo thời gian</Text>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity style={styles.datePickerInput} onPress={() => setShowStartDatePicker(true)}>
          <Text style={styles.datePickerText}>Từ ngày: {startDate.toLocaleDateString('vi-VN')}</Text>
        </TouchableOpacity>
        <Modal
          visible={showStartDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowStartDatePicker(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <DatePicker
                date={startDate}
                onDateChange={setStartDate}
                minimumDate={lastYear}
                maximumDate={nextYear}
                mode="date"
                locale="vi"
                textColor="#000"
              />
              <View style={styles.modalButtonGroup}>
                <TouchableOpacity onPress={() => setShowStartDatePicker(false)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setShowStartDatePicker(false);
                }} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.datePickerInput} onPress={() => setShowEndDatePicker(true)}>
          <Text style={styles.datePickerText}>Đến ngày: {endDate.toLocaleDateString('vi-VN')}</Text>
        </TouchableOpacity>
        <Modal
          visible={showEndDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEndDatePicker(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <DatePicker
                date={endDate}
                onDateChange={setEndDateTime}
                minimumDate={lastYear}
                maximumDate={nextYear}
                mode="date"
                locale="vi"
                textColor="#000"
              />
              <View style={styles.modalButtonGroup}>
                <TouchableOpacity onPress={() => setShowEndDatePicker(false)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setShowEndDatePicker(false);
                }} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 }}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setCheckoutData([])}>
          <Text style={styles.cancelButtonText}>Huỷ Thống Kê</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={fetchCheckoutData}>
          <Text style={styles.modalButtonText}>Thống kê</Text>
        </TouchableOpacity>
      </View>

      {checkoutData.length > 0 ? (
        <FlatList
          data={checkoutData}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.plateNumber}>Biển số: {item.plateNumber}</Text>
              <Text style={styles.dateTime}>Thời gian ra: {moment(item.checkoutDate).format('DD-MM-YYYY HH:mm:ss')}</Text>
              <Text style={[styles.amount, { color: 'green' }]}>Giá: {item.amount.toLocaleString('vi-VN')} đ</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.noDataText}>Không có dữ liệu</Text>
      )}
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
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '50%',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    elevation: 2,
    borderRadius: 5,
    minWidth: 100,
    margin: 20
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  chart: {
    marginTop: 20,
    marginLeft: -20,
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    // paddingHorizontal: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    color: '#000',
    fontSize: 16,
    marginBottom: 5
  },
  datePickerInput: {
    flex: 1,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  datePickerText: {
    color: '#000', // Văn bản màu trắng để đọc được trên nền đen
    fontSize: 16
  },
  boldText: {
    fontWeight: 'bold',
  },
  valueText: {
    color: 'darkgreen',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    elevation: 2,
    borderRadius: 5,
    minWidth: 100,
    marginHorizontal: 10
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  cancelButton: {
    backgroundColor: 'red', // Choose a suitable color
    padding: 10,
    elevation: 2,
    borderRadius: 5,
    minWidth: 100,
    marginHorizontal: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
    backgroundColor: '#fff',
    width: 350
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  dateTime: {
    fontSize: 14,
    color: '#000'
  },
  amount: {
    fontSize: 14
  },
  noDataText: {
    fontSize: 16,
    color: 'grey',
    marginTop: 20,
  },
});

export default RevenueStatisticsScreen;
