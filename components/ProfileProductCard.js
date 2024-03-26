import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Platform, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useDeactivatePostMutation } from '../api';
import { useActivatePostMutation } from '../api';
import { useDeletePostMutation } from '../api';
import { usePayPostMutation } from '../api';
import { useApprovePostMutation } from '../api';

export const ProfileProductCard = (props) => {
    const navigation = useNavigation();
    const video = useRef(null);
    const [deactivatePost] = useDeactivatePostMutation();
    const [activatePost] = useActivatePostMutation();
    const [deletePost] = useDeletePostMutation();
    const [payPost] = usePayPostMutation();
    const [approvePost] = useApprovePostMutation();
  
    const [disappear, setDisappear] = useState(false);
    const [display, setDisplay] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    let buttonText;
    switch (props.screen) {
      case 'Admin':
        buttonText = 'Одобрить';
        break;
      case 'Active':
        buttonText = 'Деактивировать';
        break;
      case 'NotActive':
        buttonText = 'Активировать';
        break;
      case 'Deleted':
        buttonText = 'Восстановить';
        break;
      case 'Payed':
        buttonText = 'Активировать';
        break;
      default:
        buttonText = 'Активировать';
    }

  
    useEffect(() => {
      video.current?.playAsync();
    }, []);
  
    useEffect(() => {
        if (disappear) {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500, // Adjust the duration as needed
            useNativeDriver: true,
          }).start(({ finished }) => {
              setDisappear(true);
            
            if (finished) {
                setDisplay(true)
            }
          });
        }
      }, [disappear, fadeAnim]);
      
  
    const handleOnPress = async () => {
      try {
        if (props.screen === 'Active') {
          await deactivatePost(props.id);
        } else if (props.screen === 'Admin') {
          await approvePost(props.id)
        } else if (props.screen === 'NotActive') {
          await activatePost(props.id);
        } else if (props.screen === 'Deleted') {
          await deletePost(props.id);
        } else if (props.screen === 'Payed') {
          await payPost(props.id);
        }
        setDisappear(true);
      } catch (error) {
        console.error('Error handling post action:', error);
      }
    };
    const handleNotApprove = async () => {
      await deactivatePost(props.id);
      setDisappear(true);
    };

    const handleDelete = async () => { 
      await deletePost(props.id);
      setDisappear(true);
    };
  
    const shadowStyle = {
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 2.84,
        },
        android: {
          elevation: 4,
        },
      }),
    };
  
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: fadeAnim }],
          display: display ? 'none' : 'flex',
        }}
        key={props.id}
      >
        <View key={props.id}>
            <View style={{flexDirection:'row',borderWidth:1,borderColor:'#F26F1D',borderRadius:5,position:'relative',alignItems:'center'}}>
                {props.media[0].type === 'video' ? 
                      <Video
                      isMuted={true}
                      ref={video}
                      style={{width:120,height:120,borderTopLeftRadius:5,borderTopRightRadius:5,marginRight:10}}
                      source={{
                          uri: `http://185.129.51.171${props.media[0].image}`,
                      }}
                      resizeMode={ResizeMode.COVER}
                      isLooping
                      />
                  :
                    <Image style={{width:120,height:120,borderTopLeftRadius:5,borderTopRightRadius:5,marginRight:10}} source={{uri:`http://185.129.51.171${props.media[0].image}`}}/>
                  }
                  <TouchableOpacity style={{position:'absolute',top:10,right:15}} onPress={handleDelete}><Image source={require('../assets/trash.png')} style={{height:24,width:19}} /></TouchableOpacity>
                  <View style={{paddingHorizontal:7}}>
                      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <View style={{width:190}}>
                          <Text style={{marginTop:5,fontSize:14,minHeight:20,fontFamily:'bold',width:'90%'}}>{props.title}</Text>
                          <Text style={{fontFamily:'medium',fontSize:12,marginTop:5,}}>{props.cost}</Text>
                        </View>
                      </View>
                      <View style={{flexDirection:'row',marginTop:4}}>
                        <View style={{borderRadius:2,overflow:'hidden',marginRight:2}}>
                          <Text style={{fontFamily:'bold-italic',backgroundColor:'#675BFB',fontSize:9.5,color:'#fff',paddingHorizontal:3}}>{props.condition}</Text>
                        </View>
                        {props.mortage ?
                        <View style={{borderRadius:2,overflow:'hidden',marginRight:4}}>
                          <Text style={{fontFamily:'bold-italic',backgroundColor:'#675BFB',fontSize:9.5,color:'#fff',paddingHorizontal:3}}>в рассрочку</Text>
                        </View> : null}
                        {props.delivery ?
                        <View style={{borderRadius:2,overflow:'hidden'}}>
                          <Text style={{fontFamily:'bold-italic',backgroundColor:'#675BFB',fontSize:9.5,color:'#fff',paddingHorizontal:5}}>доставка</Text>
                        </View> : null}
                      </View>
                      <Text style={{fontFamily:'regular',fontSize:10,color:'#96949D',marginTop:5}}>Астана</Text>
                      <Text style={{fontFamily:'regular',fontSize:10,color:'#96949D',marginTop:5}}>Сегодня, 15:24</Text>
                    </View>
                </View>
                <View style={{marginTop:20}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <TouchableOpacity onPress={props.screen !== 'Payed' ? handleOnPress : null} style={{paddingVertical:15,width:170,borderRadius:5,alignItems:'center',borderColor:'#F26F1D',marginBottom:20,borderWidth:1}}>
                      <Text style={{color:'#F26F1D',fontSize:16,}}>{buttonText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={props.screen == 'Admin' ? handleNotApprove : null} style={{paddingVertical:15,width:170,borderRadius:5,alignItems:'center',borderColor:'#F26F1D',marginBottom:20,borderWidth:1}}>
                      <Text style={{color:'#F26F1D',fontSize:16,}}>{props.screen == 'Admin' ? 'Отклонить' : 'Редактировать'}</Text>
                    </TouchableOpacity>
                  </View>
                  {props.screen !== 'Admin' ?
                  <TouchableOpacity onPress={props.screen === 'Payed' ? handleOnPress : null} style={{ borderRadius: 5, overflow: 'hidden', marginBottom: 20 }}>
                    <LinearGradient
                      colors={['#F3B127', '#F26D1D']}
                      style={{ paddingVertical: 15, width: '100%', alignItems: 'center' }}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                    >
                      <Text style={{ color: '#F9F6FF', fontSize: 16 }}>{props.screen == "Payed" ? "Оплатить" : "Рекламировать"}</Text>
                    </LinearGradient>
                  </TouchableOpacity> : null}
                </View>
              </View>
    </Animated.View>
  );
};

  