import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import Calculator from './calculator';


export default function Index() {
  return (
    <>
    <Stack.Screen options={{title: 'Calculator'}} />
    <Calculator />
    </>
  );
}