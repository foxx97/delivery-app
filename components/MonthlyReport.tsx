import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, Platform, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Download } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function MonthlyReport() {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();
  const colors = useThemeColor();

  const generateCSV = (orders: any[]) => {
    const headers = ['Date', 'Time', 'Tip Type', 'Tip Amount'];
    const rows = orders.map(order => [
      new Date(order.date).toISOString().split('T')[0],
      new Date(order.timestamp).toLocaleTimeString(),
      order.tip_type || 'N/A',
      order.tip_amount?.toFixed(2) || '0.00'
    ]);

    return [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
  };

  const downloadReport = async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    try {
      // Get current month's start and end dates
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      // Fetch orders for current month
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      // Generate CSV content
      const csvContent = generateCSV(orders);
      
      // Generate filename
      const monthName = now.toLocaleString('default', { month: 'long' });
      const filename = `monthly_report_${monthName}.csv`;

      if (Platform.OS === 'web') {
        // For web, create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      } else {
        // For mobile, save file and share
        const filePath = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.writeAsStringAsync(filePath, csvContent, {
          encoding: FileSystem.EncodingType.UTF8
        });

        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(filePath, {
            mimeType: 'text/csv',
            dialogTitle: 'Download Monthly Report'
          });
        }
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginVertical: 10,
    },
    buttonText: {
      color: colors.buttonText,
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      marginLeft: 8,
    },
    loadingText: {
      color: colors.textSecondary,
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 5,
    },
  });

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, isLoading && { opacity: 0.7 }]}
        onPress={downloadReport}
        disabled={isLoading}>
        <Download size={20} color={colors.buttonText} />
        <Text style={styles.buttonText}>
          {isLoading ? 'Generating Report...' : 'Download Monthly Report'}
        </Text>
      </TouchableOpacity>
      {isLoading && (
        <Text style={styles.loadingText}>Please wait while we generate your report...</Text>
      )}
    </View>
  );
}