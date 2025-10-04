import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {FavouriteScreen} from '../screens/FavouriteScreen'

const Main = createNativeStackNavigator();

export default function FavouriteStackNavigator() {
    const {t} = useTranslation()
    return (
        <Main.Navigator>
            <Main.Screen 
                name='Home' 
                component={FavouriteScreen}
                options={({ navigation }) => ({
                    headerShadowVisible:false,
                    title: null,
                    headerLeft: () => (
                        <View style={styles.HeaderRight}>
                            <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                            <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('tabs.feed')}</Text>
                        </View>
                    ),
                    })}/>
        
        </Main.Navigator>
    )
}
function HeaderIcon(props) {
    return (
    <TouchableOpacity onPress={props.onPress}>
        <Image source={props.source}
        style={styles.Icon}/>
    </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    Icon: {
        width: 16,
        height: 32,
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