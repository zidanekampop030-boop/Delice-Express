import React, { forwardRef, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { color, font, radius, space, type } from '@/design/tokens';
import { Icon } from './Icon';

type Props = TextInputProps & { label: string; error?: string; hint?: string };

/** Champ : label toujours visible (jamais seulement un placeholder), erreur précise sous le champ, pas seulement en couleur. */
export const Field = forwardRef<TextInput, Props>(function Field({ label, error, hint, multiline, style, onFocus, onBlur, ...rest }, ref) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? color.error : focused ? color.primary : color.borderStrong;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        {...rest}
        multiline={multiline}
        accessibilityLabel={label}
        aria-invalid={!!error}
        placeholderTextColor={color.placeholder}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          { borderColor, borderWidth: error || focused ? 2 : 1.5 },
          multiline && styles.multiline,
          Platform.OS === 'web' && ({ outlineStyle: 'none' } as object),
          style,
        ]}
      />
      {error ? (
        <View style={styles.errorRow} accessibilityLiveRegion="polite">
          <Icon name="alert-circle" size={18} tint={color.error} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: space.xs + 2 },
  label: { ...type.label, color: color.text },
  input: {
    minHeight: 52,
    fontFamily: font.sans,
    fontSize: 16,
    color: color.text,
    backgroundColor: color.surface,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 12,
  },
  multiline: { minHeight: 88, textAlignVertical: 'top' },
  errorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  error: { ...type.bodySm, color: color.error, flex: 1 },
  hint: { ...type.bodySm, color: color.textMuted },
});
