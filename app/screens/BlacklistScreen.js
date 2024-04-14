import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import API from '../services/GlobalAPI';
import { TD_Header, TDTextInputNew, FooterMenu } from '../components';
import { Colors } from '../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BlacklistScreen = ({ route }) => {
  const { branchDetails } = route.params;
  const [blacklist, setBlacklist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const fetchBlacklist = async () => {
    try {
      const response = await API.requestPOST_SP('/api/v1/vehicleblacklists/search', {
        pageNumber: 1,
        pageSize: 100,
        branchId: branchDetails.id
      });
      if (response && response.data) {
        setBlacklist(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, [branchDetails.id]);

  const handleDelete = (id) => {
    Alert.alert(
      "Xác nhận xoá",
      "Bạn có chắc chắn muốn xoá xe khỏi danh sách đen?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xoá",
          onPress: async () => {
            try {
              await API.requestDELETE(`/api/v1/vehicleblacklists/${id}`);
              fetchBlacklist();
              Alert.alert(
                "Xoá thành công",
                "Xe đã được xoá khỏi danh sách đen.",
                [{ text: "OK" }]
              );
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert(
                "Xoá thất bại",
                "Đã có lỗi xảy ra khi xoá xe khỏi danh sách đen.",
                [{ text: "OK" }]
              );
            }
          },
        },
      ]
    );
  };
  

  const renderBlacklistItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <View style={styles.column}>
      <Text style={styles.plateNumber}>{item.plateNumber}</Text>
    </View>
    <View style={styles.separator} />
    <View style={[styles.column, styles.descriptionColumn]}>
      <Text style={styles.description}>{item.description}</Text>
    </View>
    <View style={styles.separator} />
    <View style={styles.column}>
      <Icon
        name="delete"
        size={30}
        color={'#000'}
        onPress={() => handleDelete(item.id)}
      />
    </View>
  </View>
);

    const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.column}>
        <Text style={styles.headerText}>Biển số</Text>
      </View>
      <View style={styles.separator} />
      <View style={[styles.column, styles.descriptionColumn]}>
        <Text style={styles.headerText}>Lý do</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.column}>
        <Text style={styles.headerText}>Thao tác</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <TD_Header
        title="Danh sách đen"
        showBackButton={true}
        backgroundColor={Colors.primary}
        textColor={'#fff'}
        leftComponent
        checkrightComponent={true}
        // setShowSearch={setShowSearch}
        isHome  
      />
      <FlatList
        data={blacklist}
        renderItem={renderBlacklistItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd', 
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 2, 
    borderBottomColor: '#333',
  },
  
  column: {
    flex: 1,
    alignItems: 'center',
  },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
  },
  descriptionColumn: {
    flex: 2,
    alignItems: 'center',
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000'
  },
  description: {
    fontSize: 14,
    color: '#000'
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BlacklistScreen;
