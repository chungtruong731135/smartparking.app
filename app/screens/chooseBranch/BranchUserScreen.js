import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import API from '../../services/GlobalAPI';
import { useSelector } from 'react-redux';
import { TD_Header } from '../../components';
import { Colors } from '../../theme';
import base64 from 'base-64';
import { parseJwt } from '../../redux/global/Slice'
import { useNavigation } from '@react-navigation/native';


const BranchUserScreen = () => {
    const token = useSelector((state) => state.global.accessToken); 
    const [branches, setBranches] = useState([]);
    const [branchDetails, setBranchDetails] = useState({});
    const navigation = useNavigation()

    let decodedToken = parseJwt(token);
    let userId = decodedToken.uid;
    
    const getBranchesForUser = async () => {
        if (!userId) {
            console.error('UID không tồn tại trong token');
            return;
        }

        try {
          const response = await API.requestPOST_SP('/api/v1/branchusers/search', {
            pageNumber: 1,
            pageSize: 1000,
            userId: userId,
          });

            setBranches(response.data);
            console.log(branches)
            return response.data.map(branch => branch.branchId);
        } catch (error) {
          console.error('Lỗi lấy danh sách branches:', error);
        }
      };

      const getBranchDetails = async (branchId) => {
        try {
            const response = await API.requestGET_SP(`/api/v1/branches/${branchId}`);
            setBranchDetails(prevDetails => ({ ...prevDetails, [branchId]: response.data }));
        } catch (error) {
            console.error('Lỗi lấy thông tin chi tiết branch:', error);
        }
    };

    useEffect(() => {
        const fetchBranchDetails = async () => {
            const branchIds = await getBranchesForUser();
            branchIds.forEach(branchId => {
                getBranchDetails(branchId); // Lấy thông tin chi tiết cho mỗi chi nhánh
            });
        };

        fetchBranchDetails();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.branchItem}
            // Thêm sự kiện onPress để chuyển hướng và truyền dữ liệu
            onPress={() => navigation.navigate('MAIN_HomeScreen', {
                branchDetails: branchDetails[item]
            })}
        >
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                Bãi đỗ xe: {branchDetails[item]?.name}
            </Text>
            <Text>Địa chỉ: {branchDetails[item]?.address}</Text>
            <Text>Số điện thoại: {branchDetails[item]?.phoneNumber}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TD_Header
                title="Danh sách chi nhánh"
                showBackButton={false}
                backgroundColor={Colors.primary}
                textColor={'#fff'}
                leftComponent
                isHome
            />
            <FlatList
                data={Object.keys(branchDetails)}
                renderItem={renderItem}
                keyExtractor={item => item.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    branchItem: {
        backgroundColor: Colors.primaryLight,
        padding: 15, 
        marginVertical: 8, 
        marginHorizontal: 16, 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },

});




export default BranchUserScreen;

