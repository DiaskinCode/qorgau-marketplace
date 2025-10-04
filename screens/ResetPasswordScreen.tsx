import React, { useEffect, useRef, useState } from 'react';
import {
  View, TextInput, TouchableOpacity, Text, Alert,
  Dimensions, StyleSheet, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, Keyboard, Vibration, Animated
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ResetPasswordScreen() {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const { width } = Dimensions.get('window');
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params as { email: string };

  // TIMER
  const [secondsLeft, setSecondsLeft] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    timerRef.current && clearInterval(timerRef.current);
    setSecondsLeft(60);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          timerRef.current && clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => timerRef.current && clearInterval(timerRef.current);
  }, []);

  // UI sizes
  const sidePadding = 32;
  const gap = 12;
  const boxWidth = Math.floor((width - sidePadding * 2 - gap * 5) / 6);

  const focus = (i: number) => inputsRef.current[i]?.focus();

  const handleChange = (text: string, i: number) => {
    const onlyDigits = text.replace(/\D/g, '');
    if (onlyDigits.length > 1) {
      const next = [...code];
      onlyDigits.slice(0, 6 - i).split('').forEach((ch, k) => (next[i + k] = ch));
      setCode(next);
      const last = Math.min(i + onlyDigits.length, 5);
      focus(last);
      return;
    }
    if (/^\d?$/.test(onlyDigits)) {
      const next = [...code];
      next[i] = onlyDigits;
      setCode(next);
      if (onlyDigits && i < 5) focus(i + 1);
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

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleResetPassword = async () => {
    const codeStr = code.join('');
    if (codeStr.length < 6 || !newPassword.trim()) {
      Vibration.vibrate(60);
      shake();
      Alert.alert('Ошибка', 'Введите полный код и новый пароль');
      return;
    }

    try {
      const response = await fetch('http://market.qorgau-city.kz/api/password-reset/confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeStr, new_password: newPassword }),
      });

      if (response.ok) {
        Alert.alert('Успех', 'Пароль изменён');
        navigation.navigate('Login');
      } else {
        Vibration.vibrate(80);
        shake();
        Alert.alert('Ошибка', 'Код неверный или истёк');
      }
    } catch (error) {
      Alert.alert('Ошибка', String(error));
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    try {
      const resp = await fetch('http://market.qorgau-city.kz/api/password-reset/request/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (resp.ok) {
        Alert.alert('Готово', 'Новый код отправлен на почту');
        setCode(Array(6).fill(''));
        focus(0);
        startTimer();
      } else {
        Alert.alert('Ошибка', 'Не удалось отправить код');
      }
    } catch (e) {
      Alert.alert('Ошибка', String(e));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Сброс пароля</Text>
          <Text style={styles.subtitle}>Введите 6-значный код из email</Text>

          <Animated.View
            style={[
              styles.codeRow,
              { paddingHorizontal: sidePadding, transform: [{ translateX: shakeAnim }] },
            ]}
          >
            {code.map((digit, i) => (
              <View key={i} style={{ width: boxWidth, marginRight: i < 5 ? gap : 0 }}>
                <TextInput
                  ref={el => (inputsRef.current[i] = el)}
                  style={[styles.codeInput, { height: 60 }]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(t) => handleChange(t, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  returnKeyType="next"
                />
              </View>
            ))}
          </Animated.View>

          {/* resend */}
          <View style={styles.resendRow}>
            <Text style={styles.resendText}>
              {secondsLeft > 0 ? `Отправить код снова через ${secondsLeft} c` : 'Не получили код?'}
            </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={secondsLeft > 0}
              style={[styles.resendBtn, secondsLeft > 0 && { opacity: 0.5 }]}
            >
              <Text style={styles.resendBtnText}>Отправить снова</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { width: width - 32 }]}>
            <Text style={styles.label}>Новый пароль</Text>
            <TextInput
              style={[styles.textInput, { height: 56 }]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Введите новый пароль"
              secureTextEntry
              returnKeyType="done"
            />

            <TouchableOpacity onPress={handleResetPassword} style={styles.button} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Сменить пароль</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 80 },
  title: { fontSize: 26, fontWeight: '800', color: '#1d1d1f' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center', width: '86%' },
  codeRow: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 22, marginBottom: 14 },
  codeInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    backgroundColor: '#fafafa',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  resendRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 32,
    justifyContent: 'space-between', width: '100%',
  },
  resendText: { color: '#6b7280', fontSize: 13 },
  resendBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  resendBtnText: { color: '#F09235', fontWeight: '700' },
  card: {
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
  textInput: {
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
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
