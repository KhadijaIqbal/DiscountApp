import {
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//store history
var data = [];

const Homescreen = ({ route, navigation }) => {
  const [getDiscValue, setDiscValue] = useState(0);
  const [getfinalprice, setfinalprice] = useState(0);
  const [getprice, setprice] = useState('');
  const [getredPrice, setredPrice] = useState('');

  const [getitemHint, setitemHint] = useState('');
  const [getDiscHint, setDiscHint] = useState('');

  const discCalculate = (pricevalue, disc) => {

    if (pricevalue >= 0 && disc >= 0 && disc <= 100) {
      setprice(pricevalue);
      setredPrice(disc);

      //calculate discounted price
      let Price = (disc / 100) * pricevalue;

       //Calculated amount should be 2 decimal points
      setfinalprice((pricevalue - Price).toFixed(2));
      setDiscValue(Price.toFixed(2));

      setitemHint('');
      setDiscHint('');

    }
     else if (isNaN(pricevalue)) {
      setitemHint('Price can only be greater than zero.');
    } 

    else if (isNaN(disc)) {
      setDiscHint('Discount Percentage can only be positive.');
    }
  };


   const Validate = (x, y) => {
    var ogprice = data.filter((item) => item.OG_Price == x && item.disc == y);

    if (ogprice.length > 0) {

      return true;
    } else {
      return false;
    }
  };

  const SaveData = () => {
    var finalobj = {
      itemkey: Math.random().toString(),
      OG_Price: getprice,
      disc: getredPrice,
      finalamount: getfinalprice,
    };

    data.push(finalobj);

    setprice('');
    setredPrice('');
  };

 

  return (
    <View style={styles.container}>
      <Text style={styles.heading}> CALCULATE PRICE</Text>
      <View style={styles.box}>
        <TextInput
          style={styles.textfield}
          placeholder="Insert Item Price"
          placeholderTextColor="maroon"
          onChangeText={(x) => discCalculate(x, getredPrice)}
          value={getprice}
        />
        <Text style={styles.hint}> {getitemHint} </Text>
        <TextInput
          style={styles.textfield}
          placeholder="Insert Discount Percentage"
          placeholderTextColor="maroon"
          onChangeText={(y) => discCalculate(getprice, y)}
          value={getredPrice}
        />
        <Text style={styles.hint}> {getDiscHint} </Text>

        <View style={styles.result}>
          <Text style={styles.newdata}> MONEY SAVED </Text>
          <Text style={styles.newdata}> {getDiscValue} </Text>
        </View>
        <View style={styles.result}>
          <Text style={styles.newdata}> NEW PRICE </Text>
          <Text style={styles.newdata}> {getfinalprice} </Text>
        </View>

        <View
          style={{ marginTop: 10, backgroundColor: 'maroon', color: 'white' }}>
          <Button
            disabled={
              getprice == '' ||
              getredPrice == '' ||
              Validate(getprice, getredPrice) == true
            }
            title="Save Record"
            color="maroon"
            onPress={() => SaveData(this)}
          />
        </View>
      </View>
    </View>
  );
};

const Historyscreen = ({ navigation }) => {
  const [getClearedList, setClearedList] = useState(data);

  navigation.setOptions({
    headerRight: () => (
      <Button
        title="CLEAR"
        color="maroon"
        onPress={() =>
          Alert.alert(
            'You are sure to delete?',
            'Are you sure to delete the history?',
            [
              {
                text: 'Cancel',
              
              },
              {
                text: 'Yes',
                onPress: () => {setClearedList([]);
                  data = [];
                },
              },
            ]
          )
        }
      />
    ),
  });

  const deleteitem = (itemkey) => {

    var list = getClearedList.filter((item) => item.itemkey != itemkey);
    setClearedList(list);
    data = list;
  };

  return (
    <View style={styles.container}>
      <View style={styles.recordrow}>
        <Text style={styles.header}> OG_Price - </Text>
        <Text style={styles.header}> Discount = </Text>
        <Text style={styles.header}> Final Price </Text>
        <Text> </Text>
      </View>
      <ScrollView>
        {getClearedList.map((item) => (
          <TouchableOpacity itemkey={item.itemkey} onPress={() => deleteitem(item.itemkey)}>
            <View style={styles.recordrow}>
              <Text style={styles.ogcolumn}> {item.OG_Price} </Text>
              <Text style={styles.discountcolumn}> {item.disc} % </Text>
              <Text style={styles.midcol}> {item.finalamount} </Text>
              <Text style={styles.finalcolumn}> X </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const Stack = createStackNavigator();

export default function App({ route, navigation }) {
  const [getdum, setdum] = useState(0);
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'homescreen'}>
          <Stack.Screen
            name="homescreen"
            component={Homescreen}
            options={({ navigation }) => ({
              headerTitle: 'MY DISCOUNT DIARY',
              headerStyle: {
                backgroundColor: 'lightcoral',
                              },

              headerTitleStyle: {
                color: 'white',
              },

              headerRight: () => (
                <Button
                  title="View HISTORY"
                  color="maroon"
                  onPress={() => navigation.navigate('historyscreen')}
                />
              ),
            })}
          />
          <Stack.Screen
            name="historyscreen"
            component={Historyscreen}
            options={{
              headerTitle: 'History',

              headerStyle: {
                backgroundColor: 'lightcoral',

                color: 'white',
              },
              headerTitleStyle: {
                color: 'white',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',

    padding: 8,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
    fontSize: 22,
    color: 'maroon',
  },
  textfield: {
    borderColor: '#f78da7',
    borderRadius: 25,
    borderWidth: 1,
    padding: 10,
    marginTop: '25',
    color: 'maroon',

    fontSize: 15,

    fontFamily: 'trebuchet MS',
  },
  box: {
    width: '100%',
    padding: 10,
    height: '83%',
    border: 1,
  },
  hint: {
    color: 'green',
    fontSize: 15,
  },
  result: {
    width: '100%',

    marginTop: 10,
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 25,
  },
  newdata: {
    textAlign: 'left',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'crimson',
  },
  recordrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: 'white',
  },
  
  ogcolumn: { 
   
    marginLeft: '5%' },

  discountcolumn: 
  { 
   marginLeft: '8%' },

  finalcolumn: {
     marginRight: '1px'
      },
});
