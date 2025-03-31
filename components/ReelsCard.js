import React, { useRef,useState,useEffect,useCallback } from 'react';
import { View, Text, Platform, TouchableOpacity,Dimensions, Pressable } from 'react-native';
import InsetShadow from "react-native-inset-shadow";
import { useNavigation } from '@react-navigation/native';
import { Video,ResizeMode } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';

export const ReelsCard = (props) => {
  const navigation = useNavigation()
  const height = Dimensions.get('window').height
  const video = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  
  useEffect(() => {
    console.log(props.isVisible);
    if (props.isVisible) {
      video.current?.playAsync();
      setIsMuted(false);
    } else {
      video.current?.pauseAsync();
      setIsMuted(true);
    }
  }, [props.isVisible]);
  
  const shadowStyle = {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
  
  useFocusEffect(
    useCallback(() => {
      return () => video?.current?.pauseAsync();
    }, [])
  );

    return (
        <Pressable onPress={()=>{navigation.navigate('ViewPost',{id:props.id})}} style={{width:'100%',height:650, backgroundColor:'#ffffff',borderRadius:5,marginBottom:10,borderWidth: props.tariff === 2 ? 2 : 0, 
        borderColor: props.tariff === 2 ? '#F26F1D' : 'transparent',borderRadius:13  }}>
          <InsetShadow
            containerStyle={{...shadowStyle,height:500,borderRadius:10}}
            shadowRadius={2}
            shadowOffset={10}
            elevation={10}
            shadowOpacity={.3}
            color="rgba(128,128,128,1)"
            bottom={false}
          >
            {props.media[0].type === 'video' ? 
              <View style={{position:'relative'}}>
                {props.tariff === 1 && (
                  <View style={{backgroundColor:'#F26F1D',paddingHorizontal:13,paddingVertical:7,borderRadius:5,position:'absolute',top:10,left:15,zIndex:2,}}>
                    <Text style={{fontFamily: 'bold', fontSize: 16, color: '#fff'}}>ТОП</Text>
                  </View>  
                )}
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',bottom:15,zIndex:2,left:15,position:'absolute'}}>
                  <View style={{flexDirection:'row',marginTop:4}}>
                    {props.condition !== 'null' ?
                    <View style={{borderRadius:5,overflow:'hidden',marginRight:6}}>
                        <Text style={{fontFamily:'medium',backgroundColor:'#675BFB',fontSize:15,color:'#fff',paddingHorizontal:12,paddingVertical:5}}>{props.condition}</Text>
                    </View> : null }
                    {props.mortage ?
                    <View style={{borderRadius:5,overflow:'hidden',marginRight:6}}>
                        <Text style={{fontFamily:'medium',backgroundColor:'#675BFB',fontSize:15,color:'#fff',paddingHorizontal:12,paddingVertical:5}}>в рассрочку</Text>
                    </View> : null}
                    {props.delivery ?
                    <View style={{borderRadius:5,overflow:'hidden'}}>
                        <Text style={{fontFamily:'medium',backgroundColor:'#675BFB',fontSize:15,color:'#fff',paddingHorizontal:12,paddingVertical:5}}>доставка</Text>
                    </View> : null}
                  </View>
                </View>
                <Video
                  ref={video}
                  style={{ width: '100%', height: 500 }}
                  source={{
                      uri: `http://185.129.51.171${props.media[0].image}`,
                  }}
                  resizeMode={ResizeMode.COVER}
                  isLooping
                  isMuted={isMuted}
                  playsInSilentModeIOS={true}
                  />
              </View>
            :
            <View style={{position:'relative'}}>
                {props.tariff === 1 && (
                  <View style={{backgroundColor:'#F26F1D',paddingHorizontal:13,paddingVertical:7,borderRadius:5,position:'absolute',top:10,left:15,zIndex:2,}}>
                    <Text style={{fontFamily: 'bold', fontSize: 16, color: '#fff'}}>ТОП</Text>
                  </View>  
                )}
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',bottom:15,zIndex:2,left:15,position:'absolute'}}>
                <View style={{flexDirection:'row',marginTop:4}}>
                  {props.condition !== 'null' ?
                  <View style={{borderRadius:5,overflow:'hidden',marginRight:6}}>
                      <Text style={{fontFamily:'medium',backgroundColor:'#675BFB',fontSize:15,color:'#fff',paddingHorizontal:12,paddingVertical:5}}>{props.condition}</Text>
                  </View> : null }
                  {props.mortage ?
                  <View style={{borderRadius:5,overflow:'hidden',marginRight:6}}>
                      <Text style={{fontFamily:'medium',backgroundColor:'#675BFB',fontSize:15,color:'#fff',paddingHorizontal:12,paddingVertical:5}}>в рассрочку</Text>
                  </View> : null}
                  {props.delivery ?
                  <View style={{borderRadius:5,overflow:'hidden'}}>
                      <Text style={{fontFamily:'medium',backgroundColor:'#675BFB',fontSize:15,color:'#fff',paddingHorizontal:12,paddingVertical:5}}>доставка</Text>
                  </View> : null}
                </View>
              </View>
              <Image style={{width:'100%',height:500,borderTopLeftRadius:5,borderTopRightRadius:5}} source={{uri:`http://185.129.51.171${props.image}`}}/>
            </View>
            }
          </InsetShadow>
          <View style={{paddingHorizontal:7,width:'95%',alignSelf:'center'}}>
            <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center',marginTop:15}}>
              <Text numberOfLines={2} ellipsizeMode="tail" style={{maxWidth:'70%',fontSize:16,fontFamily:'bold'}}>{props.title}</Text>
              <Text style={{fontFamily:'bold',fontSize:20,color:'#F26F1D'}}>{props.cost}</Text>
            </View>
            <Text style={{paddingTop:10,fontSize:12,fontFamily:'medium',opacity:.6}} numberOfLines={2} ellipsizeMode="tail">{props.content}</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:20}}>
                <Text style={{fontFamily:'regular',fontSize:13,color:'#96949D',marginTop:5}}>{props.city}</Text>
                <Text style={{fontFamily:'regular',fontSize:13,color:'#96949D',marginTop:5}}>{props.date}</Text>
            </View>
          </View>
        </Pressable>
    );
  }
  