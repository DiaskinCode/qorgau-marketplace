import React, { useState, useCallback, useMemo } from 'react';
import { View, TextInput,  TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView, RefreshControl, Dimensions, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { loginSuccess } from '../actions/authActions';
import { useDispatch } from 'react-redux';


export const LoginScreen = () => {
    const navigation = useNavigation()
    const [login, onChangeLogin] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    const [showPassword, setShowPassword] = useState(false); 

    const toggleShowPassword = () => { 
        setShowPassword(!showPassword); 
    }; 

    const dispatch = useDispatch();

    const handleLogin = async () => {
      try {
          const response = await fetch('http://185.129.51.171/api/login/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  username: login,
                  password: password,
              }),
          });
  
          if (response.ok) {
              const data = await response.json();
              const { id, username, email, profile, profile_image } = data.user;
              dispatch(loginSuccess({ id, username, email, profile, profile_image }, data.token));
              console.log(data.token);
          } else {
              console.log('Login failed');
          }
      } catch (error) {
          console.error('Error during login:', error);
      }
  };

    return (
        <View style={{alignItems:'center',width:'90%',marginHorizontal:'5%',marginTop:80}}>
            <Image style={{height:104,width:130,objectFit:'cover'}} source={require('../assets/logo.jpg')}/>
            <Text style={{ fontFamily: 'bold',fontSize:25, textAlign:'center',marginTop:20}} >Войдите в свой аккаунт</Text>
            <Text style={{ fontFamily: 'regular',fontSize:15,color:"#96949D",width:253,lineHeight:21,marginTop:10, textAlign:'center' }} >Если вы забыли пароль, то  вы{"\n"}
                можете <Text style={{ fontFamily: 'regular',fontSize:15,color:"#675BFB" }} >восстановить</Text> его</Text>

            <View style={{marginTop:40}}>
                <Text style={{fontFamily:'medium' ,marginBottom:10,fontSize:14}}>Телефон или почта</Text>
                <TextInput
                    style={{width:350,paddingHorizontal:10,height:50,borderWidth:1,borderRadius:5,borderColor:'#675BFB'}}
                    onChangeText={onChangeLogin}
                    value={login}
                    placeholder="Поле для ввода"
                />
            </View>
            <View style={{marginTop:15}}>
                <Text style={{fontFamily:'medium' ,marginBottom:10,fontSize:14}}>Пароль</Text>
                <View style={{flexDirection:'row',alignItems:'center',width:350,paddingHorizontal:10,height:50,borderWidth:1,borderRadius:5,borderColor:'#675BFB'}}>
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
            </View>
            <View style={{marginTop:20,justifyContent:'center'}}>
                <TouchableOpacity onPress={handleLogin} style={{paddingVertical:15,width:350,backgroundColor:'#F26F1D',borderRadius:5,alignItems:'center'}}>
                    <Text style={{color:'#FFF',fontSize:16,}}>Войти</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={{marginTop:10, color:'#96949D',fontSize:15}}>Забыли пароль?</Text>
                </TouchableOpacity>
            </View>
            <Text style={{fontFamily:'medium',fontSize:14,marginTop:95,marginBottom:35,textAlign:'center',color:'#24144E'}}>BEINE JARNAMA</Text>
        </View>
    );
  }