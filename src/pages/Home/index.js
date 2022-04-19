import { Alert, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getData, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  // const [play, setPlay] = useState(false);


  useEffect(() => {
    if (isFocused) {

      getData('user').then(res => {
        setUser(res);

        axios.post('https://zavalabs.com/pupuk/api/data.php', {
          id_user: res.id
        }).then(res => {

          console.error('data server', res.data)
          setData(res.data)

        })


      })


    }
  }, [isFocused]);


  const DataKategori = ({
    icon,
    nama,
    nama2,
    onPress,
    warna = colors.primary,
  }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: warna,
          padding: 5,
          borderRadius: 10,
          width: windowWidth / 2.5,
          height: windowHeight / 5,
          elevation: 5,
          justifyContent: 'center',
        }}>
        <View>
          <Icon
            type="ionicon"
            name={icon}
            color={colors.white}
            size={windowWidth / 5}
          />
        </View>
        <View>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              color: colors.white,
              fontSize: windowWidth / 30,
              textAlign: 'center',
              // marginHorizontal: 10,
            }}>
            {nama}
          </Text>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              color: colors.white,
              fontSize: windowWidth / 30,
              textAlign: 'center',
              // marginHorizontal: 10,
            }}>
            {nama2}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };





  return (
    <SafeAreaView style={{
      flex: 1,
      position: 'relative'
    }}>

      <View style={{
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 20,
      }}>
        <Text style={{
          fontFamily: fonts.secondary[600],
          fontSize: windowWidth / 25,
          color: colors.white
        }}>Selamat datang, {user.username}</Text>

        <View style={{
          flexDirection: 'row'
        }}>

          <View style={{
            flex: 2
          }}>
            <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 25,
              color: colors.white
            }}>PKT FORECAST</Text>

          </View>


        </View>

      </View>


      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'space-around',
          alignItems: "center"
        }}>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
          <Image source={require('../../assets/logo.png')} style={{ width: 100, height: 100 }} />


          <Text style={{
            marginTop: 20,
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 15,
            textAlign: 'center',
            color: colors.primary
          }}>APLIKASI</Text>
          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 15,
            textAlign: 'center',
            color: colors.secondary
          }}>PKT FORECAST</Text>
        </View>
      </View>

      <View
        style={{
          padding: 10,
          flex: 1,
          justifyContent: 'center'
        }}>


        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 0,
          }}>
          <DataKategori
            warna={colors.zavalabs}
            onPress={() => navigation.navigate('Product')}
            icon="podium-outline"
            nama="MASTER"
            nama2="PRODUK"
          />
          <DataKategori
            warna={colors.zavalabs}
            onPress={() => navigation.navigate('ProductInput')}
            icon="create-outline"
            nama="HALAMAN"
            nama2="INPUT"
          />
        </View>
        {/*  */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 15,
          }}>
          <DataKategori
            warna={colors.zavalabs}
            onPress={() => navigation.navigate('ProductForecast')}
            icon="analytics-outline"
            nama="HALAMAN"
            nama2="PERAMALAN"
          />
          <DataKategori
            warna={colors.zavalabs}
            onPress={() => navigation.navigate('ProductHistory')}
            icon="document-text-outline"
            nama="HALAMAN"
            nama2="HISTORY"
          />
        </View>

        {/*  */}
      </View>




      <TouchableOpacity onPress={() => {
        storeData('user', null);

        navigation.replace('Login');
      }} style={{

        flexDirection: 'row',
        padding: 10,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Icon type="ionicon" name="log-out-outline" color={colors.white} />
        <Text style={{
          fontFamily: fonts.secondary[600],
          fontSize: windowWidth / 20,
          left: 10,
          color: colors.white
        }}>Keluar</Text>
      </TouchableOpacity>


    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  judul: {
    fontFamily: fonts.secondary[600]
  }
})