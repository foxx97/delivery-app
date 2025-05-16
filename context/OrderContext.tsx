import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { Order, Tip, DailySummary, formatDate, getTodayDate } from '@/models/OrderData';

interface OrderContextType {
  orders: Order[];
  todayOrders: Order[];
  lastOrderTime: number | null;
  addOrder: () => Promise<boolean>;
  addTipToLastOrder: (tip: Tip) => Promise<boolean>;
  getDailySummary: (date: string) => DailySummary;
  getMonthlySummaries: () => Record<string, DailySummary[]>;
  resetData: () => Promise<void>;
}

export const OrderContext = createContext<OrderContextType>({
  orders: [],
  todayOrders: [],
  lastOrderTime: null,
  addOrder: async () => false,
  addTipToLastOrder: async () => false,
  getDailySummary: () => ({ date: '', orderCount: 0, cashTips: 0, prepaidTips: 0 }),
  getMonthlySummaries: () => ({}),
  resetData: async () => {},
});

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [todayOrders, setTodayOrders] = useState<Order[]>([]);
  const [lastOrderTime, setLastOrderTime] = useState<number | null>(null);
  const { session } = useAuth();

  // Load orders on initial render and when user changes
  useEffect(() => {
    if (session?.user) {
      loadOrders();
    } else {
      // Clear orders when user logs out
      setOrders([]);
      setTodayOrders([]);
      setLastOrderTime(null);
    }
  }, [session?.user]);

  // Update todayOrders when orders change
  useEffect(() => {
    updateTodayOrders(orders);
  }, [orders]);

  // Load orders from Supabase
  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      const parsedOrders: Order[] = data.map(order => ({
        id: order.id,
        date: order.date,
        timestamp: order.timestamp,
        tip: order.tip_type ? {
          type: order.tip_type as 'cash' | 'prepaid',
          amount: order.tip_amount || 0
        } : undefined
      }));

      setOrders(parsedOrders);
      
      // Set last order time if there are any orders today
      const todaysOrders = parsedOrders.filter(order => order.date === getTodayDate());
      if (todaysOrders.length > 0) {
        setLastOrderTime(todaysOrders[todaysOrders.length - 1].timestamp);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  // Update the todayOrders state
  const updateTodayOrders = (allOrders: Order[]) => {
    const today = getTodayDate();
    const filtered = allOrders.filter(order => order.date === today);
    setTodayOrders(filtered);
  };

  // Add a new order
  const addOrder = async (): Promise<boolean> => {
    if (!session?.user) return false;

    const now = Date.now();
    const cooldownPeriod = 60 * 1000; // 1 minute in milliseconds
    
    // Check if we need to wait for cooldown
    if (lastOrderTime && now - lastOrderTime < cooldownPeriod) {
      return false;
    }

    try {
      const newOrder = {
        user_id: session.user.id,
        date: getTodayDate(),
        timestamp: now
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .select()
        .single();

      if (error) throw error;

      const orderWithId: Order = {
        id: data.id,
        date: data.date,
        timestamp: data.timestamp
      };

      setOrders(prev => [...prev, orderWithId]);
      setLastOrderTime(now);
      return true;
    } catch (error) {
      console.error('Error adding order:', error);
      return false;
    }
  };

  // Add tip to the last order
  const addTipToLastOrder = async (tip: Tip): Promise<boolean> => {
    if (!session?.user || todayOrders.length === 0) return false;

    const lastOrder = todayOrders[todayOrders.length - 1];

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          tip_type: tip.type,
          tip_amount: tip.amount
        })
        .eq('id', lastOrder.id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === lastOrder.id 
          ? { ...order, tip }
          : order
      ));

      return true;
    } catch (error) {
      console.error('Error adding tip:', error);
      return false;
    }
  };

  // Get summary for a specific date
  const getDailySummary = (date: string): DailySummary => {
    const dateOrders = orders.filter(order => order.date === date);
    
    const summary: DailySummary = {
      date,
      orderCount: dateOrders.length,
      cashTips: 0,
      prepaidTips: 0,
    };
    
    dateOrders.forEach(order => {
      if (order.tip) {
        if (order.tip.type === 'cash') {
          summary.cashTips += order.tip.amount;
        } else {
          summary.prepaidTips += order.tip.amount;
        }
      }
    });
    
    return summary;
  };

  // Get all monthly summaries
  const getMonthlySummaries = (): Record<string, DailySummary[]> => {
    const summaries: Record<string, DailySummary[]> = {};
    
    orders.forEach(order => {
      const [year, month] = order.date.split('-');
      const monthKey = `${year}-${month}`;
      
      if (!summaries[monthKey]) {
        summaries[monthKey] = [];
      }
      
      const existingDaySummary = summaries[monthKey].find(s => s.date === order.date);
      
      if (!existingDaySummary) {
        summaries[monthKey].push(getDailySummary(order.date));
      }
    });
    
    return summaries;
  };

  // Reset user's data
  const resetData = async (): Promise<void> => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('user_id', session.user.id);

      if (error) throw error;

      setOrders([]);
      setTodayOrders([]);
      setLastOrderTime(null);
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  const contextValue: OrderContextType = {
    orders,
    todayOrders,
    lastOrderTime,
    addOrder,
    addTipToLastOrder,
    getDailySummary,
    getMonthlySummaries,
    resetData,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};