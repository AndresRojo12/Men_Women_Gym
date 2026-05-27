import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

type GridItem = {
  id: string | number;
  [key: string]: any;
};

type DynamicGridProps = {
  data: GridItem[];
  columns?: number;
  gap?: number;
  keyField?: string;
  renderItem?: (item: GridItem) => React.ReactNode;
  onPressItem?: (item: GridItem) => void;

  titleField?: string;
  subtitleField?: string;
  imageField?: string;

  containerStyle?: any;
  itemStyle?: any;
};

const DynamicGrid: React.FC<DynamicGridProps> = ({
  data = [],
  columns = 2,
  gap = 12,
  keyField = 'id',
  renderItem,
  onPressItem,

  titleField = 'title',
  subtitleField = 'subtitle',

  containerStyle,
  itemStyle,
}) => {
  const itemSize = (SCREEN_WIDTH - gap * (columns + 1)) / columns;

  const defaultRender = (item: GridItem) => (
    <View style={[styles.card, itemStyle]}>
      <Text style={styles.title}>{item[titleField]}</Text>

      {item[subtitleField] && (
        <Text style={styles.subtitle}>{item[subtitleField]}</Text>
      )}
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item[keyField])}
      numColumns={columns}
      contentContainerStyle={[styles.container, containerStyle]}
      columnWrapperStyle={{
        gap,
      }}
      ItemSeparatorComponent={() => <View style={{ height: gap }} />}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressItem?.(item)}
          style={{
            width: itemSize,
          }}
        >
          {renderItem ? renderItem(item) : defaultRender(item)}
        </TouchableOpacity>
      )}
    />
  );
};

export default DynamicGrid;

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },

  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    padding: 16,
    minHeight: 100,
    justifyContent: 'center',
  },

  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  subtitle: {
    color: '#AAA',
    marginTop: 6,
    fontSize: 13,
  },
});
