// import React, { useRef, useCallback, useMemo, useEffect } from 'react';
// import { View, StyleSheet, TextInput,  TouchableOpacity, FlatList, ScrollView, Image, Text } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// export const MessagesDmScreen = () => {
    //     const { data, error, isLoading,refetch } = useGetPostByIdQuery(18);
    //     const video = useRef(null);
    //     const navigation = useNavigation()
    
    
    //     useEffect(()=>{
        //         refetch()
        //         video.current?.playAsync();
        //     },[data])
        
        //     return (
            //             <View style={{marginTop:20,width:'90%',alignSelf:'center'}}>
            //             {data ? 
            //                 <View style={{marginBottom:10}}>
            //                 <View style={{flexDirection:'row',borderWidth:1,borderColor:'#F26F1D',borderRadius:5,position:'relative',alignItems:'center'}}>
            //                 {data.images[0].type === 'video' ? 
            //                         <Video
            //                         ref={video}
            //                         style={{width:120,height:120,borderTopLeftRadius:5,borderTopRightRadius:5,marginRight:10}}
            //                         source={{
                //                             uri: `${data.images[0].image}`,
                //                         }}
                //                         resizeMode={ResizeMode.COVER}
                //                         isLooping
                //                         />
                //                     :
                //                         <Image style={{width:120,height:120,borderTopLeftRadius:5,borderTopRightRadius:5,marginRight:10}} source={{uri:`${data.images[0].image}`}}/>
                //                     }
                //                 <View style={{paddingHorizontal:7}}>
                //                     <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                //                         <View style={{width:190}}>
                //                         <Text style={{marginTop:5,fontSize:14,minHeight:20,fontFamily:'bold'}}>{data.title}</Text>
                //                         <Text style={{fontFamily:'medium',fontSize:12,marginTop:5,}}>{data.cost}</Text>
                //                         </View>
                //                     </View>
                //                     <View style={{flexDirection:'row',marginTop:4}}>
                //                             <View style={{borderRadius:2,overflow:'hidden',marginRight:2}}>
                //                             <Text style={{fontFamily:'bold-italic',backgroundColor:'#675BFB',fontSize:9.5,color:'#fff',paddingHorizontal:3}}>{data.condition}</Text>
                //                             </View>
                //                             {data.mortage ?
                //                             <View style={{borderRadius:2,overflow:'hidden',marginRight:4}}>
                //                             <Text style={{fontFamily:'bold-italic',backgroundColor:'#675BFB',fontSize:9.5,color:'#fff',paddingHorizontal:3}}>в рассрочку</Text>
                //                             </View> : null}
                //                             {data.delivery ?
                //                             <View style={{borderRadius:2,overflow:'hidden'}}>
                //                             <Text style={{fontFamily:'bold-italic',backgroundColor:'#675BFB',fontSize:9.5,color:'#fff',paddingHorizontal:5}}>доставка</Text>
                //                             </View> : null}
                //                         </View>
                //                     <Text style={{fontFamily:'regular',fontSize:10,color:'#96949D',marginTop:5}}>{data.geolocation}</Text>
                //                     <Text style={{fontFamily:'regular',fontSize:10,color:'#96949D',marginTop:5}}>{data.date}</Text>
                //                     </View>
                //                 </View>
                //             </View> : <Text>No</Text> }
                //             <View style={{backgroundColor:'#F9F6FF',borderWidth:1,borderRadius:5,borderColor:'#675BFB',width:'100%',height:55,paddingHorizontal:15,alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:10,}}>
                //                 <View style={{flexDirection:'row',alignItems:'center'}}>
                //                     <Image style={{height:36,width:36}} source={require('../assets/profilePurple.png')}/>
                //                     <View style={{marginLeft:10}}>
                //                         <Text style={{fontFamily:'bold',fontSize:13}}>username</Text>
                //                     </View>
                //                 </View>
                //                 <View style={{flexDirection:'row'}}>
                //                     <Image source={require('../assets/flag.png')} style={{height:24,width:20,marginRight:15}} />
                //                     <Image source={require('../assets/x.png')} style={{height:24,width:24}} />
                //                 </View>
                //             </View>
                
                
                //             <ScrollView horizontal={false} showsVerticalScrollIndicator={false} style={{marginTop:20,height:450}}>
                //                 <View style={{backgroundColor:'#F9F6FF',borderRadius:14,borderBottomLeftRadius:0,width:230,paddingBottom:20,marginTop:20}}>
                //                     <Text style={{fontFamily:'regular',fontSize:12,marginTop:10,marginLeft:10}}>Здравствуйте! Меня интересует ваше объявление</Text>
                //                     <Text style={{fontFamily:'regular',fontSize:6,position:'absolute',right:10,bottom:10}}>Сегодня, 15:24</Text>
                //                 </View>
                //             </ScrollView>
                //         </View>
                //     );
                //   }
                
                
import { useGetPostByIdQuery } from '../api';
import { Video, ResizeMode } from 'expo-av';
import React, { useEffect, useState, useRef } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View,Text, TextInput, TouchableOpacity, Platform, Image } from 'react-native';
import { useSelector } from 'react-redux';
import uuid from 'react-native-uuid';

