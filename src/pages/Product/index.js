import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    FlatList,
    SafeAreaView,
    RefreshControl,
    Image,
    TouchableOpacity,

} from 'react-native';
import { storeData, getData } from '../../utils/localStorage';
import axios from 'axios';
import { colors } from '../../utils/colors';
import { windowWidth, fonts } from '../../utils/fonts';
import 'intl';
import 'intl/locale-data/jsonp/en';
import RBSheet from "react-native-raw-bottom-sheet";
import { MyButton, MyGap, MyInput } from '../../components'

const wait = timeout => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};
export default function ({ navigation, route }) {

    const refRBSheet = useRef();
    const refInput = useRef();


    const [refreshing, setRefreshing] = React.useState(false);
    const [data, setData] = useState([]);
    const [edit, setEdit] = useState({
        id_barang: '',
        nama_barang: '',
        harga_barang: '',
        keterangan_barang: ''
    });

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getDataBarang();
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        getDataBarang();
    }, []);


    const updateProduct = () => {
        refRBSheet.current.close();
        axios
            .post('https://zavalabs.com/pupuk/api/product_update.php', edit)
            .then(x => {
                getDataBarang();

            });

    }
    const getDataBarang = () => {

        axios
            .post('https://zavalabs.com/pupuk/api/product.php')
            .then(x => {
                console.log(x.data);
                setData(x.data);
            });

    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={

                () => {
                    setEdit(item);
                    refRBSheet.current.open();
                    // refInput.focus();
                }
            }
            style={{
                padding: 10,
                margin: 10,
                backgroundColor: 'white',
                elevation: 1,
            }}>
            <View style={{ flexDirection: 'row', padding: 10 }}>
                <Text
                    style={{
                        flex: 1,
                        fontSize: windowWidth / 30,
                        color: colors.primary,
                        fontFamily: fonts.secondary[600],
                    }}>
                    {item.nama_barang}
                </Text>
                <Text
                    style={{
                        fontSize: windowWidth / 20,
                        color: colors.black,
                        fontFamily: fonts.secondary[600],
                    }}>
                    {new Intl.NumberFormat().format(item.harga_barang)}
                </Text>
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    padding: 10,
                    borderTopWidth: 1,
                    borderTopColor: colors.tertiary,
                }}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        // flex: 1,
                    }}>
                    <Text
                        style={{
                            fontSize: windowWidth / 30,
                            fontFamily: fonts.secondary[600],
                            color: colors.black,
                        }}>
                        Deskripsi
                    </Text>

                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 2 }}>
                    <Text>{item.keterangan_barang}</Text>
                </View>

            </View>
        </TouchableOpacity >
    );

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[colors.primary]}
                />
            }
            style={{
                padding: 10,
            }}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                    }
                }}
            >
                <View style={{
                    padding: 10
                }}>
                    <Text style={{
                        fontSize: windowWidth / 20,
                        fontFamily: fonts.secondary[600],
                        color: colors.black,
                    }}>{edit.nama_barang}</Text>
                    <MyGap jarak={10} />
                    <MyInput autoFocus={true} ref={(input) => { refInput = input }} label="Keterangan" iconname="create-outline" multiline={true} value={edit.keterangan_barang} onChangeText={x => setEdit({
                        ...edit,
                        keterangan_barang: x
                    })} />
                    <MyGap jarak={10} />
                    <MyButton title="Simpan Perubahan" warna={colors.primary} onPress={updateProduct} />
                </View>
            </RBSheet>
        </ScrollView>
    );
}

const styles = StyleSheet.create({});
