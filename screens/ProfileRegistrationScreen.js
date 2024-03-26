import React, { useState, useEffect } from 'react';
import { View, TextInput,  TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView, RefreshControl, Dimensions, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { loginSuccess } from '../actions/authActions';
import { useDispatch } from 'react-redux';

export const ProfileRegistrationScreen = ({route}) => {
    const { login, password } = route.params;
    const navigation = useNavigation()
    const [name, onChangeName] = useState('');
    const dispatch = useDispatch()
    const [image, setImage] = useState(null);


    useEffect(() => {
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      })();
    }, []);
  

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

    const handleRegistration = async () => {
        const formData = new FormData();
        formData.append('username', login);
        formData.append('password', password);
        formData.append('email', login);
        formData.append('profile_image', {
          uri: image,
          type: 'image/jpeg', // or your image mime type
          name: 'profile_image.jpg',
        });
        formData.append('profile.phone_number', ''); // add your phone number
    
        try {
          const response = await fetch('http://185.129.51.171:8000/api/register/', {
            method: 'POST',
            body: formData,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            // Handle successful registration, e.g., navigate to the next screen
            dispatch(loginSuccess(data.user, data.token));
          } else {
            // Handle registration error
            console.error('Registration failed:', response.status);
          }
        } catch (error) {
          console.error('Error during registration:', error);
        }
      };

    return (
        <View style={{alignItems:'center',width:'90%',marginHorizontal:'5%',marginTop:80}}>
            <Image style={{height:104,width:130,objectFit:'cover'}} source={require('../assets/logo.jpg')}/>
            <Text style={{ fontFamily: 'bold',fontSize:25, textAlign:'center',marginTop:20}} >Регистрация аккаунта</Text>
            <Text style={{ fontFamily: 'regular',fontSize:15,color:"#96949D",width:255,lineHeight:21,marginTop:10, textAlign:'center' }} >Создайте аккаунт чтобы пользоваться всеми функциями приложения</Text>


            <TouchableOpacity style={{marginTop:40}} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={{ width: 110, height: 110, borderRadius:5,borderWidth:1,borderColor:'#675BFB' }} />
                ) : (
                    <View style={{ width: 110, height: 110, backgroundColor: '#F9F6FF', borderRadius: 5,borderWidth:1,borderColor:'#675BFB', justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{height:25,width:25,marginTop:20}} source={require('../assets/plus.jpg')} />
                        <Text style={{ fontFamily:'regular',fontSize:14,color:'#96949D',marginTop:10, }}>Фото профиля</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={{marginTop:40}}>
                <TextInput
                    style={{width:350,paddingHorizontal:10,height:50,borderWidth:1,borderRadius:5,borderColor:'#675BFB'}}
                    onChangeText={onChangeName}
                    value={name}
                    placeholder="Введите ваше имя"
                />
            </View>

            <View style={{marginTop:20,justifyContent:'center'}}>
                <TouchableOpacity onPress={handleRegistration} style={{paddingVertical:15,width:350,backgroundColor:'#F26F1D',borderRadius:5,alignItems:'center'}}>
                    <Text style={{color:'#FFF',fontSize:16,}}>Продолжить</Text>
                </TouchableOpacity>
            </View>
            <Text style={{fontFamily:'medium',fontSize:14,marginTop:120,marginBottom:35,textAlign:'center',color:'#24144E'}}>BEINE JARNAMA</Text>
        </View>
    );
  }