import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {View,StyleSheet,Text,TouchableOpacity,Image} from 'react-native';
import { ProfileMainScreen } from '../screens/ProfileMainScreen';
import { ProfilePolicyScreen } from '../screens/ProfilePolicyScreen';
import { ProfileTermsScreen } from '../screens/ProfileTermsScreen';
import { ProfileAboutScreen } from '../screens/ProfileAboutScreen';
import { ProfileTariffsScreen } from '../screens/ProfileTariffsScreen';
import { useTranslation } from 'react-i18next';
import { ProfileActiveScreen } from '../screens/ProfileActiveScreen';
import { ProfileApproveScreen } from '../screens/ProfileApproveScreen';
import { ProfileNotActiveScreen } from '../screens/ProfileNotActiveScreen';
import { ProfileNotPayedScreen } from '../screens/ProfileNotPayedScreen';
import { ProfileDeletedScreen } from '../screens/ProfileDeletedScreen';
import { ProfileadminScreen } from '../screens/ProfileadminScreen';
import { ProfileSettingsScreen } from '../screens/ProfileSettingsScreen';
import { ProfileFavouriteScreen } from '../screens/ProfileFavouriteScreen';
import { EditPostScreen } from '../screens/EditPostScreen';
import {CreatePostTarrifsScreen} from '../screens/CreatePostTarrifsScreen'
import {CreatePostPayScreen} from '../screens/CreatePostPayScreen'

const Stack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
    const { t } = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile"
        component={ProfileMainScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('headers.profile')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="Policy"
        component={ProfilePolicyScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:16,marginLeft:15}}>{t('headers.policy')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="Terms"
        component={ProfileTermsScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:16,marginLeft:15}}>{t('headers.terms')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="about"
        component={ProfileAboutScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:16,marginLeft:15}}>{t('headers.about')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="tariffs"
        component={ProfileTariffsScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('headers.tariffs')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="active"
        component={ProfileActiveScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('headers.active')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="edit"
        component={EditPostScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'medium',fontSize:18,marginLeft:15}}>{t('headers.editPost')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="approve"
        component={ProfileApproveScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('headers.moderation')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="Favourite"
        component={ProfileFavouriteScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('headers.favourites')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="notactive"
        component={ProfileNotActiveScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('headers.notActive')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="notpayed"
        component={ProfileNotPayedScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('headers.notPayed')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="deleted"
        component={ProfileDeletedScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('headers.deleted')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="admin"
        component={ProfileadminScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('headers.admin')}</Text>
              </View>
          ),
          })}/>
      <Stack.Screen name="ProfileSettings"
        component={ProfileSettingsScreen}
        options={({ navigation }) => ({
          headerShadowVisible:false,
          title: null,
          headerLeft: () => (
              <View style={styles.HeaderRight}>
                  <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                  <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('headers.settings')}</Text>
              </View>
          ),
          })}/>

        <Stack.Screen 
                name='PostTariffs' 
                component={CreatePostTarrifsScreen}
                options={({ navigation }) => ({
                headerShadowVisible:false,
                title: null,
                headerLeft: () => (
                    <View style={styles.HeaderRight}>
                        <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                        <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('headers.tariffs')}</Text>
                    </View>
                ),
            })}/>
        <Stack.Screen 
            name='Pay' 
            component={CreatePostPayScreen}
            options={({ navigation }) => ({
                headerShadowVisible:false,
                title: null,
                headerLeft: () => (
                    <View style={styles.HeaderRight}>
                        <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                        <Text style={{fontFamily:'bold',fontSize:24,marginLeft:15}}>{t('headers.tariffs')}</Text>
                    </View>
                ),
            })}/>
    </Stack.Navigator>
  );
};

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

export default ProfileStackNavigator;
