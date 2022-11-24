import {Pressable, ScrollView, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import {useTranslation} from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, font, spacing} from 'theme';
import {Button, Loader, Text} from 'components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RnRangeSlider from 'rn-range-slider';
import {useCurrency} from 'hook/useCurrency';
import {SearchScreenNavigationProp} from 'navigators/NavigationsTypes';

const FiltersScreen = () => {
  const {params} = useRoute();
  const {navigate} = useNavigation<SearchScreenNavigationProp>();
  const {t} = useTranslation();
  const [filterSelected, setFilterSelected] = useState<any>({});
  const [low, setLow] = useState(0);
  const {currency} = useCurrency();
  const [high, setHigh] = useState(100);
  const [starRate, setStarRate] = useState<number>(-1);
  const Facets = (params as any).facetsList;
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [floatingLabel, setFloatingLabel] = useState(false);
  const THUMB_RADIUS_LOW = 12;
  const renderThumb = useCallback(
    (name: 'high' | 'low') => (
      <View
        style={{
          width: THUMB_RADIUS_LOW * 2,
          height: THUMB_RADIUS_LOW * 2,
          borderRadius: THUMB_RADIUS_LOW,
          borderWidth: 1,
          borderColor: colors.white,
          backgroundColor: colors.primary,
        }}
      />
    ),
    [],
  );
  const renderRail = useCallback(
    () => (
      <View
        style={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.gray[300],
        }}
      />
    ),
    [],
  );

  const renderRailSelected = useCallback(
    () => (
      <View
        style={{
          height: 4,
          backgroundColor: colors.primary,
          borderRadius: 2,
        }}
      />
    ),
    [],
  );
  const renderLabel = useCallback(
    (value: any) => (
      <View
        style={{
          alignItems: 'center',
          padding: 8,
          backgroundColor: colors.primary,
          borderRadius: 4,
        }}>
        <Text text={value + ' ' + currency?.Symbol} color={colors.white} />
      </View>
    ),
    [currency?.Symbol],
  );
  const renderNotch = useCallback(
    () => (
      <View
        style={{
          width: 8,
          height: 8,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: colors.primary,
          borderLeftWidth: 4,
          borderRightWidth: 4,
          borderTopWidth: 8,
        }}
      />
    ),
    [],
  );

  const updateFilterHandler = useCallback(
    ({key, value}: any) => {
      // const indexKey = filterSelected?.findIndex((i: any) => i[key]);
      // if (indexKey === -1) {
      //   const selectedObj: any = {};
      //   selectedObj[key] = value;
      //   setFilterSelected([...filterSelected, selectedObj]);
      // } else {
      //   const updateFilterArr = filterSelected;
      //   updateFilterArr[indexKey][key] = value;
      //   setFilterSelected([...updateFilterArr]);
      // }
      const updateFilterArr = filterSelected;
      updateFilterArr[key] = value?.toString();
      setFilterSelected(updateFilterArr);
    },
    [filterSelected],
  );

  const handleValueChange = ({low, high}: any) => {
    setLow(low);
    setHigh(high);
  };
  useEffect(() => {
    if (low == 0 && high == 100) {
    } else {
      updateFilterHandler({key: 'price', value: `${low}-${high}`});
    }
  }, [low, high]);

  console.log('{filterSelected}--------');

  return (
    <ScrollView style={{flex: 1, paddingHorizontal: spacing.content}}>
      {Facets.map((filter: any, index: number) => {
        const key = filter?.Key;
        if (key == 'rating') {
          return (
            <View style={{marginTop: 10, marginBottom: 15}}>
              <Text
                text={key}
                variant={'smallBold'}
                style={{marginBottom: spacing.small}}
              />
              <View
                key={index.toString()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {[...new Array(5)].map((i, _) => (
                  <AntDesign
                    style={{marginHorizontal: spacing.tiny}}
                    onPress={() => {
                      setStarRate(_);
                      updateFilterHandler({key, value: _ + 1});
                    }}
                    key={_.toString()}
                    name="star"
                    color={starRate >= _ ? colors.yellow : colors.reloadColor}
                    size={35}
                  />
                ))}
              </View>
            </View>
          );
        }

        if (filter.Key == 'price') {
          return (
            <View style={{marginTop: 10, marginBottom: 15}}>
              <Text
                text={key}
                variant={'smallBold'}
                style={{marginBottom: spacing.small}}
              />
              <RnRangeSlider
                onResponderEnd={e => console.log({e})}
                style={{width: '100%'}}
                min={0}
                max={100}
                step={1}
                floatingLabel
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
                renderLabel={renderLabel}
                renderNotch={renderNotch}
                onValueChanged={(low, high) =>
                  handleValueChange({low, high, key})
                }
              />
            </View>
          );
        }

        return (
          <View style={{marginTop: 10, marginBottom: 15}}>
            <Text
              text={key}
              variant={'smallBold'}
              style={{marginBottom: spacing.small}}
            />
            <SelectDropdown
              onSelect={selectedItem =>
                updateFilterHandler({key, value: selectedItem?.Value})
              }
              search
              searchInputStyle={{backgroundColor: colors.white}}
              defaultButtonText={t('addAddress.states-def')}
              renderDropdownIcon={() => (
                <MaterialIcons
                  name={`keyboard-arrow-down`}
                  size={18}
                  color={colors.black}
                />
              )}
              // disabled={isLoadingStates || !stateSelected.isExistData}
              renderCustomizedButtonChild={selectedItem => (
                <Text
                  center
                  text={selectedItem?.Label || t('addAddress.states-def')}
                />
              )}
              data={filter.Values}
              buttonStyle={{
                width: '100%',
                paddingVertical: spacing.small,
                borderWidth: 1,
                borderColor: colors.gray[400],
                borderRadius: spacing.small,
                backgroundColor: colors.white,
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: spacing.smaller,
              }}
              buttonTextStyle={{fontFamily: font.regular}}
              renderCustomizedRowChild={item => (
                <View
                  style={{
                    height: '100%',
                    justifyContent: 'center',
                    paddingHorizontal: spacing.smaller,
                  }}>
                  <Text variant="mediumBold" text={item.Label} />
                </View>
              )}
              // onSelect={item => {
              //   setStateSelected({...stateSelected, item: item});
              // }}
              buttonTextAfterSelection={selectedItem => {
                return selectedItem;
              }}
              rowTextForSelection={(item: any) => item}
            />
          </View>
        );
      })}
      <Button
        title={t('filter.submitBtn')}
        style={{marginTop: 20}}
        onPress={() => {
          navigate('SearchScreen', {
            dataFilter: filterSelected,
            paramsType: 'filter',
          } as any);
        }}
      />
    </ScrollView>
  );
};

export default FiltersScreen;
