import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@/components/icon';
import temaCores from '@/constants/cores';
import layout from '@/constants/layout';
import ModalSelecaoImagem from '@/components/formulario/modalSelecaoImagem'; // Importe o novo modal

interface ImagemPickerProps {
  onImagePicked: (uri: string | null) => void;
  style?: object;
  width?: number;
  height?: number;
  shape?: 'circle' | 'square';
}

const ImagemPicker: React.FC<ImagemPickerProps> = ({
  onImagePicked,
  style,
  width,
  height,
  shape = 'square',
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false); // Estado para controlar a visibilidade do modal

  // Lógica de dimensionamento
  const defaultSize = 160;
  const finalWidth = width || height || defaultSize;
  const finalHeight = height || width || defaultSize;
  const isCircle = shape === 'circle';

  const containerStyle = {
    width: finalWidth,
    height: finalHeight,
    borderRadius: isCircle ? finalWidth / 2 : layout.borderRadius.r25,
    borderWidth: 2,
    borderColor: temaCores.borda,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: temaCores.cores.base[5],
    overflow: 'hidden',
  };

  const handleImageResult = (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      onImagePicked(uri);
    } else {
      onImagePicked(null);
    }
    setModalVisivel(false); // Fechar o modal após a seleção
  };

  const takePhoto = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      // O ideal é tratar o caso de permissão negada
      setModalVisivel(false);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [finalWidth, finalHeight],
      quality: 1,
    });
    handleImageResult(result);
  };

  const pickFromGallery = async () => {
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!mediaLibraryPermission.granted) {
      // O ideal é tratar o caso de permissão negada
      setModalVisivel(false);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [finalWidth, finalHeight],
      quality: 1,
    });
    handleImageResult(result);
  };

  // Abre o modal
  const selectImage = () => {
    setModalVisivel(true);
  };

  return (
    <>
      <TouchableOpacity onPress={selectImage} style={[containerStyle, style]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Icon name="camera" size={80} color={temaCores.placeholder} />
          </View>
        )}
      </TouchableOpacity>

      <ModalSelecaoImagem
        visivel={modalVisivel}
        aoTirarFoto={takePhoto}
        aoEscolherDaGaleria={pickFromGallery}
        aoCancelar={() => setModalVisivel(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImagemPicker;
