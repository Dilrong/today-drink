import React, { useState, useEffect } from 'react';
import { DrawerActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, SafeAreaView, StatusBar, Platform, View, Text, Image, ActivityIndicator, TouchableHighlight, TouchableOpacity, Dimensions, Linking, Share } from 'react-native';
import { scaleSize } from '_styles/mixins';
import { PRIMARY, SECONDARY, GRAY_DARK, WHITE } from '_styles/colors';
import { SCALE_16, SCALE_8 } from '_styles/spacing';
import { H6, H5, BODY1 } from '_styles/typography';
import { ScrollView } from 'react-native-gesture-handler';
import HTML from 'react-native-render-html';
import Moment from 'moment';
import firestore from '../../../utils/firebase';

const OverView = ({data}) => {
  return (
    <View style={styles.overView}>
      <Image style={styles.image} source={{uri: data.image }}/>
      <Text style={styles.date}>{String(data.createdAt.toDate()).slice(0,16)}</Text>
      <Text style={styles.title}>{data.title}</Text>
      <View style={styles.hr}/>
      <Text style={styles.comment}>"{data.comment}"</Text>
      <View style={styles.hr}/>
    </View>
  )
}

const Steps = ({data}) => (
  <View style={styles.body}>
    <HTML html={data.content} imagesMaxWidth={Dimensions.get('window').width} />
  </View>
)

const Menu = ({navigation}) => (
  <TouchableOpacity style={styles.menu} onPress={() => {navigation.dispatch(DrawerActions.toggleDrawer())}}>
    <MaterialCommunityIcons name="menu" size={26} color={PRIMARY}/>
  </TouchableOpacity>
)

const ToolBar = ({data}) => (
  <View style={styles.toolContainer}>
    <TouchableHighlight style={styles.buyContainer} onPress={() => {Linking.openURL(data.url)}}>
      <Text style={styles.buyText}><MaterialCommunityIcons name="credit-card-outline" size={H6} color={WHITE} /> 구매하기</Text>
    </TouchableHighlight>
    <TouchableHighlight style={styles.buyContainer} onPress={() => { 
      Share.share({
        title: '오늘의 음료 - 오늘은 차 한잔 어떠세요?',
        message: 'https://play.google.com/store/apps/details?id=com.dilrong.todaydrink'
      })
    }}>
      <Text style={styles.buyText}><MaterialCommunityIcons name="share-variant" size={H6} color={WHITE} /> 공유하기</Text>
    </TouchableHighlight>
  </View>
)

const DetailScreen = ({navigation, route}) => {
  const [data, setData] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dailyRef = firestore.collection("daily").doc(Moment().format(route.params.id))
    dailyRef.get()
    .then(doc => {
      setData(doc.data())
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  if(loading) return (
    <SafeAreaView style={styles.loading}>
      <ActivityIndicator size="large" color={PRIMARY}/>
    </SafeAreaView>
  )

  return(
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Menu navigation={navigation}/>
        <OverView data={data}/>
        <Steps data={data}/>
        <ToolBar data={data}/>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  menu: {
    paddingLeft: SCALE_8
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: 'center',
    textAlign: 'center'
  },
  overView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SCALE_8
  },
  date: {
    color: GRAY_DARK,
    marginBottom: SCALE_8
  },
  title: {
    fontSize: H5,
    fontWeight: 'bold',
    color: PRIMARY,
    marginBottom: SCALE_8
  },
  body: {
    marginTop: SCALE_8,
    marginLeft: SCALE_16,
    marginRight: SCALE_16,
    fontSize: BODY1
  },
  comment: {
    fontSize: H6,
    fontWeight: "bold",
    fontStyle: "italic"
  },
  image: {
    width: "100%",
    height: scaleSize(200),
    marginBottom: SCALE_8
  },
  steps: {
    flex: 1,
    marginLeft: SCALE_8,
    marginRight: SCALE_8,
  },
  hr: {
    width: "90%",
    borderBottomColor: 'black',
    borderBottomWidth: scaleSize(0.2),
    marginTop: SCALE_8,
    marginBottom: SCALE_8
  },
  toolContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: SECONDARY,
    margin: SCALE_8,
    borderRadius: scaleSize(10),
  },
  buyText: {
    fontSize: H6,
    color: WHITE,
    margin: SCALE_8,
  }
});

export default DetailScreen;