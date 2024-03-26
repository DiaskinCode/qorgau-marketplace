import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView, RefreshControl, Dimensions, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker,PROVIDER_GOOGLE } from 'react-native-maps'


export const MapSearchScreen = () => {

    const [search, onChangeSearch] = React.useState('');
    const navigation = useNavigation()
    return (
        <View style={{width:'90%',alignSelf:'center',marginTop:20}}>
            <View style={{width:'100%',backgroundColor:'#F0F0F5',borderRadius:15,height:46,flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>{navigation.navigate('MapSearchScreen')}} style={{width:'50%',justifyContent:'center',alignItems:'center'}}><Text style={{fontFamily:'medium',fontSize:16}}>По названию</Text></TouchableOpacity>
                <TouchableOpacity style={{width:'50%',backgroundColor:'#675BFB',borderRadius:15,justifyContent:'center',alignItems:'center'}}><Text style={{color:'#fff',fontFamily:'medium',fontSize:16}}>По карте</Text></TouchableOpacity>
            </View>
            <MapView
            provider={PROVIDER_GOOGLE} 
            apiKey={"AIzaSyBsasFM_cSM1v5WD3TjMt9ioLgzijOgxxY"}
            style={{ width: '100%', height: 800,marginTop:20,borderRadius:10, borderWidth:1,borderColor:'#675BFB' }}
            initialRegion={{
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            latitude: 51.169392,
            longitude: 71.449074,
            }}
            />
        </View>
    );
  }