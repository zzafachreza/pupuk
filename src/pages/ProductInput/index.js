import { StyleSheet, SafeAreaView, ScrollView, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import DatePicker from 'react-native-date-picker';
import { fonts, windowHeight, windowWidth, colors } from '../../utils';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import RBSheet from "react-native-raw-bottom-sheet";
import { MyButton, MyGap, MyInput } from '../../components';
import 'intl';
import 'intl/locale-data/jsonp/en';

import moment from 'moment';

import MonthPicker from 'react-native-month-year-picker';

export default function ProductInput() {


    const [kirim, setKirim] = useState({
        tanggal: moment(new Date()).format(DEFAULT_OUTPUT_FORMAT)
    });
    const [edit, setEdit] = useState({});
    const [data, setData] = useState([]);
    const [tmp, setTmp] = useState([]);
    const refRBSheet = useRef();



    const getDataBarang = () => {

        axios
            .post('https://zavalabs.com/pupuk/api/product.php')
            .then(x => {
                setData(x.data);
            });

    };



    const getTmp = (x = kirim.tanggal) => {

        axios
            .post('https://zavalabs.com/pupuk/api/tmp_transaksi.php', {
                tanggal: x
            })
            .then(x => {
                console.error(x.data);
                setTmp(x.data);
            });

    };

    const InsertData = () => {
        refRBSheet.current.close();
        console.log(kirim);
        axios
            .post('https://zavalabs.com/pupuk/api/add_transaksi.php', kirim)
            .then(x => {
                console.log(x.data);
                getTmp();
                setKirim({
                    ...kirim,
                    id_barang: '',
                    jumlah: '',
                    total: ''
                })
            });
    }

    const HapusTmp = (x) => {

        axios
            .post('https://zavalabs.com/pupuk/api/product_delete.php', {
                id_transaksi: x
            })
            .then(x => {
                console.log(x.data);
                getTmp();
            });
    }



    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const showPicker = useCallback((value) => setShow(value), []);

    const onValueChange = useCallback(
        (event, newDate) => {
            const selectedDate = newDate || date;

            showPicker(false);
            setDate(selectedDate);
            setKirim({
                ...kirim,
                tanggal: moment(selectedDate).format(DEFAULT_OUTPUT_FORMAT)
            })
            getTmp(moment(selectedDate).format(DEFAULT_OUTPUT_FORMAT));
        },
        [date, showPicker],
    );

    const DEFAULT_OUTPUT_FORMAT = 'MM-YYYY';

    useEffect(() => {
        getDataBarang();
        getTmp();
    }, [])

    return (
        <SafeAreaView style={{
            flex: 1,
            padding: 10,
        }}>

            <View >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 3,
                    }}>
                    <Icon type="ionicon" name="calendar" color={colors.primary} size={16} />
                    <Text
                        style={{
                            fontFamily: fonts.secondary[600],
                            color: colors.primary,
                            left: 10,
                            fontSize: 14,
                        }}>
                        Masukan Bulan Transaksi
                    </Text>
                </View>
                {show && <MonthPicker
                    onChange={onValueChange}


                    value={date}
                    minimumDate={new Date(2020)}
                    maximumDate={new Date(2025, 5)}
                    locale="id"
                />}

                <View style={{
                    flexDirection: 'row',
                    padding: 10,
                }}>
                    <View style={{ flex: 1, }}>
                        <Text>{moment(date).format(DEFAULT_OUTPUT_FORMAT)}</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={{
                            padding: 5,
                            justifyContent: 'center',
                            alignItems: 'center',

                            backgroundColor: colors.secondary,
                            width: 80,
                        }} onPress={() => showPicker(true)}>
                            <Icon type='ionicon' name='calendar-outline' size={windowWidth / 25} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 3,
                    }}>
                    <Icon type="ionicon" name="cube" color={colors.primary} size={16} />
                    <Text
                        style={{
                            fontFamily: fonts.secondary[600],
                            color: colors.primary,
                            left: 10,
                            fontSize: 14,
                        }}>
                        Pilih Produk
                    </Text>
                </View>
                <Picker
                    selectedValue={kirim.id_barang}
                    onValueChange={(itemValue, itemIndex) => {
                        setKirim({ ...kirim, id_barang: itemValue });
                        refRBSheet.current.open();
                    }

                    }>
                    <Picker.Item label="Silahkan pilih produk..." />
                    {
                        data.map(item => {
                            return (
                                <Picker.Item label={item.nama_barang} value={item.id_barang} />
                            )
                        })
                    }


                </Picker>

            </View>
            <ScrollView>
                <View style={{

                    backgroundColor: colors.primary,
                    // borderRadius: 5,
                    padding: 10,
                    flexDirection: 'row'
                }}>
                    <View style={{

                    }}>
                        <Text style={{
                            color: colors.white
                        }}>No.  </Text>
                    </View>
                    <View style={{
                        flex: 2,
                    }}>
                        <Text style={{
                            color: colors.white
                        }}>Nama Produk</Text>
                    </View>
                    <View style={{
                        flex: 1,

                        alignItems: 'flex-end'
                    }}>
                        <Text style={{
                            color: colors.white
                        }}>Jumlah</Text>
                    </View>
                    <View style={{
                        flex: 1,
                        alignItems: 'flex-end'
                    }}>
                        <Text style={{
                            color: colors.white
                        }}>Total Harga</Text>
                    </View>
                    <View style={{
                        flex: 1,
                        alignItems: 'flex-end'
                    }}>
                        <Text style={{
                            color: colors.white
                        }}>Action</Text>
                    </View>
                </View>
                {tmp.map((item, index) => {
                    return (
                        <View style={{
                            borderBottomWidth: 1,
                            // borderRadius: 5,
                            padding: 10,
                            flexDirection: 'row'
                        }}>
                            <View style={{

                            }}>
                                <Text>{index + 1}. </Text>
                            </View>
                            <View style={{
                                flex: 2,
                            }}>
                                <Text>{item.nama_barang}</Text>
                            </View>
                            <View style={{
                                flex: 1,

                                alignItems: 'flex-end'
                            }}>
                                <Text>{item.jumlah}</Text>
                            </View>
                            <View style={{
                                flex: 1,
                                alignItems: 'flex-end'
                            }}>
                                <Text>{new Intl.NumberFormat().format(item.total)}</Text>
                            </View>
                            <View style={{
                                flex: 1,
                                alignItems: 'flex-end'
                            }}>
                                <TouchableOpacity onPress={() => HapusTmp(item.id_transaksi)}>
                                    <Text style={{
                                        color: 'red'
                                    }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
            <RBSheet

                ref={refRBSheet}
                height={windowHeight / 2}
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
                <ScrollView style={{
                    padding: 10,

                }}>

                    <MyGap jarak={10} />
                    <MyInput autoFocus={true} keyboardType="number-pad" label="Jumlah" iconname="create-outline" value={kirim.jumlah} onChangeText={x => setKirim({
                        ...kirim,
                        jumlah: x
                    })} />
                    <MyGap jarak={20} />
                    <MyInput keyboardType="number-pad" label="Total" iconname="create-outline" value={kirim.total} onChangeText={x => setKirim({
                        ...kirim,
                        total: x
                    })} />
                    <MyGap jarak={20} />
                    <MyButton title="Simpan Perubahan" warna={colors.primary} onPress={InsertData} />

                </ScrollView>
            </RBSheet>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({})