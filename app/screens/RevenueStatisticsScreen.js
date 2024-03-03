// RevenueStatisticsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TD_Header, TDTextInputNew } from '../components';
import { Colors } from '../theme';

const RevenueStatisticsScreen = () => {
  // Dữ liệu biểu đồ doanh thu
  const chartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
    datasets: [
      {
        data: [3776000, 4200000, 3500000, 4000000, 3900000],
      },
    ],
  };

  return (
    <View style={styles.container}>
        <TD_Header
        title="Thống kê doanh thu"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
        leftComponent
        isHome  
      /> 
      <Text style={styles.header}>Thống kê doanh thu</Text>
      <Text style={styles.infoText}>Doanh thu trong tháng: 3.776.000 đ</Text>
      <Text style={styles.infoText}>Tổng lượt gửi xe: 423 lượt</Text>
      
      {/* Biểu đồ doanh thu */}
      <LineChart
        data={chartData}
        width={350}
        height={200}
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  chart: {
    marginTop: 20,
  },
});

export default RevenueStatisticsScreen;
