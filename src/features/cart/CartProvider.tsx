import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { readJSON, writeJSON } from '@/lib/storage';

export type CartLine = { id: string; name: string; unitPrice: number; qty: number };

type State = { lines: CartLine[]; hydrated: boolean };
type Action =
  | { type: 'hydrate'; lines: CartLine[] }
  | { type: 'add'; line: Omit<CartLine, 'qty'>; qty: number }
  | { type: 'setQty'; id: string; qty: number }
  | { type: 'clear' };

const STORAGE_KEY = 'delice.cart.v1';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      // Les ajouts faits avant la fin de l'hydratation sont conservés.
      return { hydrated: true, lines: mergeLines(action.lines, state.lines) };
    case 'add': {
      const exists = state.lines.some((l) => l.id === action.line.id);
      const lines = exists
        ? state.lines.map((l) => (l.id === action.line.id ? { ...l, qty: l.qty + action.qty } : l))
        : [...state.lines, { ...action.line, qty: action.qty }];
      return { ...state, lines };
    }
    case 'setQty':
      return {
        ...state,
        lines: state.lines.map((l) => (l.id === action.id ? { ...l, qty: action.qty } : l)).filter((l) => l.qty > 0),
      };
    case 'clear':
      return { ...state, lines: [] };
    default:
      return state;
  }
}

function mergeLines(base: CartLine[], extra: CartLine[]): CartLine[] {
  const map = new Map(base.map((l) => [l.id, l]));
  extra.forEach((l) => map.set(l.id, { ...l, qty: (map.get(l.id)?.qty ?? 0) + l.qty }));
  return [...map.values()];
}

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, 'qty'>, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });

  useEffect(() => {
    readJSON<CartLine[]>(STORAGE_KEY, []).then((lines) => dispatch({ type: 'hydrate', lines }));
  }, []);

  useEffect(() => {
    if (state.hydrated) writeJSON(STORAGE_KEY, state.lines);
  }, [state.lines, state.hydrated]);

  const add = useCallback<CartContextValue['add']>((line, qty = 1) => dispatch({ type: 'add', line, qty }), []);
  const setQty = useCallback<CartContextValue['setQty']>((id, qty) => dispatch({ type: 'setQty', id, qty }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      count: state.lines.reduce((n, l) => n + l.qty, 0),
      subtotal: state.lines.reduce((s, l) => s + l.unitPrice * l.qty, 0),
      add,
      setQty,
      clear,
    }),
    [state.lines, add, setQty, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans <CartProvider>');
  return ctx;
}
