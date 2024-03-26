import React, { useState, useRef, useMemo, useEffect } from 'react';
import MapView, { Marker,PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet,  TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView, RefreshControl, Dimensions, Text, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { useGetPostByIdQuery } from '../api';
import { ProductCardInfo } from '../components/ProductCardInfo';
import { useGetPostListQuery } from '../api';
import { SliderComponent } from '../components/SliderComponent';
import { useSelector } from 'react-redux';
import { Social } from '../components/Social';

export const PostViewScreen = ({route}) => {
    const user = useSelector(state => state.auth);
    const { width } = Dimensions.get('window');
    const [message, onChangeMessage] = React.useState('');
    const {id} = route.params
    const { data, error, isLoading,refetch } = useGetPostByIdQuery(id);
    const page = 1
    const limit = 5
    const { data: dataPost } = useGetPostListQuery({ page, limit });
    const windowWidth = Dimensions.get('window').width;
    const video = useRef(null);


    fetchData = async () => {
      try {
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
    
    
    useEffect(() => {
      video.current?.playAsync();
      console.log(data);
    },[video])

    return (
      <ScrollView horizontal={false} style={{marginTop:0}}>
 <View style={{alignSelf:'center'}}>      
    <ScrollView horizontal={false} style={{width:windowWidth,paddingBottom:150,marginTop:0}}>
        {!data ? <Text>Loading</Text> : 
            <View>
                <SliderComponent data={data?.images} />
                {data && (
                    <View style={{width:'90%',alignSelf:'center',marginTop:10}}>
                        <Text style={{fontSize:24,fontFamily:'bold',marginBottom:10}}>{data.cost}</Text>
                        <Text style={{fontSize:18,fontFamily:'bold'}}>{data.title}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:20}}>
                            <Image style={{width:50,height:50,borderRadius:100,marginRight:10}} source={{uri:`http://185.129.51.171${data.author.profile_image}`}}/>
                            <Text style={{fontSize:18,fontFamily:'bold'}}>{data.author.username}</Text>
                        </View>
                        <View>
                          <Text style={{fontSize:14,fontFamily:'regular',marginTop:20,opacity:.7}}>{data.geolocation}</Text>
                          {data.adress ?
                          <Text style={{fontSize: 16, fontFamily: 'medium', marginBottom:20,marginTop:5}}>
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
                              {data.phone_whatsapp && <Social url={`https://wa.me/${data.phone_whatsapp}`} whatsapp={true} image={require('../assets/whatsapp.png')}/>}
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
