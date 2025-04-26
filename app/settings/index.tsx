import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  GestureResponderEvent,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Type for SettingsItem props
interface SettingsItemProps {
  label: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'] | React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconType?: 'Ionicons' | 'MaterialCommunityIcons';
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: (event: GestureResponderEvent) => void;
  isDestructive?: boolean;
  detail?: string;
}

// Simple reusable component for settings items
const SettingsItem: React.FC<SettingsItemProps> = ({ 
  label, 
  iconName, 
  iconType = 'Ionicons',
  isSwitch, 
  switchValue, 
  onSwitchChange, 
  onPress, 
  isDestructive = false, 
  detail
}) => {
  const IconComponent = iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.itemContainer}
      disabled={!onPress && !isSwitch}
      activeOpacity={0.7}
    >
      {iconName && (
        <View style={styles.iconContainer}>
          <IconComponent name={iconName as any} size={20} color={isDestructive ? '#ff3b30' : '#7c5dfa'} />
        </View>
      )}
      <Text style={[styles.itemLabel, isDestructive && styles.destructiveText]}>{label}</Text>
      <View style={styles.itemRightContent}>
        {detail && !isSwitch && <Text style={styles.itemDetail}>{detail}</Text>}
        {isSwitch ? (
          <Switch 
            value={switchValue} 
            onValueChange={onSwitchChange} 
            trackColor={{ false: "#e9e9eb", true: "#7c5dfa" }} 
            thumbColor={"#fff"} 
            ios_backgroundColor="#e9e9eb"
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        ) : (
          onPress && <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
        )}
      </View>
    </TouchableOpacity>
  );
};

// Type for SectionHeader props
interface SectionHeaderProps {
  title: string;
}

// Reusable section header
const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>
);

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout action') },
    ]);
  };

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'Are you sure you want to clear the cache? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear Cache', style: 'destructive', onPress: () => console.log('Clear cache action') },
    ]);
  };

  const navigateTo = (screenName: string) => {
    console.log(`Navigate to ${screenName}`);
    try {
       router.push(screenName as any);
    } catch (error) {
       console.error("Navigation error:", error);
       Alert.alert("Navigation Error", `Could not navigate to ${screenName}.`);
    }
  };
  
  const appVersion = '1.0.0 (Build 1)';

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <SectionHeader title="Account" />
        <SettingsItem label="Edit Profile" iconName="person-outline" onPress={() => navigateTo('/profile/index')} />
        <SettingsItem label="Change Password" iconName="lock-closed-outline" onPress={() => navigateTo('/settings/change-password')} />
        <SettingsItem label="Email Address" iconName="mail-outline" onPress={() => navigateTo('/settings/email')} />

        <SectionHeader title="Notifications" />
        <SettingsItem 
          label="Push Notifications" 
          iconName="notifications-outline" 
          isSwitch 
          switchValue={pushNotificationsEnabled} 
          onSwitchChange={setPushNotificationsEnabled} 
        />
        <SettingsItem 
          label="Sound" 
          iconName="volume-medium-outline" 
          isSwitch 
          switchValue={soundEnabled} 
          onSwitchChange={setSoundEnabled} 
        />
        <SettingsItem 
          label="Vibrate" 
          iconName="radio-outline"
          iconType='MaterialCommunityIcons'
          isSwitch 
          switchValue={vibrateEnabled} 
          onSwitchChange={setVibrateEnabled} 
        />

        <SectionHeader title="Appearance" />
        <SettingsItem 
          label="Dark Mode" 
          iconName="moon-outline" 
          isSwitch 
          switchValue={darkModeEnabled} 
          onSwitchChange={setDarkModeEnabled} 
        />

        <SectionHeader title="Data & Storage" />
        <SettingsItem label="Manage Storage" iconName="folder-outline" onPress={() => navigateTo('/settings/storage')} />
        <SettingsItem label="Clear Cache" iconName="trash-outline" onPress={handleClearCache} isDestructive/>
        
        <SectionHeader title="Privacy & Security" />
        <SettingsItem label="Blocked Users" iconName="hand-left-outline" onPress={() => navigateTo('/settings/blocked')} />
        <SettingsItem label="Two-Factor Auth" iconName="shield-checkmark-outline" onPress={() => navigateTo('/settings/2fa')} />

        <SectionHeader title="Help & Support" />
        <SettingsItem label="Help Center" iconName="help-circle-outline" onPress={() => navigateTo('/settings/help')} />
        <SettingsItem label="Contact Support" iconName="chatbubble-ellipses-outline" onPress={() => navigateTo('/settings/support')} />
        <SettingsItem label="Report a Problem" iconName="flag-outline" onPress={() => navigateTo('/settings/report')} />
        
        <SectionHeader title="About" />
        <SettingsItem label="App Version" iconName="information-circle-outline" detail={appVersion} />
        <SettingsItem label="Terms of Service" iconName="document-text-outline" onPress={() => navigateTo('/settings/terms')} />
        <SettingsItem label="Privacy Policy" iconName="shield-checkmark-outline" onPress={() => navigateTo('/settings/privacy')} />

        <SettingsItem label="Logout" onPress={handleLogout} isDestructive />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f6fb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
     paddingBottom: 30,
     paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 28,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
  },
  iconContainer: {
     width: 32,
     height: 32,
     borderRadius: 8,
     backgroundColor: '#edeaf3',
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: 14,
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  itemRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  itemDetail: {
    fontSize: 15,
    color: '#555',
    marginRight: 6,
  },
  destructiveText: {
    color: '#ff3b30',
  },
}); 