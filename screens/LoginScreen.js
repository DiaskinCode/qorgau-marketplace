import React, { useState, useCallback, useMemo } from 'react';
import { View, TextInput,  TouchableOpacity, ScrollView, KeyboardAvoidingView, Image, Text, Platform,Alert,Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { loginSuccess } from '../actions/authActions';
import { useDispatch } from 'react-redux';
import {useTranslation} from 'react-i18next'

export const LoginScreen = () => {
    const {t} = useTranslation();
    const [login, onChangeLogin] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const [showPassword, setShowPassword] = useState(false); 

    const toggleShowPassword = () => { 
        setShowPassword(!showPassword); 
    }; 

    const validateForm = () => {
        if (!login.trim() || !password.trim()) {
            setError('Пожалуйста заполните пустые поля');
            return false;
        }
        setError(''); // Clear previous errors
        return true;
    };

    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (!validateForm()) {
            return; // Stop the login process if validation fails
        }
        setIsLoading(true); 
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
              setIsLoading(false); 
              Alert.alert('Логин или пароль не правильный', '')
          }
      } catch (error) {
          Alert.alert('Ошибка', error)
      }
  };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            >
            <Modal
                animationType="slide"
                transparent={true}
                visible={isLoading}
                onRequestClose={() => {
                setIsLoading(false);
                }}
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.modalText}>Вход в аккаунт</Text>
                </View>
                </View>
            </Modal>
             <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ alignItems: 'center', width: '90%', marginHorizontal: '5%', marginTop: 80 }}>
                    <Image style={{height:104,width:130,objectFit:'cover'}} source={require('../assets/logo.jpg')}/>
                    <Text style={{ fontFamily: 'bold',fontSize:25, textAlign:'center',marginTop:20}} >{t('login.login_to_acc')}</Text>
                    <Text style={{ fontFamily: 'regular',fontSize:15,color:"#96949D",width:253,lineHeight:21,marginTop:20, textAlign:'center' }} ></Text>
                    <View style={{marginTop:40}}>
                        <Text style={{fontFamily:'medium' ,marginBottom:10,fontSize:14}}>{t('number_or_email')}</Text>
                        <TextInput
                            style={{width:350,paddingHorizontal:10,height:50,borderWidth:1,borderRadius:5,borderColor:'#675BFB'}}
                            onChangeText={onChangeLogin}
                            value={login}
                            placeholder={t('login.input_fields')}
                        />
                    </View>
                    <View style={{marginTop:15}}>
                        <Text style={{fontFamily:'medium' ,marginBottom:10,fontSize:14}}>{t('password')}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',width:350,paddingHorizontal:10,height:50,borderWidth:1,borderRadius:5,borderColor:'#675BFB'}}>
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
                    </View>
                    <View style={{marginTop:20,justifyContent:'center'}}>
                        {error ? <Text style={{color: 'red', textAlign: 'center', marginBottom: 15}}>{error}</Text> : null}
                        <TouchableOpacity onPress={handleLogin} style={{paddingVertical:15,width:350,backgroundColor:'#F26F1D',borderRadius:5,alignItems:'center'}}>
                            <Text style={{color:'#FFF',fontSize:16,}}>{t('login.login')}</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity>
                            <Text style={{marginTop:10, color:'#96949D',fontSize:15}}>Забыли пароль?</Text>
                        </TouchableOpacity> */}
                    </View>
                    <Text style={{fontFamily:'medium',fontSize:14,marginTop:95,marginBottom:35,textAlign:'center',color:'#24144E'}}>BEINE JARNAMA</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      paddingTop:50,
      alignItems: 'center',
      shadowColor: '#666',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginTop: 25,
      fontFamily:'medium',
      fontSize:16,
      textAlign: 'center',
    },
  });
  
  