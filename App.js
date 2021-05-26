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

        <View style={styles.final}>
          <Text style={styles.newdata}> MONEY SAVED </Text>
          <Text style={styles.newdata}> {getDiscValue} </Text>
        </View>
        <View style={styles.final}>
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

const Historyscreen = ({ route, navigation }) => {
  const [getClearedList, setClearedList] = useState(data);

  navigation.setOptions({
    headerRight: () => (
      <Button
        title="CLEAR"
        color="maroon"
        onPress={() =>Alert.alert('DELETE:','Confirm delete history?',
            [
              {text: 'CANCEL',              
              },
              {text: 'CONFIRM',
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
    <View style={{ flex: 1,
    justifyContent: 'center'}}>
      <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
        
        <Text style={styles.header}> OG_Price - </Text>
        <Text style={styles.header}> Discount = </Text>
        <Text style={styles.header}> Final Price </Text>
        <Text> </Text>
      </View>
      <ScrollView>

        {getClearedList.map((item) => (
          <TouchableOpacity
           itemkey={item.itemkey} onPress={() => deleteitem(item.itemkey)}>
            <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
                
              <Text style={{marginLeft: '5%' }}> {item.OG_Price} </Text>
              <Text style={{marginLeft: '8%'}}> {item.disc} % </Text>
              <Text style={styles.midcol}> {item.finalamount} </Text>
              <Text style={styles.del}> ␡ </Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
};

const Stack = createStackNavigator();
export default function App({ route, navigation }) {  
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator >
          <Stack.Screen  name="homescreen"  component={Homescreen} 
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
              headerTitle: 'HISTORY ',

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

  },
  box: {
    width: '100%',
    padding: 10,
    height: '83%',
    border: 1,
  },
  
  final: {
    marginTop: 10,
    justifyContent: 'space-between',
    padding: 10,
     },
  newdata: {
    textAlign: 'left',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'crimson',
  },
 
    hint: {
    color: 'green',
    fontSize: 15,
  },

 
  del: {
     marginRight: '1px',
     color:'red',
     fontWeight:'bold'

      },
});
