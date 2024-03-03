import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TD_MenuHeader, TD_MenuItem } from '../components'
import { Divider } from 'react-native-elements'
import * as actions from '../redux/global/Actions';
const RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob';
import Modal from 'react-native-modal';

const SideBar = (props) => {
    const dispatch = useDispatch();

    const [selectKey, setSelectKey] = useState('A');
    const [visibleModal, setVisibleModal] = useState(false);

    const handLogOut = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất không? Toàn bộ dữ liệu cá nhân trong ứng dụng sẽ bị xoá',
            [
                { text: 'Đóng', onPress: () => console.log('Thoat') },
                { text: 'Đăng xuất', onPress: () => logOut() },
            ],
            { cancelable: false },
        );
    }

    const logOut = async () => {
        setVisibleModal(true)
        let dirs = RNFetchBlob.fs.dirs;
        var _url = dirs.DocumentDir;
        RNFS.unlink(_url);
        setTimeout(() => {
            dispatch(actions.logOut());
            setVisibleModal(false)
        }, 1000);
    }

    return (
        <ScrollView>
            <View style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                <TD_MenuItem
                    itemKey={'A'}
                    selectKey={selectKey}
                    setSelectKey={setSelectKey}
                    navigate={'MAIN_HomeScreen'}
                    item={{}}
                    icon={'home'}
                    title={'Trang chủ'}
                    {...props}
                />
                <Modal
                    onBackdropPress={() => setVisibleModal(false)}
                    backdropTransitionOutTiming={0}
                    isVisible={visibleModal}
                    style={{ margin: 0 }}
                    hideModalContentWhileAnimating={true}>
                    <View
                        style={{
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 4,
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                            margin: 20,
                            padding: 20,
                        }}>
                        <ActivityIndicator size="large" color={'#FFB300'} style={{ paddingVertical: 10 }} />
                        <Text>Đang tiến hành đăng xuất</Text>
                    </View>
                </Modal>

            </View>
        </ScrollView>
    );
};

export default SideBar

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flex: 1,
    },
})