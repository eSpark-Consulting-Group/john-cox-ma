import React, {memo} from 'react';
import {View, Modal, ActivityIndicator} from 'react-native';
import {Theme, useTheme} from '@react-navigation/native';

import {screenHeight} from '../../constants';

const OverlayLoader = ({
  isShow = false,
  hideLoader = false,
}: {
  isShow: boolean;
  hideLoader?: boolean;
}) => {
  const {colors}: Theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}>
      <Modal statusBarTranslucent transparent={true} visible={isShow}>
        <View
          style={{
            flex: 1,
            height: screenHeight,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}>
          {!hideLoader && (
            <ActivityIndicator size={'large'} color={colors.primary} />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default memo(OverlayLoader);
