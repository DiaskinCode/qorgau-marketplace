import React, { useRef,useState,useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity,ActivityIndicator } from 'react-native';
import InsetShadow from "react-native-inset-shadow";
import { useNavigation } from '@react-navigation/native';
import { Video, InterruptionModeAndroid, InterruptionModeIOS, ResizeMode } from 'expo-av';
import { Image } from 'expo-image';
import { useAddToFavouritesMutation, useRemoveFromFavouritesMutation,useListFavouritesQuery } from '../api';

export const ProductCard = (props) => {
  const navigation = useNavigation()
  const { data: userFavourites, isLoading: isLoadingFavourites } = useListFavouritesQuery();
  const video = useRef(null);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [isFavourite, setIsFavourite] = useState(false);
  const [addToFavourites, { isLoading: isAdding }] = useAddToFavouritesMutation();
  const [removeFromFavourites, { isLoading: isRemoving }] = useRemoveFromFavouritesMutation();

  useEffect(() => {
    if (userFavourites && !isLoadingFavourites) {
      const isFav = userFavourites.some(fav => fav.id === props.id);
      setIsFavourite(isFav);
    }
  }, [userFavourites, isLoadingFavourites, props.id]);

  const toggleFavourite = async () => {
    if (isFavourite) {
      await removeFromFavourites(props.id);
      setIsFavourite(false);
    } else {
      await addToFavourites(props.id);
      setIsFavourite(true);
    }
  };

  useEffect(() => {
    if (props.isVisible) {
      video.current?.playAsync();
    } else {
      video.current?.pauseAsync();
    }
  }, [props.isVisible]);


  const [isImageLoading, setImageLoading] = useState(true);


    return (
        <TouchableOpacity onPress={()=>{navigation.navigate('ViewPost',{id:props.id})}} style={{width:windowWidth * .45,height:320,marginHorizontal: 5,borderRadius:7,marginBottom:15,borderWidth: props.tariff === 2 ? 2 : 0, 
            borderColor: props.tariff === 2 ? '#F26F1D' : 'transparent' }}>
          <View>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',bottom:10,zIndex:2,left:10,position:'absolute'}}>
              <View style={{flexDirection:'row',marginTop:4}}>
                {props.condition !== 'null' ?
                <View style={{borderRadius:5,overflow:'hidden',marginRight:3}}>
                    <Text style={{fontFamily:'bold',backgroundColor:'#675BFB',fontSize:11,color:'#fff',paddingHorizontal:5,paddingVertical:3}}>{props.condition}</Text>
                </View> : null }
                {props.mortage ?
                <View style={{borderRadius:5,overflow:'hidden',marginRight:3}}>
                    <Text style={{fontFamily:'bold',backgroundColor:'#675BFB',fontSize:11,color:'#fff',paddingHorizontal:5,paddingVertical:3}}>0-0-12</Text>
                </View> : null}
                {props.delivery ?
                <View style={{borderRadius:5,overflow:'hidden'}}>
                    <Text style={{fontFamily:'bold',backgroundColor:'#675BFB',fontSize:11,color:'#fff',paddingHorizontal:5,paddingVertical:3}}>доставка</Text>
                </View> : null}
              </View>
            </View>
            {props.media[0].type === 'video' ? 
              <View style={{position:'relative'}}>
                {props.tariff === 1 && (
                  <View style={{backgroundColor:'#F26F1D',paddingHorizontal:10,paddingVertical:5,borderRadius:5,position:'absolute',top:10,left:10,zIndex:2,}}>
                    <Text style={{fontFamily: 'bold', fontSize: 12, color: '#fff'}}>ТОП</Text>
                  </View>  
                )}
                <TouchableOpacity style={{backgroundColor:'rgba(255,255,255,0.6)',padding:5,borderRadius:5,position:'absolute',top:5,right:5,zIndex:2}} onPress={toggleFavourite}>
                  <Image
                    source={isFavourite ? require('../assets/starOrange.png') : require('../assets/star.png')}
                    style={{ height: 23, width: 23 }}
                  />
                </TouchableOpacity>
                <Video
                ref={video}
                playsInSilentModeIOS={false}
                allowsRecordingIOS={false}
                interruptionModeIOS={InterruptionModeIOS.DoNotMix}
                interruptionModeAndroid= {InterruptionModeAndroid.DoNotMix}
                shouldDuckAndroid= {true}
                staysActiveInBackground= {false}
                style={{ width: '100%', height: 200,borderRadius:10 }}
                source={{
                    uri: `http://185.129.51.171${props.media[0].image}`,
                }}
                volume={0.0}
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={true}
                />
              </View>
            :
            <View style={{position:'relative'}}>
                {props.tariff === 1 && (
                  <View style={{backgroundColor:'#F26F1D',paddingHorizontal:10,paddingVertical:5,borderRadius:5,position:'absolute',top:10,left:10,zIndex:2,}}>
                    <Text style={{fontFamily: 'bold', fontSize: 12, color: '#fff'}}>ТОП</Text>
                  </View>  
                )}
                <TouchableOpacity style={{backgroundColor:'rgba(255,255,255,0.6)',padding:5,borderRadius:5,position:'absolute',top:5,right:5,zIndex:2}} onPress={toggleFavourite}>
                  <Image
                    source={isFavourite ? require('../assets/starOrange.png') : require('../assets/star.png')}
                    style={{ height: 23, width: 23 }}
                  />
                </TouchableOpacity>
                {isImageLoading && <ActivityIndicator style={{ position: 'absolute', width: '100%', height: 200 }} />}
                <Image
                    style={{width:'100%', height:200, borderRadius:10}}
                    source={{uri: `http://185.129.51.171${props.image}`}}
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                />
            </View>
            }
          </View>

          <View style={{paddingHorizontal:7}}>
            <Text numberOfLines={2} ellipsizeMode="tail" style={{opacity:.8,fontSize:15,minHeight:20,marginTop:10,fontFamily:'medium',maxWidth:'100%'}}>{props.title}</Text>
            <Text style={{fontFamily:'bold',marginTop:5,fontSize:15,color:'#F26F1D'}}>{props.cost}</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
              <Text style={{fontFamily:'regular',fontSize:12,color:'#96949D',marginTop:5}}>{props.city}</Text>
              <Text style={{fontFamily:'regular',fontSize:12,color:'#96949D',marginTop:5}}>{props.date}</Text>
            </View>
          </View>
        </TouchableOpacity>
    );
  }
  