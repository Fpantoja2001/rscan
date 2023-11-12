import React, {useState, useEffect} from 'react';
import {Button, StyleSheet, Text, View, Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs'
import {bundleResourceIO, decodeJpeg} from '@tensorflow/tfjs-react-native'
import * as FileSystem from 'expo-file-system';

export default function HomeScreen({navigation}){
    const [image, setImage] = useState(null);
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
        delete result.canceled;
        
    
    };
  
    const modelJSON = require('../../assets/model/model.json')
    const modelWeights = require('../../assets/model/group1-shard.bin')

    const loadModel = async()=>{
        //.ts: const loadModel = async ():Promise<void|tf.LayersModel>=>{
        const model = await tf.loadLayersModel(
            bundleResourceIO(modelJSON, modelWeights)
        ).catch((e)=>{
            console.log("[LOADING ERROR] info:",e)
        })
        return model
    }

    const makePredictions = async ( batch, model, imagesTensor )=>{
        //.ts: const makePredictions = async (batch:number, model:tf.LayersModel,imagesTensor:tf.Tensor<tf.Rank>):Promise<tf.Tensor<tf.Rank>[]>=>{
        //cast output prediction to tensor
        const predictionsdata = model.predict([imagesTensor]).dataSync()[0];
        console.log(predictionsdata)
        
        //.ts: const predictionsdata:tf.Tensor = model.predict(imagesTensor) as tf.Tensor
        let pred = predictionsdata.split(batch) //split by batch size
        //return predictions 
        return pred
    }

    const transformImageToTensor = async (uri)=>{
          const img64 = await FileSystem.readAsStringAsync(uri, {encoding:FileSystem.EncodingType.Base64})
          const imgBuffer =  tf.util.encodeString(img64, 'base64').buffer
          const raw = new Uint8Array(imgBuffer)
          let imgTensor = decodeJpeg(raw)
          const scalar = tf.scalar(255)
          imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [224, 224])
          const tensorScaled = imgTensor.div(scalar)
          const img = tf.reshape(tensorScaled, [1,224,224,3])
          console.log(tf)

          return img
      }

    const getPredictions = async (image)=>{
        await tf.ready()
        const model = await loadModel()
        const tensor_image = await transformImageToTensor(image)
        const predictions = await makePredictions(1, model, tensor_image).data()
        console.log(predictions)
        return predictions    
    }

    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text> HELLO HI</Text>
            <Button title='Go to Cam' onPress={() => navigation.navigate('Camera')}/>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

            <Button  title='SCAN' onPress={()=> alert(getPredictions(image))}/>
        </View>
    )
}