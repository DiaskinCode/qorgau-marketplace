import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

type CatItem = {
  id: number;
  key: string; // i18n key suffix
  icon: keyof typeof ICONS;
};

const ICONS = {
  briefcase: 'briefcase-outline',
  cart: 'cart-outline',
  people: 'people-outline',
  shield: 'shield-checkmark-outline',
  warning: 'warning-outline',
  school: 'school-outline',
  more: 'ellipsis-horizontal-circle-outline',
} as const;

// Статичный список категорий c i18n-ключами
const STATIC_CATEGORIES: CatItem[] = [
  { id: 1, key: 'services',           icon: 'briefcase' },
  { id: 2, key: 'products',           icon: 'cart' },
  { id: 3, key: 'findEmployee',       icon: 'people' },
  { id: 4, key: 'securityAgencies',   icon: 'shield' },
  { id: 5, key: 'industrialSafety',   icon: 'warning' },
  { id: 6, key: 'fireSafetyTraining', icon: 'school' },
  { id: 99, key: 'other',             icon: 'more' },
];

export const CreatePostCategoryScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const auth = useSelector((state: any) => state.auth);
  const isAuthenticated = !!auth?.isAuthenticated && !!auth?.token;

  const renderItem = ({ item }: { item: CatItem }) => {
    const title = t(`createCategory.categories.${item.key}`);
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('CreatePost' as never, {
            categoryParam: title, // локализованное имя
            categoryId: item.id,
          } as never)
        }
      >
        <Ionicons
          name={(ICONS[item.icon] as any) || 'apps-outline'}
          size={28}
          color="#F09235"
          style={{ marginRight: 16 }}
        />
        <Text style={styles.text}>{title}</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Ionicons name="lock-closed-outline" size={60} color="#F09235" style={{ marginBottom: 20 }} />
        <Text style={styles.title}>{t('createCategory.lockTitle')}</Text>
        <Text style={styles.subtitle}>{t('createCategory.lockSubtitle')}</Text>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => {
            const parent = (navigation as any).getParent?.();
            if (parent) {
              parent.navigate('Auth', { screen: 'LoginOrRegistration' });
            } else {
              (navigation as any).navigate('Auth', { screen: 'LoginOrRegistration' });
            }
          }}
        >
          <Text style={styles.authButtonText}>{t('createCategory.authCta')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('createCategory.screenTitle')}</Text>
      <FlatList
        data={STATIC_CATEGORIES}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: { flex: 1, fontSize: 16 },
  title: { fontSize: 20, fontFamily: 'medium', marginBottom: 8 },
  subtitle: { fontSize: 14, fontFamily: 'regular', color: '#6B7280', marginBottom: 20, textAlign: 'center' },
  authButton: {
    backgroundColor: '#F09235',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  authButtonText: { color: '#fff', fontFamily: 'medium', fontSize: 16 },
});
