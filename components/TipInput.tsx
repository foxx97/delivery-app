import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import { DollarSign } from 'lucide-react-native';
import { OrderContext } from '@/context/OrderContext';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TipInput() {
  const [tipAmount, setTipAmount] = useState('');
  const [tipType, setTipType] = useState<'cash' | 'prepaid'>('cash');
  const { addTipToLastOrder, todayOrders } = useContext(OrderContext);
  const colors = useThemeColor();

  const handleTipChange = (text: string) => {
    // Replace comma with dot for decimal
    let processedText = text.replace(',', '.');
    
    // Remove any non-numeric characters except decimal point
    processedText = processedText.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = processedText.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setTipAmount(processedText);
  };

  const handleAddTip = async () => {
    Keyboard.dismiss();
    
    if (!tipAmount || isNaN(Number(tipAmount)) || Number(tipAmount) <= 0) {
      Alert.alert('Μη έγκυρο φιλοδώρημα', 'Παρακαλώ εισάγετε έγκυρο ποσό φιλοδωρήματος.');
      return;
    }
    
    if (todayOrders.length === 0) {
      Alert.alert('Δεν υπάρχουν παραδόσεις', 'Πρέπει να προσθέσετε μια παράδοση πριν προσθέσετε φιλοδώρημα.');
      return;
    }
    
    const lastOrder = todayOrders[todayOrders.length - 1];
    
    if (lastOrder.tip) {
      Alert.alert(
        'Υπάρχει ήδη φιλοδώρημα',
        'Αυτή η παράδοση έχει ήδη φιλοδώρημα. Θέλετε να το ενημερώσετε;',
        [
          {
            text: 'Ακύρωση',
            style: 'cancel',
          },
          {
            text: 'Ενημέρωση',
            onPress: () => submitTip(),
          },
        ],
      );
      return;
    }
    
    submitTip();
  };

  const submitTip = async () => {
    const amount = parseFloat(tipAmount.replace(',', '.'));
    const success = await addTipToLastOrder({ amount, type: tipType });
    
    if (success) {
      setTipAmount('');
      Alert.alert('Επιτυχία', 'Το φιλοδώρημα προστέθηκε στην τελευταία παράδοση.');
    } else {
      Alert.alert('Σφάλμα', 'Αποτυχία προσθήκης φιλοδωρήματος. Παρακαλώ προσπαθήστε ξανά.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: 20,
    },
    heading: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      marginBottom: 10,
      color: colors.text,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderRadius: 10,
      paddingHorizontal: 12,
    },
    icon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      height: 50,
      color: colors.text,
      fontFamily: 'Inter-Regular',
      fontSize: 16,
    },
    typeContainer: {
      flexDirection: 'row',
      marginTop: 10,
    },
    typeButton: {
      flex: 1,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    cashButton: {
      backgroundColor: tipType === 'cash' ? colors.cashTip : colors.inputBackground,
    },
    prepaidButton: {
      backgroundColor: tipType === 'prepaid' ? colors.prepaidTip : colors.inputBackground,
    },
    buttonText: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: tipType === 'cash' || tipType === 'prepaid' ? colors.buttonText : colors.text,
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 15,
    },
    addButtonText: {
      color: colors.buttonText,
      fontFamily: 'Inter-Medium',
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Προσθήκη Φιλοδωρήματος</Text>
      
      <View style={styles.inputContainer}>
        <DollarSign size={20} color={colors.textSecondary} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε ποσό φιλοδωρήματος"
          placeholderTextColor={colors.textSecondary}
          keyboardType="decimal-pad"
          value={tipAmount}
          onChangeText={handleTipChange}
        />
      </View>
      
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, styles.cashButton]}
          onPress={() => setTipType('cash')}
        >
          <Text style={styles.buttonText}>Μετρητά</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.typeButton, styles.prepaidButton]}
          onPress={() => setTipType('prepaid')}
        >
          <Text style={styles.buttonText}>Προπληρωμένο</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddTip}>
        <Text style={styles.addButtonText}>Προσθήκη Φιλοδωρήματος</Text>
      </TouchableOpacity>
    </View>
  );
}