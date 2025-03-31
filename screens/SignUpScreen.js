import React, { useState, useCallback, useMemo } from 'react';
import { View, TextInput,  TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView, KeyboardAvoidingView,Platform,RefreshControl, Dimensions, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import {useTranslation} from 'react-i18next'

export const SignUpScreen = () => {
    const navigation = useNavigation()
    const {t} = useTranslation();

    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [password2Error, setPassword2Error] = useState('');


    const [login, onChangeLogin] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    const [password2, onChangePassword2] = React.useState('');

    const [showPassword, setShowPassword] = useState(false); 

    const [showPassword2, setShowPassword2] = useState(false); 

    const toggleShowPassword = () => { 
        setShowPassword(!showPassword); 
    }; 

    const toggleShowPassword2 = () => { 
        setShowPassword2(!showPassword2); 
    }; 

    const validate = () => {
        let isValid = true;
    
        if (!login.trim()) {
            setLoginError(t('register.error.login_required'));
            isValid = false;
        } else {
            setLoginError('');
        }
    
        // Проверка первого пароля
        if (!password.trim()) {
            setPasswordError(t('register.error.password_required'));
            isValid = false;
        } else if (password.length < 6) { // Допустим, минимальная длина пароля — 6 символов
            setPasswordError(t('register.error.password_length'));
            isValid = false;
        } else {
            setPasswordError('');
        }
    
        // Проверка второго пароля
        if (password !== password2) {
            setPassword2Error(t('register.error.passwords_do_not_match'));
            isValid = false;
        } else {
            setPassword2Error('');
        }
    
        return isValid;
    };
    
    const handleRegistration = () => {
        if (validate()) {
            navigation.navigate('Profile', { login: login, password: password });
        }
    };
    

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        >
         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{alignItems:'center',width:'90%',marginHorizontal:'5%',marginTop:80}}>
            <Image style={{height:104,width:130,objectFit:'cover'}} source={require('../assets/logo.jpg')}/>
            <Text style={{ fontFamily: 'bold',fontSize:25, textAlign:'center',marginTop:20}} >{t('register.register_of_acc')}</Text>
            <Text style={{ fontFamily: 'regular',fontSize:15,color:"#96949D",width:255,lineHeight:21,marginTop:10, textAlign:'center' }} >{t('register.create_acc')}</Text>

            <View style={{marginTop:40}}>
                <TextInput
                    style={{width:350,paddingHorizontal:10,height:50,borderWidth:1,borderRadius:5,borderColor:'#675BFB'}}
                    onChangeText={onChangeLogin}
                    value={login}
                    placeholder={t('number_or_email')}
                />
            </View>
            <View>
                <View style={{marginTop:10,flexDirection:'row',alignItems:'center',width:350,paddingHorizontal:10,height:50,borderWidth:1,borderRadius:5,borderColor:'#675BFB'}}>
                    <TextInput
                        style={{width:'90%'}}
                        onChangeText={onChangePassword}
                        value={password}
                        placeholder={t('password')}
                        secureTextEntry={!showPassword}
                    />
                    <MaterialCommunityIcons 
                        name={showPassword ? 'eye-off' : 'eye'} 
                        size={24} 
                        color="#675BFB"
                        style={{marginLeft: 10, }} 
                        onPress={toggleShowPassword} 
                    /> 
                </View>
                <View style={{marginTop:10,flexDirection:'row',alignItems:'center',width:350,paddingHorizontal:10,height:50,borderWidth:1,borderRadius:5,borderColor:'#675BFB'}}>
                    <TextInput
                        style={{width:'90%'}}
                        onChangeText={onChangePassword2}
                        value={password2}
                        placeholder={t('password')}
                        secureTextEntry={!showPassword2}
                    />
                    <MaterialCommunityIcons 
                        name={showPassword2 ? 'eye-off' : 'eye'} 
                        size={24} 
                        color="#675BFB"
                        style={{marginLeft: 10, }} 
                        onPress={toggleShowPassword2} 
                    /> 
                </View>
            </View>
            <View style={{marginTop:20,justifyContent:'center'}}>
                <View>
                    {loginError ? <Text style={{color: 'red'}}>{loginError}</Text> : null}
                </View>
                <View style={{marginBottom:20}}>
                    <View style={{marginTop:10}}>
                        {passwordError ? <Text style={{color: 'red'}}>{passwordError}</Text> : null}
                    </View>
                    <View style={{marginTop:10}}>
                        {password2Error ? <Text style={{color: 'red'}}>{password2Error}</Text> : null}
                    </View>
                </View>
                <TouchableOpacity onPress={handleRegistration} style={{paddingVertical:15,width:350,backgroundColor:'#F26F1D',borderRadius:5,alignItems:'center'}}>
                    <Text style={{color:'#FFF',fontSize:16,}}>{t('continue')}</Text>
                </TouchableOpacity>
            </View>
        </View>
        <Text style={{fontFamily:'medium',fontSize:14,bottom:45,textAlign:'center',color:'#24144E',position:'absolute',alignSelf:'center'}}>BEINE JARNAMA</Text>
        </ScrollView>
    </KeyboardAvoidingView>
    );
  }