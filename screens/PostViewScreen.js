import React, { useState, useRef,useLayoutEffect, useEffect,useCallback } from 'react';
import MapView, { Marker,PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet,  TouchableOpacity, Share, ScrollView, RefreshControl, Dimensions, Text, TextInput, ActivityIndicator,Linking, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useGetPostByIdQuery } from '../api';
import { ProductCardInfo } from '../components/ProductCardInfo';
import { useGetPostListQuery } from '../api';
import { SliderComponent } from '../components/SliderComponent';
import { useSelector } from 'react-redux';
import { Social } from '../components/Social';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useAddToFavouritesMutation, useRemoveFromFavouritesMutation,useListFavouritesQuery } from '../api';

export const PostViewScreen = ({route}) => {
    const user = useSelector(state => state.auth);
    const navigation = useNavigation()
    const [message, onChangeMessage] = React.useState('');
    const {id} = route.params
    const { data, error, isLoading,refetch } = useGetPostByIdQuery(id);
    const page = 1
    const limit = 5
    const { data: dataPost } = useGetPostListQuery({ page, limit });
    const windowWidth = Dimensions.get('window').width;
    const scrollViewRef = useRef(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [addToFavourites, { isLoading: isAdding }] = useAddToFavouritesMutation();
    const [removeFromFavourites, { isLoading: isRemoving }] = useRemoveFromFavouritesMutation();
    const { data: userFavourites, isLoading: isLoadingFavourites } = useListFavouritesQuery();

    useEffect(() => {
      if (userFavourites && !isLoadingFavourites) {
        const isFav = userFavourites.some(fav => fav.id === id);
        setIsFavourite(isFav);
      }
    }, [userFavourites, isLoadingFavourites, id]);

    const toggleFavourite = async () => {
      if (isFavourite) {
        await removeFromFavourites(id);
        setIsFavourite(false);
      } else {
        await addToFavourites(id);
        setIsFavourite(true);
      }
    };


    useEffect(() => {
      if (userFavourites && !isLoadingFavourites) {
          const isFav = userFavourites.some(fav => fav.id === id);
          setIsFavourite(isFav);
      }
  }, [userFavourites, isLoadingFavourites, id]);

  const makeCall = (number) => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }

    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Телефонный номер не доступен');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.warn(err));
  };

  fetchData = async () => {
    try {
      onChangeMessage('')
      const response = await fetch('http://185.129.51.171/api/create_connection/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`
        },
        body: JSON.stringify({
          message: message,
          user_receiver: data.author.username,
          post_id: data.id
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(response.data);    
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }



  const onShare = useCallback(async () => {
      if (!data) {
          Alert.alert("Error", "Data is still loading. Please wait.");
          return;
      }

      const message = `Смотри что я нашел в приложении Beine Jarnama!
      Название: ${data.title}
      Описание: ${data.content}
      Цена: ${data.cost}
      Город: ${data.geolocation}
      https://apps.apple.com/kg/app/beine-jarnama/id1665878596`;

      try {
          const result = await Share.share({
              message,
              title: data.title,
          });
          console.log('Content shared successfully');
      } catch (error) {
          console.error("Failed to share:", error.message);
      }
  }, [data]);

  useLayoutEffect(() => {
      navigation.setOptions({
          headerRight: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon side={'right'} source={require('../assets/share.png')} onPress={onShare}/>
                  <HeaderIcon side={'right'} source={isFavourite ? require('../assets/starOrange.png') : require('../assets/star.png')} onPress={() => toggleFavourite(data.id, isFavourite)}/>
              </View>
          ),
      });
  }, [navigation, onShare, isFavourite]);
    
    return (
      <ScrollView horizontal={false} style={{marginTop:0}} ref={scrollViewRef}>
      <View style={{alignSelf:'center'}}>      
      <ScrollView horizontal={false} style={{width:windowWidth,paddingBottom:150,marginTop:0}}>
        {!data ? <ActivityIndicator style={{marginTop:100}} size={'large'} /> : 
            <View>
                <SliderComponent data={data?.images} />
                {data && (
                    <View style={{width:'90%',alignSelf:'center',marginTop:10}}>
                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center',marginTop:25,paddingBottom:20,borderBottomWidth:1,borderBottomColor:'#ddd'}}>
                          <View style={{maxWidth:'70%'}}>
                            <Text style={{fontSize:20,fontFamily:'bold'}}>{data.title}</Text>
                            {data.categories?.name && <Text style={{fontSize:15, fontFamily:'regular', opacity:.6, marginTop:10}}>{data.categories.name}</Text>}
                          </View>
                          <Text style={{fontFamily:'bold',fontSize:22,color:'#F26F1D'}}>{data.cost}</Text>
                        </View>
                        <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                          {data.phone && (
                            <TouchableOpacity onPress={() => makeCall(data.phone)}>
                              <Text style={{fontFamily: 'medium', fontSize: 18, marginTop: 15}}>
                                {data.phone}
                              </Text>
                            </TouchableOpacity>
                          )}
                          <View style={{flexDirection:'row',marginTop: 17,alignItems:'center'}}>
                            <Text style={{color:'#333',fontFamily:'medium',fontSize:15}}>{data.views}</Text>
                            <MaterialCommunityIcons 
                                  name={'eye'} 
                                  size={22} 
                                  color="#CFCFCF"
                                  style={{marginLeft: 10, }} 
                              /> 
                          </View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:15}}>
                          <View style={{flexDirection:'row',marginTop:4}}>
                            {data.condition !== 'null' ?
                            <View style={{borderRadius:5,overflow:'hidden',marginRight:6}}>
                                <Text style={{fontFamily:'medium',backgroundColor:'#675BFB',fontSize:15,color:'#fff',paddingHorizontal:12,paddingVertical:5}}>{data.condition}</Text>
                            </View> : null }
                            {data.mortage == 'true' ?
                            <View style={{borderRadius:5,overflow:'hidden',marginRight:6}}>
                                <Text style={{fontFamily:'medium',backgroundColor:'#675BFB',fontSize:15,color:'#fff',paddingHorizontal:12,paddingVertical:5}}>в рассрочку</Text>
                            </View> : null}
                            {data.delivery == 'true' ?
                            <View style={{borderRadius:5,overflow:'hidden'}}>
                                <Text style={{fontFamily:'medium',backgroundColor:'#675BFB',fontSize:15,color:'#fff',paddingHorizontal:12,paddingVertical:5}}>доставка</Text>
                            </View> : null}
                          </View>
                        </View>
                        <TouchableOpacity onPress={()=>{navigation.navigate('ViewUser',{username:data.author.username})}} style={{flexDirection:'row',alignItems:'center',marginTop:20}}>
                            <Image style={{width:50,height:50,borderRadius:100,marginRight:10}} source={{uri:`http://185.129.51.171${data.author.profile_image}`}}/>
                            <Text style={{fontSize:18,fontFamily:'bold'}}>{data.author.username}</Text>
                        </TouchableOpacity>
                        <View>
                          <Text style={{fontSize:14,fontFamily:'regular',marginTop:20,opacity:.7}}>{data.geolocation}</Text>
                          {data.adress ?
                          <Text style={{fontSize: 16, fontFamily: 'medium',marginTop:5}}>
                            {data.adress.split(',')[0]}
                          </Text> : null}
                        </View>
                        {
                          (data.telegram || data.site || data.insta || data.facebook || data.phone_whatsapp || data.twogis) &&
                            <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
                              {data.telegram && <Social url={data.telegram} image={require('../assets/telegram.png')}/>}
                              {data.site && <Social url={data.site} image={require('../assets/site.png')}/>}
                              {data.insta && <Social url={data.insta} image={require('../assets/insta.png')}/>}
                              {data.facebook && <Social url={data.facebook} image={require('../assets/facebook.png')}/>}
                              {data.phone_whatsapp && <Social url={data.phone_whatsapp} whatsapp={true} image={require('../assets/whatsapp.png')}/>}
                              {data.twogis && <Social url={data.twogis} image={require('../assets/2gis.png')}/>}
                            </View>
                        }
                        <Text style={{fontSize:16,fontFamily:'bold', marginTop:30}}>Описание</Text>
                        <Text style={{fontSize:16,fontFamily:'regular', marginTop:10}}>{data.content}</Text>
                        {data.author.username !== user.user.username ?
                          <View>
                            <Text style={{fontSize:16,fontFamily:'bold', marginTop:10}}>Написать продавцу</Text>
                            <View>
                                <TextInput
                                    style={{width:'100%',paddingHorizontal:10,paddingTop:15,marginTop:10,height:80,borderWidth:1,borderRadius:5,borderColor:'#675BFB',fontFamily:'regular',fontSize:13,}}
                                    onChangeText={onChangeMessage}
                                    numberOfLines={3}
                                    multiline={true}
                                    value={message}
                                    placeholder='Здравствуйте! Меня интересует ваше объявление.Товар точно новый? Можно договориться встретиться и проверить на месте целостность товара ?'
                                />
                                <TouchableOpacity onPress={fetchData}><Image source={require('../assets/send.png')} style={{height:24,width:24,position:'absolute',bottom:10,right:10}}/></TouchableOpacity>
                            </View>
                          </View> : 
                          null
                        }
                        {data.fields.length > 1 ? (
                          <View style={{marginBottom: 30}}>
                            <Text style={{fontSize: 16, fontFamily: 'bold', marginTop: 30}}>Характеристики</Text>
                            {data.fields.map((field, index) => (
                              field.field_value ? 
                              <View key={index} style={{flexDirection: 'row', marginTop: 20}}>
                                <Text style={{width: '50%', color: '#9C9C9C'}}>{field.field_name}</Text>
                                <Text style={{width: '50%', color: '#17181D', fontFamily: 'bold'}}>{field.field_value}</Text>
                              </View>
                              : null
                            ))}
                          </View>
                        ): null}

                        {data.lat && data.lng && (
                          <MapView
                            provider={PROVIDER_GOOGLE} 
                            // customMapStyle={mapStyle}
                            apiKey={"AIzaSyBsasFM_cSM1v5WD3TjMt9ioLgzijOgxxY"}
                            style={{ width: '100%', height: 300,marginTop:20,borderRadius:10, borderWidth:1,borderColor:'#675BFB' }}
                            initialRegion={{
                              latitude: data.lat,
                              longitude: data.lng,
                              latitudeDelta: 0.0922,
                              longitudeDelta: 0.0421,
                            }}
                          >
                            <Marker
                              coordinate={{ latitude: data.lat, longitude: data.lng }}
                              title={"Location"}
                              description={data.title}
                            />
                          </MapView>
                        )}

                        <Text style={{fontSize:16,fontFamily:'bold', marginTop:20}}>Похожие объявления</Text>
                        <ScrollView horizontal={true} contentContainerStyle={{ paddingBottom: 20, marginBottom: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            {dataPost?.results?.map((item) => (
                                <ProductCardInfo
                                    viewPost={1}
                                    id={item.id}
                                    title={item.title}
                                    key={item.id}
                                    image={item.images[0].image}
                                    cost={item.cost}
                                    media={item.images}
                                    condition={item.condition}
                                    mortage={item.mortage}
                                    delivery={item.delivery}
                                    city={item.geolocation}
                                    date={item.date}
                                />
                            ))}
                        </ScrollView>
                    <Image style={{width:150,height:120,alignSelf:'center'}} source={require('../assets/profileLogo.png')}/>
                    </View>
                )}
            </View>
        }
            </ScrollView>
        </View>
        </ScrollView>
    );
  }

  function HeaderIcon(props) {
    return (
    <TouchableOpacity onPress={props.onPress}>
        <Image source={props.source}
        style={props.side !== "right" ? styles.Icon : styles.rightIcon}/>
    </TouchableOpacity>
    )
}

  const styles = StyleSheet.create({
    Icon: {
        marginLeft: 13,
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    rightIcon: {
        marginLeft: 30,
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    HeaderRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    HeaderTitle: {
        fontFamily: 'bold',
        fontSize: 18
    },
});
