import { View, Text, Image, Pressable } from 'react-native';

function Categories() {
  return (
    <View style={{ padding: 15, borderRadius: 8, maxWidth: 360, margin: 12 }}>
      <Image
        source={{
          uri: 'https://gluestack.github.io/public-blog-video-assets/yoga.png',
        }}
        style={{ marginBottom: 24, height: 240, width: '100%', borderRadius: 8 }}
      />
      <Text style={{ fontSize: 14, marginBottom: 8, color: '#666' }}>
        May 15, 2023
      </Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>
        The Power of Positive Thinking
      </Text>
      <Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#0066cc' }}>
            Read Blog
          </Text>
          <Text style={{ marginLeft: 8, color: '#0066cc' }}>→</Text>
        </View>
      </Pressable>
    </View>
  );
}

export default Categories;