import React, { Component,useEffect,useState } from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainStackNavigator from './MainStackNavigator'
import ReelsStackNavigator from './ReelsStackNavigator'
import MessagesStackNavigator from './MessagesStackNavigator'
import ProfileStackNavigator from './ProfileStackNavigator'
import CreatePostStackNavigation from './CreatePostStackNavigation'
import {useTranslation} from 'react-i18next'

const Tab = createBottomTabNavigator();

export default function BottomTabNavigation () {
    const {t} = useTranslation();
    const screenWidth = Dimensions.get('window').width;
    const isTablet = screenWidth >= 768;
    return (
        <View style={styles.container}>
            <Tab.Navigator
                initialRouteName={t("tabs.home")}
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarLabel: ({ color }) => {
                        if (isTablet) {
                          return null;
                        } else {
                          return <Text style={{ fontSize: 10, fontFamily: 'regular', color: '#9C9C9C' }}>{route.name}</Text>;
                        }
                      },
                    tabBarStyle: {
                        backgroundColor: '#FFF',
                        borderTopWidth: 0,
                        position: 'absolute',
                        borderTopWidth: 0, 
                        width: '100%',
                        alignSelf: 'center',
                        paddingHorizontal:'5%',
                        borderTopLeftRadius:15,
                        borderTopRightRadius:15,
                        elevation: 0,
                        marginBottom:0,
                        zIndex:2,
                    },
                })}
                >
                <Tab.Screen
                    name={t("tabs.home")}
                    component={MainStackNavigator}
                    options={{tabBarIcon: ({focused}) => focused ? 
                        <TabIcon image={require('../assets/mainIconActive.png')}/> : 
                        <TabIcon image={require('../assets/mainIcon.png')}/>,
                    }}
                />
                <Tab.Screen
                    name={t("tabs.feed")}
                    component={ReelsStackNavigator}
                    options={{tabBarIcon: ({focused}) => focused ? 
                        <TabIcon image={require('../assets/reelsIconActive.png')}/> : 
                        <TabIcon image={require('../assets/reelsIcon.png')}/>,
                    }}
                />
                <Tab.Screen
                    name={t("tabs.create_new")}
                    component={CreatePostStackNavigation}
                    options={{tabBarIcon: () =>  
                        <CreateTabIcon image={require('../assets/createPostIcon.png')}/> 
                    }}
                />
                <Tab.Screen
                    name={t("tabs.messages")}
                    component={MessagesStackNavigator}
                    options={{tabBarIcon: ({focused}) => focused ? 
                        <TabIcon image={require('../assets/messagesIconActive.png')}/> : 
                        <TabIcon image={require('../assets/messagesIcon.png')}/>,
                    }}
                />
                <Tab.Screen
                    name={t("tabs.profile")}
                    component={ProfileStackNavigator}
                    options={{tabBarIcon: ({focused}) => focused ? 
                        <TabIcon image={require('../assets/profileIconActive.png')}/> : 
                        <TabIcon image={require('../assets/profileIcon.png')}/>,
                    }}
                />
            </Tab.Navigator>
        </View>
    )
}
function TabIcon({image}) {
    return (
        <View>
            <Image source={image} style={styles.Icon}/>
        </View>
    );
}

function CreateTabIcon({image}) {
    return (
        <View>
            <Image source={image} style={styles.CreatePostIcon}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:10,
        backgroundColor:'transparent'
      },
      backgroundImage: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 20,
        zIndex: 1,
      },

    Icon: {
        width: 18,
        height: 16,
        resizeMode: 'contain'
    },
    CreatePostIcon: {
        width:60,
        height:60,
        marginTop:-30
    },
    tabBarLabel: {
        fontSize: 10, 
        fontFamily:'regular',
        color: '#9C9C9C',
    },
    tabBarLabelActive: {
        fontSize: 10, 
        fontFamily:'regular',
        color: '#F26F1D',
    },
    
});