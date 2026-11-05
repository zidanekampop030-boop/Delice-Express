import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, PressableProps } from 'react-native';
import { USE_NATIVE_DRIVER, motion } from '@/design/tokens';
import { useReduceMotion } from './useReduceMotion';

type InteractionHandlers = Pick<PressableProps, 'onHoverIn' | 'onHoverOut' | 'onPressIn' | 'onPressOut'>;

/**
 * Valeur 0 → 1 pilotée par le survol (web) et/ou l'appui (mobile).
 * Le survol n'est qu'un renfort : toute action reste utilisable au toucher.
 */
export function useInteraction({ press = true }: { press?: boolean } = {}) {
  const progress = useRef(new Animated.Value(0)).current;
  const hovered = useRef(false);
  const reduce = useReduceMotion();

  const animateTo = useCallback(
    (toValue: number) => {
      if (reduce) {
        progress.setValue(toValue);
        return;
      }
      Animated.spring(progress, { toValue, ...motion.spring, useNativeDriver: USE_NATIVE_DRIVER }).start();
    },
    [reduce, progress]
  );

  const handlers = useMemo<InteractionHandlers>(() => {
    const h: InteractionHandlers = {
      onHoverIn: () => {
        hovered.current = true;
        animateTo(1);
      },
      onHoverOut: () => {
        hovered.current = false;
        animateTo(0);
      },
    };
    if (press) {
      h.onPressIn = () => animateTo(1);
      h.onPressOut = () => animateTo(hovered.current ? 1 : 0);
    }
    return h;
  }, [animateTo, press]);

  return { progress, handlers };
}

/** Boucle aller-retour 0 → 1 → 0 (flottement ambiant), coupée en « réduire les animations ». */
export function useLoop({ duration = 3200, delay = 0 }: { duration?: number; delay?: number } = {}) {
  const value = useRef(new Animated.Value(0)).current;
  const reduce = useReduceMotion();

  useEffect(() => {
    if (reduce) {
      value.setValue(0);
      return undefined;
    }
    const step = (toValue: number) =>
      Animated.timing(value, { toValue, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: USE_NATIVE_DRIVER });
    const loop = Animated.loop(Animated.sequence([step(1), step(0)]));
    const timer = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, [reduce, duration, delay, value]);

  return value;
}

/** Entrée unique 0 → 1 au montage. */
export function useEntrance({ delay = 0, duration = motion.slow * 2, spring = false }: { delay?: number; duration?: number; spring?: boolean } = {}) {
  const value = useRef(new Animated.Value(0)).current;
  const reduce = useReduceMotion();

  useEffect(() => {
    if (reduce) {
      value.setValue(1);
      return undefined;
    }
    const anim = spring
      ? Animated.spring(value, { toValue: 1, delay, friction: 6, tension: 80, useNativeDriver: USE_NATIVE_DRIVER })
      : Animated.timing(value, { toValue: 1, delay, duration, easing: Easing.out(Easing.cubic), useNativeDriver: USE_NATIVE_DRIVER });
    anim.start();
    return () => anim.stop();
  }, [reduce, delay, duration, spring, value]);

  return value;
}
