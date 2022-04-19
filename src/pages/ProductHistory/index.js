import React, { useEffect, useState } from 'react';
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
    Alert,
} from 'react-native';
import { storeData, getData } from '../../utils/localStorage';
import axios from 'axios';
import { colors } from '../../utils/colors';
import { windowWidth, fonts } from '../../utils/fonts';
import { Icon } from 'react-native-elements';
import 'intl';
import 'intl/locale-data/jsonp/en';

const wait = timeout => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};
export default function ({ navigation, route }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const [data, setData] = useState([]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getDataBarang();
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        getDataBarang();
    }, []);

    const getDataBarang = () => {
        axios
            .post('https://zavalabs.com/pupuk/api/product_history.php')
            .then(x => {
                console.log(x.data);
                setData(x.data);
            });

    };

    const renderItem = ({ item }) => (
        <View
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
                        fontSize: windowWidth / 30,
                        color: colors.black,
                        fontFamily: fonts.secondary[600],
                    }}>
                    {item.tanggal}
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
                        flex: 1,
                    }}>
                    <Text
                        style={{
                            fontSize: windowWidth / 30,
                            fontFamily: fonts.secondary[600],
                            color: colors.black,
                        }}>
                        {new Intl.NumberFormat().format(item.jumlah)}
                    </Text>

                </View>

                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',

                        flex: 1,
                    }}>
                    <Text
                        style={{
                            fontSize: windowWidth / 30,
                            fontFamily: fonts.secondary[600],
                            color: colors.black,
                        }}>
                        {new Intl.NumberFormat().format(item.total)}
                    </Text>

                </View>
                <View
                    style={{
                        alignItems: 'flex-end',
                        justifyContent: 'center',

                        flex: 1,
                    }}>
                    <Text
                        style={{
                            fontSize: windowWidth / 20,
                            fontFamily: fonts.secondary[600],
                            color: colors.secondary,
                        }}>
                        {/* {new Intl.NumberFormat().format(parseFloat(item.total / item.jumlah).toFixed(2))} */}

                        {new Intl.NumberFormat().format(Math.round(item.total / item.jumlah))}

                    </Text>

                </View>
            </View>

        </View>
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({});
