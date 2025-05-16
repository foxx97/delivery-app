import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import OrderButton from '@/components/OrderButton';
import TipInput from '@/components/TipInput';
import DailySummary from '@/components/DailySummary';
import { OrderContext } from '@/context/OrderContext';
import { getTodayDate } from '@/models/OrderData';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function DailyTracker() {
  const { todayOrders } = useContext(OrderContext);
  const colors = useThemeColor();
  const today = getTodayDate();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
      paddingBottom: Platform.OS === 'web' ? 20 : 80,
    },
    welcomeSection: {
      marginBottom: 20,
    },
    welcomeText: {
      fontFamily: 'Inter-Bold',
      fontSize: 24,
      color: colors.text,
      marginBottom: 5,
    },
    dateText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.textSecondary,
    },
    statsCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginVertical: 15,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statsHeading: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      color: colors.text,
      marginBottom: 10,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
    },
    statLabel: {
      fontFamily: 'Inter-Regular',
      fontSize: 15,
      color: colors.textSecondary,
    },
    statValue: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 10,
    },
    noOrdersText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 10,
    },
    summaryTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      color: colors.text,
      marginTop: 20,
      marginBottom: 5,
    },
  });

  const currentDate = new Date().toLocaleDateString('el-GR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Ημερήσια Παρακολούθηση</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
        
        <View style={styles.statsCard}>
          <Text style={styles.statsHeading}>Γρήγορα Στατιστικά</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Παραδόσεις Σήμερα</Text>
            <Text style={styles.statValue}>{todayOrders.length}</Text>
          </View>
          <View style={styles.divider} />
          {todayOrders.length > 0 ? (
            <Text style={styles.statValue}>
              Τελευταία παράδοση {' '}
              {new Date(todayOrders[todayOrders.length - 1].timestamp).toLocaleTimeString('el-GR')}
            </Text>
          ) : (
            <Text style={styles.noOrdersText}>Δεν υπάρχουν παραδόσεις σήμερα</Text>
          )}
        </View>
        
        <OrderButton />
        
        <TipInput />
        
        <Text style={styles.summaryTitle}>Σύνοψη Ημέρας</Text>
        <DailySummary date={today} />
      </ScrollView>
    </View>
  );
}