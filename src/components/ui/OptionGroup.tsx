import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, space, type } from '@/design/tokens';
import type { PressState } from './Button';

export type Option<T extends string> = { value: T; label: string; hint?: string; trailing?: string };

type Props<T extends string> = {
  legend?: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
};

/** Liste de choix exclusifs (radio) : rangées de 56 px minimum, état sélectionné non porté par la seule couleur (point + bordure épaisse). */
export function OptionGroup<T extends string>({ legend, options, value, onChange }: Props<T>) {
  return (
    <View style={styles.wrap}>
      {legend ? <Text style={styles.legend}>{legend}</Text> : null}
      <View style={styles.list} accessibilityRole="radiogroup">
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected, checked: selected }}
              accessibilityLabel={[opt.label, opt.trailing, opt.hint].filter(Boolean).join(', ')}
            >
              {({ pressed, hovered }: PressState) => (
                <View
                  style={[
                    styles.row,
                    selected && styles.rowOn,
                    !selected && (pressed || hovered) && { backgroundColor: color.surfaceAlt },
                  ]}
                >
                  <View style={[styles.radio, selected && { borderColor: color.primary }]}>{selected ? <View style={styles.dot} /> : null}</View>
                  <View style={styles.texts}>
                    <Text style={styles.label}>{opt.label}</Text>
                    {opt.hint ? <Text style={styles.hint}>{opt.hint}</Text> : null}
                  </View>
                  {opt.trailing ? <Text style={styles.trailing}>{opt.trailing}</Text> : null}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  legend: { ...type.label, color: color.text },
  list: { gap: space.sm },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md - 4,
    paddingVertical: 10,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.borderStrong,
    backgroundColor: color.surface,
  },
  rowOn: { borderColor: color.primary, borderWidth: 2, backgroundColor: color.primaryTint },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: color.borderStrong, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: color.primary },
  texts: { flex: 1 },
  label: { ...type.bodyStrong, fontFamily: font.sansSemi, color: color.text },
  hint: { ...type.bodySm, color: color.textMuted },
  trailing: { fontFamily: font.sansBold, fontSize: 15, color: color.text },
});
