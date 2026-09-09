import React, { createContext, useContext, useState } from 'react';
import { MOCK_NOTIFICATIONS, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_TRANSACTIONS } from '../data/mockData';
const AppContext = createContext(undefined);

const readStored = (key, fallback) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    }
    catch {
        return fallback;
    }
};

const usePersistentState = (key, fallback) => {
    const [value, setValue] = useState(() => readStored(key, fallback));
    const update = (next) => {
        setValue((previous) => {
            const resolved = typeof next === 'function' ? next(previous) : next;
            localStorage.setItem(key, JSON.stringify(resolved));
            return resolved;
        });
    };
    return [value, update];
};

export const AppProvider = ({ children }) => {
    const [notifications, setNotifications] = usePersistentState('farmdirect_notifications', MOCK_NOTIFICATIONS);
    const [products, setProducts] = usePersistentState('farmdirect_products', MOCK_PRODUCTS);
    const [orders, setOrders] = usePersistentState('farmdirect_orders', MOCK_ORDERS);
    const [transactions, setTransactions] = usePersistentState('farmdirect_transactions', MOCK_TRANSACTIONS);
    const [toasts, setToasts] = useState([]);
    const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;
    const markAsRead = (id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    };
    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };
    const showToast = (type, title, message) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        setToasts((prev) => [...prev, { id, type, title, message }]);
        setTimeout(() => {
            dismissToast(id);
        }, 4500);
    };
    const dismissToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 1,
        }).format(amount);
    };
    const addProduct = (product) => setProducts((previous) => [product, ...previous]);
    const updateProduct = (id, changes) => setProducts((previous) => previous.map((product) => product.id === id ? { ...product, ...changes, updatedAt: new Date().toISOString() } : product));
    const removeProduct = (id) => setProducts((previous) => previous.filter((product) => product.id !== id));
    const addOrder = (order) => setOrders((previous) => [order, ...previous]);
    const addTransaction = (transaction) => setTransactions((previous) => [transaction, ...previous]);
    return (<AppContext.Provider value={{
            notifications,
            unreadNotificationsCount,
            markAsRead,
            markAllAsRead,
            toasts,
            showToast,
            dismissToast,
            formatCurrency,
            products,
            addProduct,
            updateProduct,
            removeProduct,
            orders,
            addOrder,
            transactions,
            addTransaction,
        }}>
      {children}
      {/* Global Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (<div key={toast.id} className={`pointer-events-auto p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 ${toast.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-700'
                : toast.type === 'error'
                    ? 'bg-rose-900/90 text-white border-rose-700'
                    : toast.type === 'warning'
                        ? 'bg-amber-900/90 text-white border-amber-700'
                        : 'bg-slate-900/90 text-white border-slate-700'}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm">{toast.title}</p>
                <p className="text-xs text-slate-200 mt-1">{toast.message}</p>
              </div>
              <button onClick={() => dismissToast(toast.id)} className="text-slate-300 hover:text-white text-xs ml-2">
                ✕
              </button>
            </div>
          </div>))}
      </div>
    </AppContext.Provider>);
};
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
