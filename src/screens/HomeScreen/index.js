import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, FlatList, Switch } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCog, faSearch, faSortAmountDown, faQuestionCircle, faLightbulb, faEdit, faPlusCircle, faEye, faTimesCircle, faChevronCircleRight, faKey, faHistory} from "@fortawesome/free-solid-svg-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { TouchableOpacity, Modal } from "react-native";
import { FIREBASE_FIRESTORE,FIREBASE_AUTH } from "../../../Firebaseconfig";
import BottomSheet from 'react-native-raw-bottom-sheet';
import { collection, addDoc, getDocs, doc, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import CryptoJS from 'crypto-js';
import { useNavigation } from "@react-navigation/native";
import Biometrics from "react-native-biometrics";
import * as LocalAuthentication from 'expo-local-authentication';
import { PLATFORM_IMAGES } from "../../utils/platformImages";
import { getAuth } from "firebase/auth";



const HomeScreen = () => {


    //const randomBytes = CryptoJS.lib.WordArray.random(32);

    //const secretKey = randomBytes.toString(CryptoJS.enc.Hex);

    const auth = getAuth();

    const navigation = useNavigation();

    const bottomSheetRef = useRef(null);

    const [showPasswords, setShowPasswords] = useState({});

    const [selectedItem, setSelectedItem] = useState(null);

    const [sortMode, setSortMode] = useState('date'); 
    const [sortedAccounts, setSortedAccounts] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const [biometricEnabled, setBiometricEnabled] = useState(false);


    const handleItemAdd = () => {
        navigation.navigate('AddAccount');
    }
   
    const handleSelectedItem = async (item) => {
        if (biometricEnabled) {
            const isAuthenticated = await authenticateWithBiometrics();
            if (isAuthenticated) {
                navigation.navigate('ViewAccount', { selectedItem: item });
            }
        } else {
            navigation.navigate('ViewAccount', { selectedItem: item });
        }
    };
    

    const authenticateWithBiometrics = async () => {
        try {
            const hasBiometrics = await LocalAuthentication.hasHardwareAsync();
            if (hasBiometrics) {
                const isBiometricEnabled = await LocalAuthentication.isEnrolledAsync();
                if (isBiometricEnabled) {
                    const result = await LocalAuthentication.authenticateAsync({
                        promptMessage: 'Authenticate to view your account information',
                    });
                    if (result.success) {
                        return true;
                    } else {
                        console.log('Biometric authentication failed');
                    }
                } else {
                    console.log('Biometric is not enrolled');
                }
            } else {
                console.log('Biometric hardware is not available');
            }
        } catch (error) {
            console.error('Error during biometric authentication:', error);
        }
    };

      useEffect(() => {
        const user = auth.currentUser;
        const querySnapshot = collection(FIREBASE_FIRESTORE, 'accounts');
        const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
            const accountsData = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.userId === user.uid) {
                    try {
                        const decryptedPassword = CryptoJS.AES.decrypt(data.password, 'secret').toString(CryptoJS.enc.Utf8);
                        const passwordObject = JSON.parse(decryptedPassword);
                        const plainTextPassword = passwordObject.passwordValue;
                        accountsData.push({
                            id: doc.id,
                            title: data.title,
                            username: data.username,
                            password: plainTextPassword,
                            createdAt: data.createdAt,
                        });

                    } catch (error) {
                        console.error('Error decrypting password:', error);
                    }
                }
            });

            const filteredAccounts = accountsData.filter((account) =>
            account.title.toLowerCase().includes(searchInput.toLowerCase()) ||
            account.username.toLowerCase().includes(searchInput.toLowerCase())
            );

            const sortedData = [...filteredAccounts];
            if (sortMode === 'date') {
                sortedData.sort((a, b) => b.createdAt - a.createdAt);
            } else if (sortMode === 'alphabetical') {
                sortedData.sort((a, b) => a.title.localeCompare(b.title));
            }
            setSortedAccounts(sortedData);
        });
    
        return () => {
            unsubscribe();
            setSelectedItem(null);
        }
    }, [searchInput, sortMode]);

    const toggleSortMode = () => {
        if (sortMode === 'date') {
            setSortMode('alphabetical');
        } else if (sortMode === 'alphabetical') {
            setSortMode('date');
        }
    };

    let imgSource = null;


      

    const renderItem = ({ item }) => (

        <View style={styles.itemList}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
                source={(() => {
                    if (item.title === 'Facebook') {
                        return PLATFORM_IMAGES.facebook.uri;
                    } else if (item.title === 'Google') {
                        return PLATFORM_IMAGES.google.uri;
                    } else if (item.title === 'Microsoft') {
                        return PLATFORM_IMAGES.microsoft.uri;
                    } else if (item.title === 'Shopee') {
                        return PLATFORM_IMAGES.shopee.uri;
                    } else if (item.title === 'Twitter') {
                        return PLATFORM_IMAGES.twitter.uri;
                    } else if (item.title === 'Telegram') {
                        return PLATFORM_IMAGES.telegram.uri;
                    } else if (item.title === 'Instagram') {
                        return PLATFORM_IMAGES.instagram.uri;
                    }
                })()}
                style={styles.image}
                resizeMode="contain"
                />
                <View style={{marginLeft: 5, maxWidth: 250}}>
                    <Text style={{ fontSize: 15, marginBottom: 5, fontWeight: 'bold'}}>{item.title} Account</Text>
                    <Text style={[styles.textBox]} multiline={false} numberOfLines={1}>{item.username}</Text>
                    {showPasswords[item.id] ? (
                        <TextInput>{item.password}</TextInput>
                    ) : (
                        <TextInput style={[styles.asterisks, styles.textBox, {fontSize: 10}]} 
                        multiline={false} numberOfLines={1} editable={false} selectTextOnFocus={false}>
                            {'*'.repeat(item.password.length)}</TextInput>
                    )}
                </View>
            </View>
            <View style={{}}>
                <TouchableOpacity onPress={() => handleSelectedItem(item)}>
                    <FontAwesomeIcon icon={ faChevronCircleRight } size={20} style={[styles.icon, styles.firstIcon]}/>
                </TouchableOpacity>
            </View>
        </View>
    );


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Image
                    source={require('../../images/security.jpg')}
                    style={styles.image}
                    resizeMode="contain"
                    />
                    <Text style={{fontSize: 15, color: 'white'}}>  Hi Wilfredo</Text>
                </View>
                <View style={styles.iconHeader}>
                    <TouchableOpacity >
                        <FontAwesomeIcon icon={ faQuestionCircle } size={20} style={[styles.icon, {color: 'white'}]}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => bottomSheetRef.current.open()}>
                        <FontAwesomeIcon icon={ faCog } size={20} style={[styles.icon, {color: 'white'}]}/>
                    </TouchableOpacity>
                </View>
                
            </View>
            
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalContainer}>
                    <View style={styles.item}>
                        <View style={{flexDirection: 'row'}}>
                        <FontAwesomeIcon icon={ faLightbulb } size={15} style={{marginRight: 2, color: 'orange'}}/>
                        <Text style={{color: 'white'}}>Steps on how to create a strong password.</Text> 
                        </View>
                        <TouchableOpacity style={styles.button}>
                        <Text style={{color: 'white'}}>View</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item2}>
                        <View style={{flexDirection: 'row'}}>
                        <FontAwesomeIcon icon={ faLightbulb } size={15} style={{marginRight: 2, color: 'orange'}}/>
                        <Text style={{color: 'white'}}>How to secure your account.</Text>
                        </View>
                        <TouchableOpacity style={styles.button}>
                        <Text style={{color: 'white'}}>View</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item3}>
                        <View style={{flexDirection: 'row'}}>
                        <FontAwesomeIcon icon={ faLightbulb } size={15} style={{marginRight: 2, color: 'orange'}}/>
                        <Text style={{color: 'white'}}>Most common reasons why account have been hacked.</Text>
                        </View>
                        <TouchableOpacity style={styles.button}>
                        <Text style={{color: 'white'}}>View</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={styles.searchContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', flex: 1, borderWidth: 2, borderColor: '#6495ED', marginHorizontal: 5, paddingVertical: 3, borderRadius: 30, elevation: 2 }}>
                        <FontAwesomeIcon icon={faSearch} size={24} style={styles.search} />
                    <TextInput placeholder="Search" value={searchInput} onChangeText={setSearchInput} style={styles.searchInput}/>
                    </View>
                </View>

                <View style={styles.crudContainer}>
                        <TouchableOpacity onPress={handleItemAdd} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 8, backgroundColor: '#244499'}}>
                            <FontAwesomeIcon icon={faPlusCircle} size={19} style={{ color: 'white'}} />
                            <Text style={{color: 'white', fontSize: 13.5}}> Add account</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleItemAdd} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 8, backgroundColor: '#CB362E'}}>
                            <FontAwesomeIcon icon={faKey} size={19} style={{ color: 'white'}} />
                            <Text style={{color: 'white', fontSize: 13.5}}> Generate Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleItemAdd} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 8, backgroundColor: '#018FF8'}}>
                            <FontAwesomeIcon icon={faHistory} size={19} style={{ color: 'white'}} />
                            <Text style={{color: 'white', fontSize: 13.5}}> View History</Text>
                        </TouchableOpacity>
                </View>


                <View style={styles.mainContent}>
                    <View style={{alignItems: 'flex-start', marginTop: 20, marginHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>Saved Password</Text>
                        <TouchableOpacity onPress={toggleSortMode}>
                            <FontAwesomeIcon icon={faSortAmountDown} size={15} style={styles.sortIcon}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listContent}>
                        <FlatList
                            data={sortedAccounts}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>

                <BottomSheet
                    ref={bottomSheetRef}
                    closeOnDragDown={true}
                    dragFromTopOnly={true}
                    customStyles={{
                        container: styles.bottomSheetContainer,
                        wrapper: styles.bottomSheetWrapper,
                    }}>
                    <View style={styles.bottomSheetContent}>
                        {/* Your bottom sheet content goes here */}
                            <Switch value={biometricEnabled}
                             onValueChange={(value) => setBiometricEnabled(value)}/>
                            <Text>Enable Biometric Authentication</Text>
                    </View>
                </BottomSheet>
        
        </SafeAreaView>
        
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09055D'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginLeft: 10,
    },
    header: {
        backgroundColor: '#695BEE',
        elevation: 2,
        marginLeft: 10,
        marginRight: 10,
        padding: 10, 
        borderRadius: 20,
        color: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    iconHeader: {
        flexDirection: 'row'
    },
    icon: {
        marginRight: 10
    },
    userInfo: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    horizontalContainer: {
        padding: 10,
        marginRight: 7,
        marginLeft: 2,
        maxHeight: 123,
    },
    item3: {
        width: 210,
        height: 100,
        padding: 15,
        backgroundColor: '#2196E0',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginRight: 15,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },
    item2: {
        width: 210,
        height: 100,
        padding: 15,
        backgroundColor: '#CB362E',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginRight: 15,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },
    item: {
        width: 210,
        height: 100,
        padding: 15,
        backgroundColor: '#244499',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginRight: 15,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
      },
    
      search: {
        marginRight: 10,
        marginLeft: 20,
        color: '#6495ED',
      },
      searchInput: {
        borderRadius: 20,
        maxWidth: 200,
        padding: 5,
        flex: 1
      },
    
      sortIcon: {
        marginLeft: 10,
        marginRight: 20,
        color: 'white',
      },
      button: {
        marginTop: 'auto',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 30,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:  2,
        paddingBottom: 2,
        color: 'white'
      },
      mainContent: {
        marginTop: 10,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: '#695BEE',
        flex: 1,
        paddingHorizontal: 20,
      },
      crudContainer: {
        marginHorizontal: 10,
        marginTop: 5,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'black',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 8,
      },
      listContent:{
        alignItems: 'center',
        marginTop: 10,
        flex: 1
      },
      itemList: {
        width: 350,
        height: 90,
        backgroundColor: 'white',
        marginBottom: 10,
        elevation: 5,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      firstIcon: {
        color: '#018FF8',
      },
      secondIcon: {
        marginTop: 5,
        color: '#6495ED',
      },
      bottomSheetContainer: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      bottomSheetWrapper: {
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      bottomSheetContent: {
        backgroundColor: 'white',
        padding: 20,
      },
});

export default HomeScreen;