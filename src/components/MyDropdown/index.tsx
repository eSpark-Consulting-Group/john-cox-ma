import React, {memo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Entypo} from '@expo/vector-icons';

import MyText from '../MyText';
import {DropdownProps, MyTheme} from '../../types';

function MyDropdown({
  data,
  onSelect,
  zIndex = 10,
  style,
  containerStyle,
  height = 30,
  theme,
  dropdnHeight,
  value,
}: DropdownProps) {
  const [show, setShow] = useState(false);
  const [label, setLabel] = useState(value ?? 'Select');
  const [selectedItem, setSelectedItem] = useState<string | undefined>(value);
  const dropdownHeight = show ? dropdnHeight || data.length * height : height;

  const handleSelection = (item: string) => {
    setSelectedItem(item);
    onSelect(item);
    setLabel(item);
    setShow(false);
  };

  return (
    <View style={[styles(theme).container, {zIndex: zIndex}, style, {height}]}>
      <Pressable
        style={[
          styles(theme).header,
          {
            zIndex: zIndex - 2,
            ...containerStyle,
          },
        ]}
        onPress={() => {
          setShow(!show);
        }}>
        <MyText
          text={label}
          size={16}
          textColor={theme.colors.semiSecondary}
          fontFamily="CrimsonText-Bold"
        />
        <Entypo
          name={!show ? 'chevron-down' : 'chevron-up'}
          color={theme.colors.semiSecondary}
          size={16}
        />
      </Pressable>
      {show && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles(theme).scroll}
          contentContainerStyle={[
            styles(theme).list,
            {
              zIndex: zIndex + 5,
              top: height,
              height: dropdownHeight,
            },
          ]}>
          {data.map((item, index) => (
            <TouchableOpacity
              activeOpacity={1}
              key={index}
              style={[
                styles().item,
                {
                  borderTopRightRadius: index == 0 ? 6 : 0,
                  borderTopLeftRadius: index == 0 ? 6 : 0,
                  borderBottomLeftRadius: index == data.length - 1 ? 6 : 0,
                  borderBottomRightRadius: index == data.length - 1 ? 6 : 0,
                  backgroundColor:
                    selectedItem === item ? theme.colors.highlight : undefined,
                },
              ]}
              onPress={() => {
                handleSelection(item);
              }}>
              <MyText
                text={item}
                textColor={theme.colors.semiSecondary}
                fontFamily="CrimsonText-Bold"
                size={16}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export default memo(MyDropdown);

const styles = (theme?: MyTheme) =>
  StyleSheet.create({
    container: {
      width: 150,
      borderWidth: 3,
      borderRadius: 5,
      borderColor: theme?.colors.paleBorder,
      backgroundColor: theme?.colors.pale,
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      paddingHorizontal: '20%',
    },
    scroll: {
      position: 'absolute',
      width: '102%',
    },
    list: {
      marginBottom: 30,
      backgroundColor: theme?.colors.pale,
      borderColor: theme?.colors.paleBorder,
      borderWidth: 3,
      borderRadius: 6,
      justifyContent: 'center',
    },
    item: {
      height: 'auto',
      paddingLeft: '20%',
      paddingVertical: '2%',
      zIndex: 50,
      justifyContent: 'center',
    },
  });
