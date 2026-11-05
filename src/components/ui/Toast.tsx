import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { USE_NATIVE_DRIVER, color, font, radius, space } from '@/design/tokens';
import { Icon } from './Icon';

type ToastData = { id: number; message: string; actionLabel?: string; onAction?: () => void };
type ToastApi = { show: (message: string, action?: { label: string; onPress: () => void }) => void };

const ToastContext = createContext<ToastApi>({ show: () => {} });
export const useToast = () => useContext(ToastContext);

// Au-dessus de la tab bar (≈ 56 px) ; le provider est global, donc approximation volontaire.
const TAB_BAR_CLEARANCE = 64;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState<ToastData | null>(null);

  const show = useCallback<ToastApi['show']>((message, action) => {
    setToast({ id: Date.now(), message, actionLabel: action?.label, onAction: action?.onPress });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    setVisible(toast);
    AccessibilityInfo.announceForAccessibility?.(toast.message);
    anim.setValue(0);
    const seq = Animated.sequence([
      Animated.spring(anim, { toValue: 1, friction: 8, tension: 100, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.delay(3200),
      Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: USE_NATIVE_DRIVER }),
    ]);
    seq.start(({ finished }) => finished && setVisible(null));
    return () => seq.stop();
  }, [toast, anim]);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {visible ? (
        <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + TAB_BAR_CLEARANCE }]}>
          <Animated.View
            style={{
              opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: 'clamp' }),
              transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            }}
          >
            <View style={styles.pill}>
              <Icon name="checkmark-circle" size={20} tint={color.accent} />
              <Text style={styles.text}>{visible.message}</Text>
              {visible.actionLabel ? (
                <Pressable onPress={visible.onAction} accessibilityRole="button" hitSlop={10} style={styles.action}>
                  <Text style={styles.actionText}>{visible.actionLabel}</Text>
                </Pressable>
              ) : null}
            </View>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: space.md, right: space.md, alignItems: 'center', zIndex: 50 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: space.sm + 2, backgroundColor: color.text, borderRadius: radius.lg, paddingLeft: space.md, paddingRight: space.sm, minHeight: 52, maxWidth: 520 },
  text: { flexShrink: 1, fontFamily: font.sansMedium, fontSize: 14.5, lineHeight: 20, color: color.textOnDark },
  action: { minHeight: 44, justifyContent: 'center', paddingHorizontal: space.sm },
  actionText: { fontFamily: font.sansBold, fontSize: 14.5, color: color.accent },
});
