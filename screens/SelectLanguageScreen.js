import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet,  TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView, RefreshControl, Dimensions, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export const SelectLanguageScreen = () => {
    const navigation = useNavigation()
    return (
        <View style={{alignItems:'center',width:'90%',marginHorizontal:'5%',marginTop:80}}>
            <Image style={{height:104,width:130,objectFit:'cover'}} source={require('../assets/logo.jpg')}/>
            <Text style={{ fontFamily: 'bold',fontSize:25, textAlign:'center',marginTop:20}} >Выберите язык</Text>
            <Text style={{ fontFamily: 'regular',fontSize:15,color:"#96949D",width:253,lineHeight:21,marginTop:10, textAlign:'center' }} >Вы можете изменить его{"\n"}в <Text style={{ fontFamily: 'regular',fontSize:15,color:"#675BFB" }} >настройках</Text> вашего профиля </Text>

            <View style={{marginTop:220,flexDirection:'row',justifyContent:'center'}}>
                <TouchableOpacity style={{paddingVertical:15,width:165,backgroundColor:'#F9F6FF',borderRadius:5,alignItems:'center',borderColor:'#675BFB',borderWidth:1}}>
                    <Text style={{color:'#F26F1D',fontSize:16,}}>Казахский</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {navigation.navigate('LoginOrRegistration')}} style={{marginLeft:10,paddingVertical:15,width:165,backgroundColor:'#F9F6FF',borderRadius:5,alignItems:'center',borderColor:'#675BFB',borderWidth:1}}>
                    <Text style={{color:'#F26F1D',fontSize:16,}}>Русский</Text>
                </TouchableOpacity>
            </View>
            <Text style={{fontFamily:'medium',fontSize:14,marginTop:130,marginBottom:35,textAlign:'center',color:'#24144E'}}>BEINE JARNAMA</Text>
        </View>
    );
  }