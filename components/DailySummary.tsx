import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OrderContext } from '@/context/OrderContext';
import { formatCurrency } from '@/models/OrderData';
import { useThemeColor } from '@/hooks/useThemeColor';

type DailySummaryProps = {
  date: string;
  showDate?: boolean;
};

export default function DailySummary({ date, showDate = false }: DailySummaryProps) {
  const { getDailySummary } = useContext(OrderContext);
  const summary = getDailySummary(date);
  const colors = useThemeColor();
  
  const totalTips = summary.cashTips + summary.prepaidTips;
  const avgTipPerOrder = summary.orderCount > 0 
    ? totalTips / summary.orderCount 
    : 0;

  // Format the date for display if needed
  const displayDate = showDate ? new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : null;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginVertical: 10,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    dateText: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: colors.text,
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
    },
    label: {
      fontFamily: 'Inter-Regular',
      fontSize: 15,
      color: colors.textSecondary,
    },
    value: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.text,
    },
    highlightValue: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      color: colors.primary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 12,
    },
    tipContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 8,
    },
    tipColumn: {
      flex: 1,
    },
    tipHeader: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    cashValue: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: colors.cashTip,
    },
    prepaidValue: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: colors.prepaidTip,
    },
  });

  return (
    <View style={styles.container}>
      {showDate && displayDate && (
        <Text style={styles.dateText}>{displayDate}</Text>
      )}
      
      <View style={styles.row}>
        <Text style={styles.label}>Total Orders</Text>
        <Text style={styles.highlightValue}>{summary.orderCount}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.tipContainer}>
        <View style={styles.tipColumn}>
          <Text style={styles.tipHeader}>Cash Tips</Text>
          <Text style={styles.cashValue}>{formatCurrency(summary.cashTips)}</Text>
        </View>
        
        <View style={styles.tipColumn}>
          <Text style={styles.tipHeader}>Prepaid Tips</Text>
          <Text style={styles.prepaidValue}>{formatCurrency(summary.prepaidTips)}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.row}>
        <Text style={styles.label}>Total Tips</Text>
        <Text style={styles.value}>{formatCurrency(totalTips)}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Average Tip/Order</Text>
        <Text style={styles.value}>{formatCurrency(avgTipPerOrder)}</Text>
      </View>
    </View>
  );
}