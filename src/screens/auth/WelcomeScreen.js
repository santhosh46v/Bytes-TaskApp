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

// Responsive scaling functions
const scaleWidth = (size) => (width / 375) * size;
const scaleHeight = (size) => (height / 812) * size;
const scaleFont = (size) => size * (width / 375);

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.mainSection}>
        {/* Decorative elements */}
        <View style={[styles.decorativeIcon, { top: scaleHeight(161), left: scaleWidth(65) }]}>
          <Text style={styles.decorativeEmoji}>✨</Text>
        </View>
        <View style={[styles.decorativeIcon, { top: scaleHeight(110), left: scaleWidth(130) }]}>
          <Text style={styles.decorativeEmoji}>⭐</Text>
        </View>
        <View style={[styles.decorativeIcon, { top: scaleHeight(200), left: scaleWidth(70) }]}>
          <View style={styles.orangeDot} />
        </View>
        <View style={[styles.decorativeIcon, { top: scaleHeight(180), right: scaleWidth(160) }]}>
          <View style={styles.purpleDot} />
        </View>
        <View style={[styles.decorativeIcon, { top: scaleHeight(240), left: scaleWidth(70) }]}>
          <View style={styles.grayDot} />
        </View>
        <View style={[styles.decorativeIcon, { top: scaleHeight(260), right: scaleWidth(180) }]}>
          <View style={styles.smallPurpleDot} />
        </View>

        {/* Main Icon */}
        <View style={styles.mainIconContainer}>
          <View style={styles.mainIcon}>
            <Icon name="check" size={scaleFont(45)} color="#FFFFFF" />
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
          <Icon name="arrow-forward" size={scaleFont(40)} color="#FFFFFF" />
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
    paddingHorizontal: width * 0.107, 
    paddingLeft: width * 0.107, 
    minHeight: height * 0.7,
  },
  bottomSection: {
    height: scaleHeight(200),
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  curvedBackground: {
    position: 'absolute',
    bottom: 0,
    left: width * 0.613, 
    right: 0,
    height: scaleHeight(185),
    backgroundColor: '#6C63FF',
    borderTopLeftRadius: width * 0.9,
    transform: [{ scaleX: 1.2 }],
  },
  decorativeIcon: {
    position: 'absolute',
    zIndex: 1,
  },
  decorativeEmoji: {
    fontSize: scaleFont(16),
    opacity: 0.6,
  },
  orangeDot: {
    width: scaleWidth(6),
    height: scaleWidth(6),
    borderRadius: scaleWidth(3),
    backgroundColor: '#FF9500',
    opacity: 0.8,
  },
  purpleDot: {
    width: scaleWidth(8),
    height: scaleWidth(8),
    borderRadius: scaleWidth(4),
    backgroundColor: '#6C63FF',
    opacity: 0.6,
  },
  grayDot: {
    width: scaleWidth(4),
    height: scaleWidth(4),
    borderRadius: scaleWidth(2),
    backgroundColor: '#C7C7CC',
    opacity: 0.8,
  },
  smallPurpleDot: {
    width: scaleWidth(4),
    height: scaleWidth(4),
    borderRadius: scaleWidth(2),
    backgroundColor: '#6C63FF',
    opacity: 0.4,
  },
  mainIconContainer: {
    marginBottom: scaleHeight(40),
    zIndex: 2,
    alignSelf: 'flex-start',
  },
  mainIcon: {
    width: scaleWidth(100),
    height: scaleWidth(100),
    borderRadius: scaleWidth(20),
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: scaleHeight(8) },
    shadowOpacity: 0.3,
    shadowRadius: scaleHeight(16),
    elevation: 12,
    marginLeft: scaleWidth(55),
  },
  textContainer: {
    alignItems: 'flex-start',
    marginBottom: scaleHeight(50),
    zIndex: 2,
    width: '100%',
  },
  mainTitle: {
    fontSize: scaleFont(28),
    fontWeight: 'bold',
    color: '#2C2C2E',
    marginBottom: scaleHeight(16),
    textAlign: 'left',
  },
  subtitle: {
    fontSize: scaleFont(16),
    color: '#8E8E93',
    textAlign: 'left',
    lineHeight: scaleHeight(24),
    fontWeight: '400',
  },
  pageIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: scaleHeight(20),
    zIndex: 2,
    alignSelf: 'flex-start',
  },
  indicator: {
    width: scaleWidth(8),
    height: scaleWidth(8),
    borderRadius: scaleWidth(4),
    backgroundColor: '#E5E5EA',
    marginHorizontal: scaleWidth(4),
  },
  activeIndicator: {
    backgroundColor: '#6C63FF',
    width: scaleWidth(20),
    borderRadius: scaleWidth(4),
  },
  nextButton: {
    width: scaleWidth(60),
    height: scaleWidth(60),
    borderRadius: scaleWidth(30),
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: scaleHeight(4) },
    shadowOpacity: 0.3,
    shadowRadius: scaleHeight(12),
    elevation: 8,
    zIndex: 3,
    position: 'absolute',
    bottom: scaleHeight(60),
    right: scaleWidth(30),
  },
});

export default WelcomeScreen;