import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.mainSection}>
        {/* Decorative elements */}
        <View style={[styles.decorativeIcon, { top: 160, left: 65 }]}>
          <Text style={styles.decorativeEmoji}>✨</Text>
        </View>
        <View style={[styles.decorativeIcon, { top: 120, left: 130 }]}>
          <Text style={styles.decorativeEmoji}>⭐</Text>
        </View>
        <View style={[styles.decorativeIcon, { top: 200, left: 70 }]}>
          <View style={styles.orangeDot} />
        </View>
        <View style={[styles.decorativeIcon, { top: 180, right: 170 }]}>
          <View style={styles.purpleDot} />
        </View>
        <View style={[styles.decorativeIcon, { top: 240, left: 70 }]}>
          <View style={styles.grayDot} />
        </View>
        <View style={[styles.decorativeIcon, { top: 260, right: 180 }]}>
          <View style={styles.smallPurpleDot} />
        </View>

        {/* Main Icon */}
        <View style={styles.mainIconContainer}>
          <View style={styles.mainIcon}>
            <Icon name="check" size={45} color="#FFFFFF" />
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.textContainer}>
          <Text style={styles.mainTitle}>Get things done.</Text>
          <Text style={styles.subtitle}>
            Just a click away from{'\n'}
            planning your tasks
          </Text>
        </View>

        {/* Page Indicators */}
        <View style={styles.pageIndicators}>
          <View style={[styles.indicator, styles.activeIndicator]} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.curvedBackground} />
        
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('SignUp')} >
          <Icon name="arrow-forward" size={40} color="#FFFFFF" />
        </TouchableOpacity>
      
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 40,
    paddingLeft: 40,
  },
  bottomSection: {
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  curvedBackground: {
    position: 'absolute',
    bottom: 0,
    left: 230,
    right: 0,
    height: 200,
    backgroundColor: '#6C63FF',
    borderTopLeftRadius: width * 0.9,
    transform: [{ scaleX: 1.2 }],
  },
  decorativeIcon: {
    position: 'absolute',
    zIndex: 1,
  },
  decorativeEmoji: {
    fontSize: 16,
    opacity: 0.6,
  },
  orangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9500',
    opacity: 0.8,
  },
  purpleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6C63FF',
    opacity: 0.6,
  },
  grayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C7C7CC',
    opacity: 0.8,
  },
  smallPurpleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6C63FF',
    opacity: 0.4,
  },
  mainIconContainer: {
    marginBottom: 40,
    zIndex: 2,
    alignSelf: 'flex-start',
  },
  mainIcon: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    marginLeft: 55
  },
  textContainer: {
    alignItems: 'flex-start',
    marginBottom: 50,
    zIndex: 2,
    width: '100%',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C2E',
    marginBottom: 16,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'left',
    lineHeight: 24,
    fontWeight: '400',
  },
  pageIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
    zIndex: 2,
    alignSelf: 'flex-start',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#6C63FF',
    width: 20,
    borderRadius: 4,
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 3,
    position: 'absolute',
    bottom: 60,
    right: 30,
  },
});

export default WelcomeScreen;