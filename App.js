import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/screens/homeScreen';
import CameraScreen from './components/screens/cameraScreen';

const Stack = createNativeStackNavigator({
  CameraScreen: {
    screen: CameraScreen,
    navigationOptions: {
      headerStyle: { backgroundColor: '#000'}
    }
  }
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{
        headerStyle: {
          backgroundColor: '#000'
        }
      }}>
        <Stack.Screen name='Home' component={HomeScreen}/>
        <Stack.Screen name='Camera' component={CameraScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
