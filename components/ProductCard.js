import React, { useRef,useState,useEffect } from 'react';
import { View, Text, Platform, TouchableOpacity,ActivityIndicator } from 'react-native';
import InsetShadow from "react-native-inset-shadow";
import { useNavigation } from '@react-navigation/native';
import { Video,ResizeMode } from 'expo-av';
import {
  InView,
} from 'react-native-intersection-observer';
import { Image } from 'expo-image';
import { useAddToFavouritesMutation, useRemoveFromFavouritesMutation,useListFavouritesQuery } from '../api';

export const ProductCard = (props) => {
  const navigation = useNavigation()
  const { data: userFavourites, isLoading: isLoadingFavourites } = useListFavouritesQuery();
  const video = useRef(null);
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

  const [isImageLoading, setImageLoading] = useState(true);

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

    return (
      <InView onChange={(inView) => {
          if (inView) {
              video.current?.playAsync();
              console.log('played',props.title);
          } else {
              video.current?.pauseAsync();
              console.log('paused',props.title);
          }
      }}>
        <TouchableOpacity onPress={()=>{navigation.navigate('ViewPost',{id:props.id})}} style={{...shadowStyle, width:170,height:276,marginHorizontal: 5, backgroundColor:'#ffffff',borderRadius:5,marginBottom:15}}>
          <InsetShadow
            containerStyle={{height:170,borderTopLeftRadius:5,borderTopRightRadius:5}}
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
                style={{ width: 170, height: 200 }}
                source={{
                    uri: `http://185.129.51.171${props.media[0].image}`,
                }}
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={true}
                />
            :
            <>
                {isImageLoading && <ActivityIndicator style={{ position: 'absolute', width: 170, height: 170 }} />}
                <Image
                    style={{width:'100%', height:170, borderTopLeftRadius:5, borderTopRightRadius:5}}
                    source={{uri: `http://185.129.51.171${props.image}`}}
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                />
            </>
            }
          </InsetShadow>
          <View style={{paddingHorizontal:7}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{width:'80%'}}>
                <Text style={{marginTop:5,fontSize:10,lineHeight:12,minHeight:20,fontFamily:'regular'}}>{props.title}</Text>
                <Text style={{fontFamily:'bold',fontSize:12,marginTop:5,}}>{props.cost}</Text>
              </View>
              <TouchableOpacity onPress={toggleFavourite}>
                <Image
                  source={isFavourite ? require('../assets/starOrange.png') : require('../assets/star.png')}
                  style={{ height: 23, width: 23 }}
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',marginTop:4}}>
              {props.condition !== 'null' ?
              <View style={{borderRadius:2,overflow:'hidden',marginRight:2}}>
                <Text style={{fontFamily:'bold-italic',backgroundColor:'#675BFB',fontSize:9.5,color:'#fff',paddingHorizontal:3}}>{props.condition}</Text>
              </View> : null}
              {props.mortage ?
              <View style={{borderRadius:2,overflow:'hidden',marginRight:4}}>
                <Text style={{fontFamily:'bold-italic',backgroundColor:'#675BFB',fontSize:9.5,color:'#fff',paddingHorizontal:3}}>в рассрочку</Text>
              </View> : null}
              {props.delivery ?
              <View style={{borderRadius:2,overflow:'hidden'}}>
                <Text style={{fontFamily:'bold-italic',backgroundColor:'#675BFB',fontSize:9.5,color:'#fff',paddingHorizontal:5}}>доставка</Text>
              </View> : null}
            </View>
            <Text style={{fontFamily:'regular',fontSize:10,color:'#96949D',marginTop:5}}>{props.city}</Text>
            <Text style={{fontFamily:'regular',fontSize:10,color:'#96949D',marginTop:5}}>{props.date}</Text>
          </View>
        </TouchableOpacity>
      </InView>
    );
  }
  