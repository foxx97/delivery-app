import React, { useState, useContext, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Modal, 
  ActivityIndicator 
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { OrderContext } from '@/context/OrderContext';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function OrderButton() {
  const { addOrder, lastOrderTime } = useContext(OrderContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const colors = useThemeColor();

  const cooldownPeriod = 60 * 1000;

  useEffect(() => {
    if (lastOrderTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastOrderTime;
        
        if (elapsed < cooldownPeriod) {
          setCooldownRemaining(Math.ceil((cooldownPeriod - elapsed) / 1000));
        } else {
          setCooldownRemaining(0);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [lastOrderTime]);

  const handlePress = () => {
    if (cooldownRemaining > 0) {
      setErrorMessage(`Παρακαλώ περιμένετε ${cooldownRemaining} δευτερόλεπτα πριν προσθέσετε νέα παράδοση.`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    
    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const success = await addOrder();
      if (!success) {
        setErrorMessage('Αποτυχία προσθήκης παράδοσης. Παρακαλώ προσπαθήστε ξανά.');
        setTimeout(() => setErrorMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error adding order:', error);
      setErrorMessage('Παρουσιάστηκε σφάλμα. Παρακαλώ προσπαθήστε ξανά.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: 20,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 30,
      paddingVertical: 15,
      paddingHorizontal: 35,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
    },
    buttonText: {
      color: colors.buttonText,
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      marginLeft: 8,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 25,
      alignItems: 'center',
      width: '80%',
      maxWidth: 400,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    modalTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 22,
      marginBottom: 15,
      color: colors.text,
      textAlign: 'center',
    },
    modalMessage: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      marginBottom: 25,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    cancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 25,
      flex: 1,
      marginRight: 10,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: colors.text,
      fontFamily: 'Inter-Medium',
      fontSize: 16,
    },
    confirmButton: {
      backgroundColor: colors.success,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 25,
      flex: 1,
      marginLeft: 10,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: colors.buttonText,
      fontFamily: 'Inter-Medium',
      fontSize: 16,
    },
    errorMessage: {
      backgroundColor: colors.error,
      borderRadius: 8,
      padding: 12,
      marginTop: 10,
      maxWidth: '80%',
    },
    errorText: {
      color: '#FFFFFF',
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      textAlign: 'center',
    },
    cooldownText: {
      color: colors.textSecondary,
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      marginTop: 8,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Plus size={24} color={colors.buttonText} />
        <Text style={styles.buttonText}>Παράδοση</Text>
      </TouchableOpacity>
      
      {cooldownRemaining > 0 && (
        <Text style={styles.cooldownText}>
          Περιμένετε {cooldownRemaining}δ για την επόμενη παράδοση
        </Text>
      )}
      
      {errorMessage && (
        <View style={styles.errorMessage}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Προσθήκη Παράδοσης</Text>
            <Text style={styles.modalMessage}>
              Επιβεβαίωση ολοκλήρωσης παράδοσης;
            </Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Ακύρωση</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Επιβεβαίωση</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}