import React, { useEffect } from 'react';
import { View, StyleSheet,  TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView, RefreshControl, Dimensions, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';


export const SelectLanguageScreen = () => {
    const navigation = useNavigation()
    const { t, i18n } = useTranslation();
    
    const handleLanguage = (language) => {
        i18n.changeLanguage(language)
        navigation.navigate('LoginOrRegistration')
    }
    return (
        <View style={{alignItems:'center',width:'90%',marginHorizontal:'5%',marginTop:80}}>
            <Image style={{height:104,width:130,objectFit:'cover'}} source={require('../assets/logo.jpg')}/>
            <Text style={{ fontFamily: 'bold',fontSize:25, textAlign:'center',marginTop:20}} >{t('select_language.select_language')}</Text>
            <Text style={{ fontFamily: 'regular',fontSize:15,color:"#96949D",width:253,lineHeight:21,marginTop:10, textAlign:'center' }} >{t('select_language.you_could_change_language')}</Text>

            <View style={{marginTop:220,flexDirection:'row',justifyContent:'center'}}>
                <TouchableOpacity onPress={() => {handleLanguage('kz')}} style={{paddingVertical:15,width:165,backgroundColor:'#F9F6FF',borderRadius:5,alignItems:'center',borderColor:'#675BFB',borderWidth:1}}>
                    <Text style={{color:'#F26F1D',fontSize:16,}}>{t('kaz')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {handleLanguage('ru')}} style={{marginLeft:10,paddingVertical:15,width:165,backgroundColor:'#F9F6FF',borderRadius:5,alignItems:'center',borderColor:'#675BFB',borderWidth:1}}>
                    <Text style={{color:'#F26F1D',fontSize:16,}}>{t('rus')}</Text>
                </TouchableOpacity>
            </View>
            <Text style={{fontFamily:'medium',fontSize:14,marginTop:130,marginBottom:35,textAlign:'center',color:'#24144E'}}>BEINE JARNAMA</Text>
        </View>
    );
  }