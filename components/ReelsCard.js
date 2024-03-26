import React, { useRef,useState,useEffect,useCallback } from 'react';
import { View, Text, Platform, TouchableOpacity,Dimensions, Pressable } from 'react-native';
import InsetShadow from "react-native-inset-shadow";
import { useNavigation } from '@react-navigation/native';
import { Video,ResizeMode } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';

export const ReelsCard = (props) => {
  const navigation = useNavigation()
  const { width } = Dimensions.get('window');
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
        <Pressable onPress={()=>{navigation.navigate('ViewPost',{id:props.id})}} style={{...shadowStyle, width:'100%',height:620, backgroundColor:'#ffffff',borderRadius:5,marginBottom:10}}>
          <InsetShadow
            containerStyle={{height:470,borderTopLeftRadius:5,borderTopRightRadius:5}}
            shadowRadius={2}
            shadowOffset={10}
            elevation={10}
            shadowOpacity={.3}
            color="rgba(128,128,128,1)"
            bottom={false}
          >
            {props.media[0].type === 'video' ? 
                <Video
                ref={video}
                style={{ width: '100%', height: 470 }}
                source={{
                    uri: `http://185.129.51.171${props.media[0].image}`,
                }}
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={isMuted}
                />
            :
              <Image style={{width:'100%',height:470,borderTopLeftRadius:5,borderTopRightRadius:5}} source={{uri:`http://185.129.51.171${props.image}`}}/>
            }
          </InsetShadow>
          <View style={{paddingHorizontal:7}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{width:'100%'}}>
                <Text style={{marginTop:15,fontSize:13,lineHeight:12,minHeight:20,fontFamily:'bold'}}>{props.title}</Text>
                <Text style={{paddingTop:5,fontSize:12,lineHeight:12,minHeight:20,fontFamily:'medium'}} numberOfLines={4} ellipsizeMode="tail">{props.content}</Text>
              </View>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:5}}>
                <Text style={{fontFamily:'bold',fontSize:12,marginTop:5,}}>{props.cost}</Text>
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
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                <Text style={{fontFamily:'regular',fontSize:10,color:'#96949D',marginTop:5}}>{props.city}</Text>
                <Text style={{fontFamily:'regular',fontSize:10,color:'#96949D',marginTop:5}}>{props.date}</Text>
            </View>
          </View>
        </Pressable>
    );
  }
  