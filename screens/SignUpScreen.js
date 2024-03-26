import React, { useState, useCallback, useMemo } from 'react';
import { View, TextInput,  TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView, RefreshControl, Dimensions, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


export const SignUpScreen = () => {
    const navigation = useNavigation()
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



    return (
        <View style={{alignItems:'center',width:'90%',marginHorizontal:'5%',marginTop:80}}>
            <Image style={{height:104,width:130,objectFit:'cover'}} source={require('../assets/logo.jpg')}/>
            <Text style={{ fontFamily: 'bold',fontSize:25, textAlign:'center',marginTop:20}} >Регистрация аккаунта</Text>
            <Text style={{ fontFamily: 'regular',fontSize:15,color:"#96949D",width:255,lineHeight:21,marginTop:10, textAlign:'center' }} >Создайте аккаунт чтобы пользоваться всеми функциями приложения</Text>

            <View style={{marginTop:40}}>
                <TextInput
                    style={{width:350,paddingHorizontal:10,height:50,borderWidth:1,borderRadius:5,borderColor:'#675BFB'}}
                    onChangeText={onChangeLogin}
                    value={login}
                    placeholder="Почта или номер телефона"
                />
            </View>
            <View>
                <View style={{marginTop:10,flexDirection:'row',alignItems:'center',width:350,paddingHorizontal:10,height:50,borderWidth:1,borderRadius:5,borderColor:'#675BFB'}}>
                    <TextInput
                        style={{width:'90%'}}
                        onChangeText={onChangePassword}
                        value={password}
                        placeholder="Пароль"
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
                        placeholder="Пароль"
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
                <TouchableOpacity onPress={() => {navigation.navigate('Profile',{login:login,password:password})}} style={{paddingVertical:15,width:350,backgroundColor:'#F26F1D',borderRadius:5,alignItems:'center'}}>
                    <Text style={{color:'#FFF',fontSize:16,}}>Продолжить</Text>
                </TouchableOpacity>
            </View>
            <Text style={{fontFamily:'medium',fontSize:14,marginTop:120,marginBottom:35,textAlign:'center',color:'#24144E'}}>BEINE JARNAMA</Text>
        </View>
    );
  }