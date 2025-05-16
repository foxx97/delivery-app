import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import MonthlyCalendar from '@/components/MonthlyCalendar';
import MonthlyReport from '@/components/MonthlyReport';

export default function MonthlyScreen() {
  const colors = useThemeColor();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <MonthlyCalendar />
        <View style={styles.content}>
          <MonthlyReport />
        </View>
      </ScrollView>
    </View>
  );
}