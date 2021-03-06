import * as React from 'react';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialIcons';
import SignIn from '~/pages/SignIn';
import Dashboard from '~/pages/Dashboard';
import Profile from '~/pages/Profile';
import DeliveryDetails from '~/pages/DeliveryDetails';
import NewIssue from '~/pages/NewIssue';
import SeeIssues from '~/pages/SeeIssues';
import ConfirmDelivery from '~/pages/ConfirmDelivery';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function DeliveryScreens() {
  const DeliveryScreenOptions = (navigation, title) => {
    return {
      headerShown: true,
      title,
      headerTransparent: true,
      headerTitleStyle: { color: '#fff', fontSize: 16 },
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon
            style={{ marginLeft: 10 }}
            name="chevron-left"
            color="#fff"
            size={25}
          />
        </TouchableOpacity>
      ),
    };
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Dashboard"
        component={Dashboard}
      />
      <Stack.Screen
        options={({ navigation }) =>
          DeliveryScreenOptions(navigation, 'Delivery details')
        }
        name="DeliveryDetails"
        component={DeliveryDetails}
      />
      <Stack.Screen
        options={({ navigation }) =>
          DeliveryScreenOptions(navigation, 'Report an issue')
        }
        name="NewIssue"
        component={NewIssue}
      />
      <Stack.Screen
        options={({ navigation }) =>
          DeliveryScreenOptions(navigation, 'See issues')
        }
        name="SeeIssues"
        component={SeeIssues}
      />
      <Stack.Screen
        options={({ navigation }) =>
          DeliveryScreenOptions(navigation, 'Confirm delivery')
        }
        name="ConfirmDelivery"
        component={ConfirmDelivery}
      />
    </Stack.Navigator>
  );
}

function TabBarIcon({ color }) {
  return <Icon name="account-circle" color={color} size={20} />;
}

function TabMain() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#7D40E7',
        labelStyle: { fontSize: 14 },
      }}
    >
      <Tab.Screen
        options={{
          title: 'Dashboard',
          tabBarIcon: TabBarIcon,
        }}
        name="DeliveryScreens"
        component={DeliveryScreens}
      />
      <Tab.Screen
        options={{
          tabBarIcon: TabBarIcon,
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
}

export default function Routes() {
  const signed = useSelector((state) => state.auth.signed);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {signed ? (
          <Stack.Screen name="TabMain" component={TabMain} />
        ) : (
          <Stack.Screen name="SignIn" component={SignIn} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

TabBarIcon.propTypes = {
  color: PropTypes.string,
};

TabBarIcon.defaultProps = {
  color: '',
};
