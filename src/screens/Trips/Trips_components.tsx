import {useTheme} from '@react-navigation/native';
import {View, Modal, StyleSheet} from 'react-native';
import {MyText, MyInput, DisplayBox} from '../../components';
import {MyTheme, VolumeUnit} from '../../types';

export interface RenderModalProps {
  visible: boolean;
  type: 'warning' | 'reset';
  onClose?: () => void;
}
export function RenderModal({visible, type, onClose}: RenderModalProps) {
  const theme = useTheme() as MyTheme;

  const renderContent = () => {
    if (type === 'warning') {
      return (
        <View
          style={[
            styles.modalContent,
            {backgroundColor: theme.colors.background},
          ]}>
          <MyText size={24} textColor={'#B81106'}>
            Warning:
          </MyText>
          <MyText
            size={24}
            textColor={theme.colors.secondary}
            style={{textAlign: 'center'}}>
            Trip ! Data will be reset!
          </MyText>
        </View>
      );
    } else if (type === 'reset') {
      return (
        <View
          style={[
            styles.modalContent,
            {backgroundColor: theme.colors.background},
          ]}>
          <MyText
            size={36}
            textColor={theme.colors.primary}
            style={{textAlign: 'center', lineHeight: 38}}>
            Reset Successful!
          </MyText>
        </View>
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>{renderContent()}</View>
    </Modal>
  );
}

export function RenderRow({
  title,
  unit,
  value,
  editable = true,
}: {
  title: string;
  unit: string;
  value?: string | number;
  editable?: boolean;
}) {
  return (
    <View style={styles.sectionContainer}>
      <MyText style={{width: '50%'}}>{title}</MyText>
      <View style={{width: '50%', paddingHorizontal: 15}}>
        <MyInput value={value} editable={editable} />
        <MyText text={unit} fontFamily="NotoSans-Regular" />
      </View>
    </View>
  );
}

export function RenderColumn({
  label,
  value,
  volUnit,
}: {
  label: number | string;
  value: number | string;
  volUnit: VolumeUnit;
}) {
  const theme = useTheme() as MyTheme;
  return (
    <View style={styles.column}>
      <MyText
        text={label.toString()}
        fontFamily="AnonymousPro-Regular"
        style={{paddingBottom: 5}}
        size={15}
      />
      <DisplayBox
        value={value || '00'}
        textColor={theme.colors.primary}
        fontFamily="CrimsonText-Bold"
      />
      <MyText text={volUnit == 'Gallons' ? 'gal' : 'ltr'} />
    </View>
  );
}

export function TripSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionContainer}>
      <MyText size={18}>{label}</MyText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalContent: {
    width: '100%',
    marginTop: 25,
    height: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 40,
  },
  column: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
