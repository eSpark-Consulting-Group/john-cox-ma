import {memo} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';

interface MyCardProps {
  children: React.ReactNode;
}

function MyCard({children}: MyCardProps) {
  const theme = useTheme();
  return (
    <LinearGradient
      colors={['#121033', theme.colors.background]}
      start={{x: -0.5, y: -0.9}}
      end={{x: 0.8, y: 1}}
      style={[
        styles.container,
        {
          borderColor: theme.colors.primary,
        },
      ]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
    rowGap: 10,
  },
});

export default memo(MyCard);
