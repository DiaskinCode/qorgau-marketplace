import React, { useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';


export const LoginOrRegistrationScreen = () => {
    const navigation = useNavigation()
    const {t} = useTranslation();
    return (
        <View style={{alignItems:'center',width:'90%',marginHorizontal:'5%',marginTop:80}}>
            <Image style={{height:104,width:130,objectFit:'cover'}} source={require('../assets/logo.jpg')}/>
            <Text style={{ fontFamily: 'bold',fontSize:25, textAlign:'center',marginTop:20}} >{t('welcome')}</Text>
            <Text style={{ fontFamily: 'regular',fontSize:15,color:"#96949D",width:253,lineHeight:21,marginTop:10, textAlign:'center' }} >{t('welcome_desc')}</Text>

            <View style={{marginTop:165,justifyContent:'center'}}>
                <TouchableOpacity onPress={() => {navigation.navigate('Signup')}} style={{paddingVertical:15,width:350,borderRadius:5,alignItems:'center',borderColor:'#F26F1D',marginBottom:10,borderWidth:1}}>
                    <Text style={{color:'#F26F1D',fontSize:16,}}>{t('register.register')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {navigation.navigate('Login')}} style={{paddingVertical:15,width:350,backgroundColor:'#F26F1D',borderRadius:5,alignItems:'center'}}>
                    <Text style={{color:'#FFF',fontSize:16,}}>{t('login.login')}</Text>
                </TouchableOpacity>
            </View>
            <Text style={{fontFamily:'medium',fontSize:14,marginTop:125,marginBottom:35,textAlign:'center',color:'#24144E'}}>BEINE JARNAMA</Text>
        </View>
    );
  }