export const MessagesDmScreen = ({route}) => {
    const { data, error, isLoading,refetch } = useGetPostByIdQuery(17);
    const connection_id = route.params.connection_id
    const user = useSelector(state => state.auth);
    const [messages, setMessages] = useState([]);
    const video = useRef(null);
    const [refresh, setRefresh] = useState('not refreshed');
    const [inputText, setInputText] = useState('');
    const socket = new WebSocket(`ws://185.129.51.171/chat/?token=${user.token}`);

    useEffect(() => {
        refetch()
        video.current?.playAsync();
        socket.addEventListener('open', () => {
            socket.send(
                JSON.stringify({
                    source: 'message.list',
                    connectionId: connection_id,
                })
            );
        });
    }, []);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(user.user.username,data);

        if (data.source === 'message.list' && data.data && data.data.messages) {
            const receivedMessages = data.data.messages.map(msg => ({
                _id: msg._id,
                text: msg.text,
                createdAt: new Date(msg.created),
                user: {
                    _id: msg.user._id,
                    name: msg.user.username,
                    avatar: `http://185.129.51.171/${msg.user.profile_image}`
                }
            }));
    
            setMessages(receivedMessages);

        } else if (data.source === 'message.send' && data.data && data.data.messages) {
            const receivedMessages = data.data.messages.map(msg => ({
                _id: msg._id,
                text: msg.text,
                createdAt: new Date(msg.created),
                user: {
                    _id: msg.user._id,
                    name: msg.user.username,
                    avatar: `http://185.129.51.171/${msg.user.profile_image}`
                }
            }));

            setMessages(receivedMessages);
        } else {
            
        }
    };

    const onSend = (newMessages) => {
        const messageText = newMessages[0].text;
        
        if (messageText.trim() === '') {
                return;
            }
            
        const newMessage = {
            _id: uuid.v4(),
            text: messageText,
            createdAt: new Date(),
            user: {
                _id: user.user.id,
                name: user.user.username,
                avatar: `http://185.129.51.171/${user.user.profile_image}`
            },
        };

        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));

        socket.send(
            JSON.stringify({
                source: 'message.send',
                connectionId: 1,
                user_receiver:user.user.username == 'DiasOralbekov' ? 'Dias' : 'DiasOralbekov', 
                message: messageText,
            })
        );

    };

    const handleSocketDisconnect = () => {
        socket.removeEventListener('message', handleMessage);
        socket.close();
    };
    
    socket.addEventListener('disconnect', handleSocketDisconnect);

    return (
        <View style={{ flex: 1, marginBottom: 100 }}>
            {data ? 
                <View style={{marginTop:20,width:'90%',alignSelf:'center'}}>
                    <View style={{marginBottom:10}}>
                    <View style={{flexDirection:'row',borderWidth:1,borderColor:'#F26F1D',borderRadius:5,position:'relative',alignItems:'center'}}>
                    {data.images[0].type === 'video' ? 
                            <Video
                            isMuted={true}
                            ref={video}
                            style={{width:120,height:120,borderTopLeftRadius:5,borderTopRightRadius:5,marginRight:10}}
                            source={{
                                uri: `${data.images[0].image}`,
                            }}
                            resizeMode={ResizeMode.COVER}
                            isLooping
                            />
                        :
                            <Image style={{width:120,height:120,borderTopLeftRadius:5,borderTopRightRadius:5,marginRight:10}} source={{uri:`${data.images[0].image}`}}/>
                        }
                    <View style={{paddingHorizontal:7}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <View style={{width:190}}>
                            <Text style={{marginTop:5,fontSize:14,minHeight:20,fontFamily:'bold'}}>{data.title}</Text>
                            <Text style={{fontFamily:'medium',fontSize:12,marginTop:5,}}>{data.cost}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',marginTop:4}}>
                                <View style={{borderRadius:2,overflow:'hidden',marginRight:2}}>
                                <Text style={{fontFamily:'bold-italic',backgroundColor:'#675BFB',fontSize:9.5,color:'#fff',paddingHorizontal:3}}>{data.condition}</Text>
                                </View>
                                {data.mortage ?
                                <View style={{borderRadius:2,overflow:'hidden',marginRight:4}}>
                                <Text style={{fontFamily:'bold-italic',backgroundColor:'#675BFB',fontSize:9.5,color:'#fff',paddingHorizontal:3}}>в рассрочку</Text>
                                </View> : null}
                                {data.delivery ?
                                <View style={{borderRadius:2,overflow:'hidden'}}>
                                <Text style={{fontFamily:'bold-italic',backgroundColor:'#675BFB',fontSize:9.5,color:'#fff',paddingHorizontal:5}}>доставка</Text>
                                </View> : null}
                            </View>
                        <Text style={{fontFamily:'regular',fontSize:10,color:'#96949D',marginTop:5}}>{data.geolocation}</Text>
                        <Text style={{fontFamily:'regular',fontSize:10,color:'#96949D',marginTop:5}}>{data.date}</Text>
                        </View>
                    </View>
                </View>
            </View> : null }
            <GiftedChat
                messages={messages}
                onSend={onSend}
                isAnimated
                user={{
                    _id: user.user.id,
                }}
            />
        </View>
    );
};

