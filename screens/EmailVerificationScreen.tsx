// EmailVerificationScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView,
  Platform, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EmailVerificationScreen() {
  const navigation = useNavigation();
  const route = useRoute() as any;

  // ожидаем, что сюда пришли из предыдущего шага (SignUp/логин)
  const initialEmail = route.params?.email || route.params?.login || '';
  const password = route.params?.password || '';

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const inputsRef = useRef<(TextInput | null)[]>([]);
  const { width } = Dimensions.get('window');

  // resend timer
  const [secLeft, setSecLeft] = useState(0);
  useEffect(() => {
    let timer: any = null;
    if (secLeft > 0) {
      timer = setInterval(() => setSecLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    }
    return () => timer && clearInterval(timer);
  }, [secLeft]);

  const focus = (i: number) => inputsRef.current[i]?.focus();

  const handleChange = (text: string, i: number) => {
    const only = text.replace(/\D/g, '');
    if (only.length > 1) {
      const next = [...code];
      only.slice(0, 6 - i).split('').forEach((ch, k) => (next[i + k] = ch));
      setCode(next);
      const last = Math.min(i + only.length, 5);
      focus(last);
      return;
    }
    if (/^\d?$/.test(only)) {
      const next = [...code];
      next[i] = only;
      setCode(next);
      if (only && i < 5) focus(i + 1);
    }
  };

  const handleKeyPress = (e: any, i: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (code[i]) {
        const next = [...code];
        next[i] = '';
        setCode(next);
      } else if (i > 0) {
        const next = [...code];
        next[i - 1] = '';
        setCode(next);
        focus(i - 1);
      }
    }
  };

  const requestCode = async () => {
    if (!email.trim()) {
      Alert.alert('Ошибка', 'Введите E-mail');
      return;
    }
    try {
      setSending(true);
      const res = await fetch('http://market.qorgau-city.kz/api/email/verify/request/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setCode(Array(6).fill(''));
        focus(0);
        setSecLeft(60);
        Alert.alert('Отправлено', 'Код выслан на почту');
      } else {
        const txt = await res.text();
        Alert.alert('Ошибка', txt || 'Не удалось отправить код');
      }
    } catch (e: any) {
      Alert.alert('Сеть', e?.message ?? 'Ошибка запроса');
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async () => {
    const codeStr = code.join('');
    if (!email.trim() || codeStr.length < 6) {
      Alert.alert('Ошибка', 'Введите e-mail и полный код (6 цифр)');
      return;
    }
    try {
      setVerifying(true);
      const res = await fetch('http://market.qorgau-city.kz/api/email/verify/confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeStr }),
      });
      if (res.ok) {
        // успех → идём на регистрацию профиля
        navigation.navigate('Profile' as never, { login: email, password } as never);
      } else {
        const txt = await res.text();
        Alert.alert('Ошибка', txt || 'Код неверный или истёк');
      }
    } catch (e: any) {
      Alert.alert('Сеть', e?.message ?? 'Ошибка запроса');
    } finally {
      setVerifying(false);
    }
  };

  // UI sizes
  const sidePadding = 32;
  const gap = 12;
  const boxWidth = Math.floor((width - sidePadding * 2 - gap * 5) / 6);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.wrap}>
          <Text style={styles.title}>Подтверждение E-mail</Text>
          <Text style={styles.subtitle}>Мы отправим 6-значный код на вашу почту</Text>

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="example@mail.com"
          />

          <View style={{ height: 10 }} />

          <View style={[styles.row, { paddingHorizontal: sidePadding }]}>
            {code.map((d, i) => (
              <View key={i} style={{ width: boxWidth, marginRight: i < 5 ? gap : 0 }}>
                <TextInput
                  ref={(el) => (inputsRef.current[i] = el)}
                  style={styles.otp}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={d}
                  onChangeText={(t) => handleChange(t, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  returnKeyType="next"
                />
              </View>
            ))}
          </View>

          <View style={styles.resendRow}>
            <TouchableOpacity
              onPress={requestCode}
              disabled={sending || secLeft > 0}
              style={[styles.linkBtn, (sending || secLeft > 0) && { opacity: 0.5 }]}
            >
              {sending ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.linkText}>
                  {secLeft > 0 ? `Отправить код снова через ${secLeft} c` : 'Отправить код'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={verifyCode} disabled={verifying} style={[styles.primaryBtn, verifying && { opacity: 0.75 }]}>
            {verifying ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Подтвердить</Text>}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', paddingTop: 80 },
  title: { fontSize: 26, fontWeight: '800', color: '#1d1d1f' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center', width: '86%' },
  label: { width: '86%', marginTop: 18, marginBottom: 6, color: '#6b7280' },
  input: {
    width: '86%',
    height: 50,
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12,
    paddingHorizontal: 12, backgroundColor: '#fafafa',
  },
  row: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 16, marginBottom: 10, width: '100%' },
  otp: {
    height: 60, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12,
    textAlign: 'center', fontSize: 22, backgroundColor: '#fafafa',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  resendRow: { width: '86%', alignItems: 'flex-start', marginBottom: 8 },
  linkBtn: { paddingVertical: 6 },
  linkText: { color: '#F09235', fontWeight: '700' },
  primaryBtn: {
    backgroundColor: '#F09235', height: 54, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', width: '86%', marginTop: 8,
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
