import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Text,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { loginSuccess, logout } from '../actions/authActions';
import { persistor } from '../store/index';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateUserProfileMutation } from '../api';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/* ---------- Кастомный Dropdown для выбора языка ---------- */
const LanguageDropdown = ({
  value,
  onChange,
  width,
}: {
  value: string;
  onChange: (val: string) => void;
  width: number;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const items = [
    { label: t('profileSettings.language.kz'), value: 'kz' },
    { label: t('profileSettings.language.ru'), value: 'ru' },
    { label: t('profileSettings.language.en'), value: 'en' },
  ];
  const current =
    items.find((i) => i.value === value)?.label ||
    t('profileSettings.language.placeholder');

  return (
    <View style={{ width }}>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={styles.ddButton}
        android_ripple={{ color: '#eee' }}
      >
        <Text style={styles.ddButtonText}>{current}</Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={22}
          color="#9C9C9C"
        />
      </Pressable>

      {open && (
        <View style={styles.ddMenuContainer}>
          <View style={styles.ddMenu}>
            {items.map((it, idx) => {
              const active = value === it.value;
              return (
                <TouchableOpacity
                  key={it.value}
                  activeOpacity={0.85}
                  onPress={() => {
                    onChange(it.value);
                    setOpen(false);
                  }}
                  style={[
                    styles.ddItemRow,
                    idx < items.length - 1 && styles.ddItemDivider,
                  ]}
                >
                  <Text
                    style={[styles.ddItemText, active && styles.ddItemTextActive]}
                  >
                    {it.label}
                  </Text>
                  {active && (
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color="#F09235"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};
/* -------------------------------------------------------- */

export const ProfileSettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [name, onChangeName] = useState(user?.username);
  const [email, onChangeEmail] = useState(user?.email);
  const [phone, onChangePhone] = useState(user?.profile?.phone_number || '');
  const [language, setLanguage] = useState<'ru' | 'kz'>(
    (i18n.language as 'ru' | 'kz') || 'ru'
  );

  const { width } = Dimensions.get('window');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [deleting, setDeleting] = useState(false);
  const dispatch = useDispatch();
  const [image, setImage] = useState<string | null>(null);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  useEffect(() => {
    if (user?.profile_image) {
      setImage(`http://market.qorgau-city.kz${user.profile_image}`);
    }
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('profileSettings.alerts.galleryPermTitle'), t('profileSettings.alerts.galleryPermBody'));
      }
    })();
  }, []);

  const API_BASE = 'http://market.qorgau-city.kz/api';

  const getAuthHeader = (token: string) => {
    if (!token) return {} as any;
    if (token.startsWith('Bearer ') || token.startsWith('Token ')) {
      return { Authorization: token };
    }
    return { Authorization: `Token ${token}` };
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('profileSettings.delete.title'),
      t('profileSettings.delete.message'),
      [
        { text: t('profileSettings.common.cancel'), style: 'cancel' },
        { text: t('profileSettings.delete.confirm'), style: 'destructive', onPress: actuallyDeleteAccount },
      ]
    );
  };

  const actuallyDeleteAccount = async () => {
    if (!user?.username) {
      Alert.alert(t('profileSettings.common.error'), t('profileSettings.delete.userUnknown'));
      return;
    }

    try {
      setDeleting(true);

      const url = `${API_BASE}/user/${encodeURIComponent(user.username)}/delete/`;
      const headers = {
        Accept: 'application/json',
        ...getAuthHeader(token),
      };

      let res = await fetch(url, { method: 'DELETE', headers });

      if (res.status === 405) {
        res = await fetch(url, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ confirm: true }),
        });
      }

      if (res.status === 204 || res.status === 200) {
        handleLogout();
        return;
      }

      if (res.status === 202) {
        handleLogout();
        Alert.alert(t('profileSettings.delete.startedTitle'), t('profileSettings.delete.startedBody'));
        return;
      }

      if (res.status === 401) { handleLogout(); return; }
      if (res.status === 403) { Alert.alert(t('profileSettings.common.forbidden'), t('profileSettings.delete.forbidden')); return; }
      if (res.status === 404) { Alert.alert(t('profileSettings.common.error'), t('profileSettings.delete.notFound')); return; }

      const text = await (async () => { try { return await res.text(); } catch { return ''; } })();
      Alert.alert(t('profileSettings.common.error'), text || t('profileSettings.delete.errorGeneric', { code: res.status }));
    } catch (e: any) {
      Alert.alert(t('profileSettings.common.network'), e?.message ?? t('profileSettings.common.tryLater'));
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigation.navigate('HomeTab' as never);
  };

  const pickImage = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Photos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleLanguage = (lang: 'ru' | 'kz') => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleProfileEdit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (image) {
        formData.append('profile_image', {
          uri: image,
          type: 'image/jpeg',
          name: 'profile_image.jpg',
        } as any);
      }
      formData.append('username', name || '');
      formData.append('phone_number', phone || '');
      formData.append('email', email || '');

      const result: any = await updateUserProfile(formData);

      if (result.error) {
        setLoading(false);
        console.error('Profile update failed:', result.error);
      } else {
        setLoading(false);
        dispatch(loginSuccess(result.data.user, token));
      }
    } catch (error) {
      console.error('Error during profile update:', error);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Modal animationType="slide" transparent visible={isLoading}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.modalText}>{t('profileSettings.modal.updating')}</Text>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={{ alignItems: 'center', width: '90%', paddingBottom: 150, marginHorizontal: '5%' }}>
        {/* Аватар */}
        <TouchableOpacity style={{ marginTop: 40 }} onPress={pickImage} activeOpacity={0.85}>
          {image ? (
            <View>
              <Image
                style={{ position: 'absolute', alignSelf: 'center', top: 30, zIndex: 1, height: 50, width: 50 }}
                source={require('../assets/edit.png')}
              />
              <Image source={{ uri: image }} style={{ width: 110, height: 110, borderRadius: 100, borderWidth: 1, borderColor: '#D6D6D6' }} />
            </View>
          ) : (
            <View style={{ width: 110, height: 110, backgroundColor: '#F7F8F9', borderRadius: 100, borderWidth: 1, borderColor: '#D6D6D6', justifyContent: 'center', alignItems: 'center' }}>
              <Image style={{ height: 25, width: 25, marginTop: 20 }} source={require('../assets/plus.jpg')} />
              <Text style={{ fontFamily: 'regular', fontSize: 14, color: '#96949D', marginTop: 10 }}>
                {t('profileSettings.avatar.placeholder')}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Имя */}
        <View style={{ marginTop: 25 }}>
          <Text style={{ fontFamily: 'medium', fontSize: 16, marginBottom: 10 }}>{t('profileSettings.name.label')}</Text>
          <TextInput
            style={styles.input(width)}
            onChangeText={onChangeName}
            value={name}
            placeholder={t('profileSettings.name.placeholder')}
          />
        </View>

        {/* Телефон */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: 'medium', fontSize: 16, marginBottom: 10 }}>{t('profileSettings.phone.label')}</Text>
          <TextInputMask
            type="custom"
            options={{ mask: '+7 999 999 9999' }}
            style={styles.input(width)}
            value={phone}
            onChangeText={onChangePhone}
            placeholder={t('profileSettings.phone.placeholder')}
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: 'medium', fontSize: 16, marginBottom: 10 }}>{t('profileSettings.email.label')}</Text>
          <TextInput
            style={styles.input(width)}
            onChangeText={onChangeEmail}
            value={email}
            placeholder={t('profileSettings.email.placeholder')}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Язык */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: 'medium', fontSize: 16, marginBottom: 10 }}>{t('profileSettings.language.label')}</Text>
          <LanguageDropdown value={language} onChange={handleLanguage} width={width - 40} />
        </View>

        {/* Кнопки */}
        <View style={{ marginTop: 20, justifyContent: 'center' }}>
          <TouchableOpacity onPress={handleProfileEdit} style={styles.primaryBtn(width)} activeOpacity={0.9}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#FFF', fontSize: 16 }}>{t('profileSettings.actions.updateProfile')}</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout} style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: 'medium', opacity: 0.4 }}>{t('profileSettings.actions.logout')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccount} disabled={deleting} style={styles.deleteBtn(width, deleting)} activeOpacity={0.85}>
          {deleting ? (
            <ActivityIndicator color="#ff3b30" />
          ) : (
            <Text style={{ color: '#ff3b30', fontSize: 16, fontFamily: 'medium' }}>
              {t('profileSettings.actions.deleteAccount')}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  input: (width) => ({
    width: width - 40,
    paddingHorizontal: 10,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#D6D6D6',
    backgroundColor: '#fff',
  }),
  primaryBtn: (width) => ({
    paddingVertical: 15,
    width: width - 40,
    backgroundColor: '#F09235',
    borderRadius: 10,
    alignItems: 'center',
  }),
  deleteBtn: (width, disabled) => ({
    marginTop: 12,
    paddingVertical: 15,
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    opacity: disabled ? 0.7 : 1,
  }),
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    paddingTop: 50,
    alignItems: 'center',
    shadowColor: '#666',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: { marginTop: 25, fontFamily: 'medium', fontSize: 16, textAlign: 'center' },
  ddButton: {
    height: 50,
    backgroundColor: '#F7F8F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ddButtonText: { fontSize: 14, color: '#111' },
  ddMenuContainer: { marginTop: 6 },
  ddMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  ddItemRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ddItemDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
  ddItemText: { fontSize: 14, color: '#333' },
  ddItemTextActive: { color: '#F09235', fontWeight: '700' },
});
