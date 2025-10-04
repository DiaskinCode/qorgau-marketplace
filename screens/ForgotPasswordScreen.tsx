import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, Text, Alert,
  Dimensions, StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Modal, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { width } = Dimensions.get('window');
  const navigation = useNavigation();

  const handleRequestCode = async () => {
    if (!email.trim()) {
      Alert.alert('Ошибка', 'Введите email');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('http://market.qorgau-city.kz/api/password-reset/request/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Alert.alert('Успех', 'Код отправлен на почту');
        navigation.navigate('ResetPassword', { email });
      } else {
        Alert.alert('Ошибка', 'Email не найден');
      }
    } catch (error) {
      Alert.alert('Ошибка', String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Оверлей загрузки */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loaderBackdrop}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" />
            <Text style={styles.loaderText}>Отправляем код…</Text>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.title}>Восстановление пароля</Text>
            <Text style={styles.subtitle}>
              Введите ваш email — мы пришлём 6-значный код для сброса пароля
            </Text>

            <View style={[styles.card, { width: width - 32 }]}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="example@mail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleRequestCode}
              />

              <TouchableOpacity
                onPress={handleRequestCode}
                disabled={loading}
                style={[styles.button, loading && { opacity: 0.7 }]}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>Отправить код</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.helper}>
              Уже есть код?{' '}
              <Text
                style={styles.helperLink}
                onPress={() => navigation.navigate('ResetPassword', { email })}
              >
                Ввести код
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 80 },
  title: { fontSize: 26, fontWeight: '800', color: '#1d1d1f' },
  subtitle: {
    fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center', width: '86%',
  },
  card: {
    marginTop: 28,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  label: { fontSize: 13, color: '#6b7280', marginBottom: 8 },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#F09235',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  helper: { marginTop: 14, color: '#6b7280' },
  helperLink: { color: '#F09235', fontWeight: '700' },
  loaderBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  loaderBox: {
    backgroundColor: '#fff', padding: 20, borderRadius: 14,
    alignItems: 'center', width: 220,
  },
  loaderText: { marginTop: 10, fontWeight: '600', color: '#374151' },
});
