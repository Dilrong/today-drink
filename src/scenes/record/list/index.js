import React, { useState, useEffect} from 'react';
import { DrawerActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Platform, FlatList, View, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCALE_8, SCALE_4 } from '_styles/spacing'
import { BODY1, CAPTION } from '_styles/typography'
import { scaleSize } from '_styles/mixins'
import { PRIMARY, GRAY_DARK } from '_styles/colors'
import firestore from '../../../utils/firebase'
import moment from 'moment'

const Menu = ({navigation}) => (
  <TouchableOpacity style={styles.menu} onPress={() => {navigation.dispatch(DrawerActions.toggleDrawer())}}>
    <MaterialCommunityIcons name="menu" size={26} color={PRIMARY}/>
  </TouchableOpacity>
)

const ListItem = ({ item }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('detail', { id: item.id })}>
            <View style={styles.itemWrap}>
                <View>
                  <Text style={styles.itemName}>{item.data.title}</Text>
                  <Text style={styles.itemTag}>{item.id}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const renderItem = ({item}) => <ListItem item={item}/>;

const ListScreen = ({navigation}) => {
    const [rows, setRows] = useState([])
    const [isLoading, setLoading] = useState(true)

    useEffect(async() => {
        const dailyRef = firestore.collection("daily").where("createdAt", "<=", moment().toDate())
        const data = await dailyRef.get()
        .then(snapshot => {
          const data = snapshot.docs.map(doc => {
            return { id: doc.id, data: doc.data() }
          })
          return data
        })
        .catch(err => {
          console.log(err)
        })
        setRows(data)
        setLoading(false)
    }, [])

    if(isLoading) return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={PRIMARY}/>
      </SafeAreaView>
    )

    return (
        <SafeAreaView style={styles.container}>
            <Menu navigation={navigation}/>
            <FlatList data={rows} renderItem={renderItem} keyExtractor={item => item.id}/>
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
  loader: {
    margin: SCALE_8,
    fontSize: BODY1
  },
  item: {
    margin: SCALE_8,
    width: "95%",
    borderBottomColor: GRAY_DARK,
    borderBottomWidth: scaleSize(0.3),
    marginTop: SCALE_4,
    marginBottom: SCALE_4
  },
  itemWrap: {
    flex: 1,
    flexDirection: 'row'
  },
  itemName: {
    marginTop: SCALE_4,
    marginLeft: SCALE_8,
    fontWeight: 'bold'
  },
  itemComment: {
    marginTop: SCALE_8,
    marginLeft: SCALE_8,
  },
  itemTag: {
    marginTop: SCALE_8,
    marginBottom: SCALE_8,
    marginLeft: SCALE_8,
    fontSize: CAPTION,
    color: GRAY_DARK,
  },
});

export default ListScreen;