import {View, Modal, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {MyText, MyInput, DisplayBox} from '../../components';
import {MyTheme, VolumeUnit} from '../../types';

// Modal Types
type ModalType = 'warning' | 'reset';

interface BaseModalConfig {
  message: string;
  messageSize: number;
}

interface WarningModalConfig extends BaseModalConfig {
  title: string;
  titleColor: string;
}

interface ResetModalConfig extends BaseModalConfig {}

// Types
export interface RenderModalProps {
  visible: boolean;
  type: ModalType;
  onClose?: () => void;
}

interface RenderRowProps {
  title: string;
  unit: string;
  value?: string | number;
  editable?: boolean;
  makeitstring?: boolean;
}

interface RenderColumnProps {
  label: number | string;
  value: number | string;
  volUnit: VolumeUnit;
  size?: number;
}

interface TripSectionProps {
  label: string;
  children: React.ReactNode;
}

// Modal content configuration with proper typing
const modalConfig: Record<ModalType, WarningModalConfig | ResetModalConfig> = {
  warning: {
    title: 'Warning:',
    titleColor: '#B81106',
    message: 'Trip ! Data will be reset!',
    messageSize: 24,
  },
  reset: {
    message: 'Reset Successful!',
    messageSize: 36,
  },
};

export function RenderModal({visible, type, onClose}: RenderModalProps) {
  const theme = useTheme() as MyTheme;

  const renderContent = () => {
    const config = modalConfig[type];
    const isWarningModal = type === 'warning';

    return (
      <View
        style={[
          styles.modalContent,
          {backgroundColor: theme.colors.background},
        ]}>
        {isWarningModal && (
          <MyText
            size={config.messageSize}
            textColor={(config as WarningModalConfig).titleColor}>
            {(config as WarningModalConfig).title}
          </MyText>
        )}
        <MyText
          size={config.messageSize}
          textColor={
            isWarningModal ? theme.colors.secondary : theme.colors.primary
          }
          style={[styles.modalText, type === 'reset' && styles.resetText]}>
          {config.message}
        </MyText>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>{renderContent()}</View>
    </Modal>
  );
}

// Rest of the code remains the same...
export function RenderRow({
  title,
  unit,
  value,
  editable = true,
  makeitstring,
}: RenderRowProps) {
  const displayValue = makeitstring ? String(value) : value;

  return (
    <View style={styles.sectionContainer}>
      <MyText style={styles.rowTitle}>{title}</MyText>
      <View style={styles.inputContainer}>
        <MyInput value={displayValue} editable={editable} />
        <MyText text={unit} fontFamily="NotoSans-Regular" />
      </View>
    </View>
  );
}

export function RenderColumn({label, value, volUnit, size}: RenderColumnProps) {
  const theme = useTheme() as MyTheme;
  const unitText = volUnit === 'Gallons' ? 'gal' : 'ltr';

  return (
    <View style={styles.column}>
      <MyText
        text={label.toString()}
        fontFamily="AnonymousPro-Regular"
        style={styles.columnLabel}
        size={15}
      />
      <DisplayBox
        value={value || '00'}
        textColor={theme.colors.primary}
        fontFamily="CrimsonText-Bold"
        size={size}
      />
      <MyText text={unitText} />
    </View>
  );
}

export function TripSection({label, children}: TripSectionProps) {
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
  modalText: {
    textAlign: 'center',
  },
  resetText: {
    lineHeight: 38,
  },
  column: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {
    width: '50%',
  },
  inputContainer: {
    width: '50%',
    paddingHorizontal: 15,
  },
  columnLabel: {
    paddingBottom: 5,
  },
});
