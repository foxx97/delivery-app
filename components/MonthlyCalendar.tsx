import React, { useState, useContext, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { OrderContext } from '@/context/OrderContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { formatCurrency } from '@/models/OrderData';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface DayData {
  date: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export default function MonthlyCalendar() {
  const colors = useThemeColor();
  const { getDailySummary } = useContext(OrderContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const modalY = useRef(new Animated.Value(500)).current;

  const getTodayDate = useCallback(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getDaysInMonth = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const today = getTodayDate();
    const days: DayData[] = [];

    // Previous month days
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayOfMonth: date.getDate(),
        isCurrentMonth: false,
        isToday: dateStr === today,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayOfMonth: i,
        isCurrentMonth: true,
        isToday: dateStr === today,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayOfMonth: i,
        isCurrentMonth: false,
        isToday: dateStr === today,
      });
    }

    return days;
  }, [currentDate, getTodayDate]);

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
    setModalVisible(true);
    Animated.spring(modalY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalY, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedDate(null);
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.card,
    },
    monthYear: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      color: colors.text,
    },
    navigationButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    weekdayHeader: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    weekday: {
      flex: 1,
      textAlign: 'center',
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.textSecondary,
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: SCREEN_WIDTH / 7,
      aspectRatio: 1,
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dayCellInner: {
      width: '100%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    dayNumber: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
    },
    currentDay: {
      backgroundColor: colors.primary + '20',
    },
    selectedDay: {
      backgroundColor: '#2196F3',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      color: colors.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    summaryContainer: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 8,
    },
    summaryLabel: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.textSecondary,
    },
    summaryValue: {
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
    noDataText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
  });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth();

  const renderDailySummary = () => {
    if (!selectedDate) return null;

    const summary = getDailySummary(selectedDate);
    const hasData = summary.orderCount > 0;

    return (
      <View style={styles.summaryContainer}>
        {!hasData ? (
          <Text style={styles.noDataText}>No deliveries on this date</Text>
        ) : (
          <>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Orders</Text>
              <Text style={styles.highlightValue}>{summary.orderCount}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Cash Tips</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(summary.cashTips)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Prepaid Tips</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(summary.prepaidTips)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Tips</Text>
              <Text style={styles.highlightValue}>
                {formatCurrency(summary.cashTips + summary.prepaidTips)}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => navigateMonth(-1)}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => navigateMonth(1)}>
          <ChevronRight size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayHeader}>
        {weekdays.map(day => (
          <Text key={day} style={styles.weekday}>
            {day}
          </Text>
        ))}
      </View>

      <ScrollView>
        <View style={styles.calendarGrid}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dayCell}
              onPress={() => handleDayPress(day.date)}>
              <View
                style={[
                  styles.dayCellInner,
                  day.isToday && styles.currentDay,
                  selectedDate === day.date && styles.selectedDay,
                ]}>
                <Text
                  style={[
                    styles.dayNumber,
                    {
                      color: selectedDate === day.date 
                        ? '#FFFFFF'
                        : day.isCurrentMonth 
                          ? colors.text 
                          : colors.textSecondary,
                    },
                  ]}>
                  {day.dayOfMonth}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: modalY }],
              },
            ]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDate &&
                  new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {renderDailySummary()}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}