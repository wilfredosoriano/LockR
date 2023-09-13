import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, FlatList, Switch, TouchableOpacity, ToastAndroid, BackHandler, ActivityIndicator } from 'react-native';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { FIREBASE_FIRESTORE } from "../../../Firebaseconfig";
import BottomSheet from 'react-native-raw-bottom-sheet';
import { collection, getDoc, doc, onSnapshot, addDoc, getDocs, query, where } from "firebase/firestore";
import CryptoJS from 'crypto-js';
import { useNavigation, useRoute } from "@react-navigation/native";
import * as LocalAuthentication from 'expo-local-authentication';
import { PLATFORM_IMAGES } from "../../utils/platformImages";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileImageUpload from "./ProfileImageUpload";
import LoadingOverlay from "../../components/LoadingOverlay";


const HomeScreen = () => {

    const auth = getAuth();
    const user = auth.currentUser;
    const userUID = user ? user.uid : null;

    const navigation = useNavigation();
    const route = useRoute();

    const bottomSheetRef = useRef(null);

    const [showPasswords, setShowPasswords] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isEmpty, setIsEmpty] = useState('');

    const [sortMode, setSortMode] = useState('date'); 
    const [sortedAccounts, setSortedAccounts] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const [biometricEnabled, setBiometricEnabled] = useState(false);

    const [userFirstName, setUserFirstName] = useState("");
    const [shouldExitApp, setShouldExitApp] = useState(false);

    const [likeCount, setLikeCount] = useState(0);
    const [likeCount2, setLikeCount2] = useState(0);
    const [likeCount3, setLikeCount3] = useState(0);

    useEffect(() => {
        
        const likesCollectionRef = collection(FIREBASE_FIRESTORE, 'likes');

        
        const likesQuery = query(
            likesCollectionRef,
            where('itemId', '==', 'item2') 
        );

        
        const unsubscribe = onSnapshot(likesQuery, (querySnapshot) => {
            
            setLikeCount(querySnapshot.size);
        });

        
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
       
        const likesCollectionRef = collection(FIREBASE_FIRESTORE, 'likes');

        const likesQuery = query(
            likesCollectionRef,
            where('itemId', '==', 'item1') 
        );

       
        const unsubscribe = onSnapshot(likesQuery, (querySnapshot) => {
            
            setLikeCount2(querySnapshot.size);
        });

      
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
  
        const likesCollectionRef = collection(FIREBASE_FIRESTORE, 'likes');

 
        const likesQuery = query(
            likesCollectionRef,
            where('itemId', '==', 'item3') 
        );

      
        const unsubscribe = onSnapshot(likesQuery, (querySnapshot) => {
            
            setLikeCount3(querySnapshot.size);
        });

        
        return () => {
            unsubscribe();
        };
    }, []);
    
    


    const handleBackPress = () => {
        if (shouldExitApp) {
          
          BackHandler.exitApp();
        } else {
          
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      
          
          setShouldExitApp(true);
      
          
          setTimeout(() => {
            setShouldExitApp(false);
          }, 2000); 
        }
      
        
        return true;
      };      

    useEffect(() => {
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
   
    return () => {
        backHandler.remove();
    };
    }, [shouldExitApp]);

    const logHistory = async (action, timestamp) => {
        try {
          const user = auth.currentUser;
          await addDoc(collection(FIREBASE_FIRESTORE, 'history'), {
            userId: user.uid,
            action,
            timestamp,
          });
          console.log('History log added:', action);
        } catch (error) {
          console.error('Error logging history:', error);
        }
      };

    const handleLogout = async () => {
        setIsLoading2(true);
        try {
            await AsyncStorage.removeItem('user');

            const createdAt = new Date();

            await logHistory('Logged out', createdAt);

          await signOut(auth);
          ToastAndroid.show('Logout Successful', ToastAndroid.SHORT);
          setIsLoading2(false);
          navigation.navigate('Login');
        } catch (error) {
          console.error('Logout Error:', error.message);
        }
      };      

    const handleItemAdd = () => {
        navigation.navigate('AddAccount');
    }
    const handleHistory = () => {
        navigation.navigate('History');
    }
    const handleGenerate = () => {
        navigation.navigate('GeneratePassword');
    }
    const item1 = () => {
        navigation.navigate('ViewItem1');
    }
    const item2 = () => {
        navigation.navigate('ViewItem2');
    }
    const item3 = () => {
        navigation.navigate('ViewItem3');
    }
    const aboutDeveloper = () => {
        navigation.navigate('About');
    }

    const toggleBiometricEnabled = async () => {
        if (biometricEnabled){
            const isAuthenticated = await authenticateWithBiometrics2();
            if (isAuthenticated) {
                setBiometricEnabled(false);
            }else {
                return true;
            }
        }
        const newBiometricEnabled = !biometricEnabled;
        setBiometricEnabled(newBiometricEnabled);
    
        
        try {
          await AsyncStorage.setItem(`biometricEnabled:${userUID}`, newBiometricEnabled.toString());
        } catch (error) {
          console.error('Error saving biometric setting:', error);
        }
      };
    
      
      useEffect(() => {
        const loadBiometricSetting = async () => {
          try {
            const savedSetting = await AsyncStorage.getItem(`biometricEnabled:${userUID}`);
            if (savedSetting !== null) {
              setBiometricEnabled(savedSetting === 'true');
            }
          } catch (error) {
            console.error('Error loading biometric setting:', error);
          }
        };
    
        if (userUID) {
          loadBiometricSetting();
        }
      }, [userUID]);
   
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

    const authenticateWithBiometrics2 = async () => {
        try {
            const hasBiometrics = await LocalAuthentication.hasHardwareAsync();
            if (hasBiometrics) {
                const isBiometricEnabled = await LocalAuthentication.isEnrolledAsync();
                if (isBiometricEnabled) {
                    const result = await LocalAuthentication.authenticateAsync({
                        promptMessage: 'Authenticate to switch off the toggle',
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
        setIsLoading(true);
        const user = auth.currentUser;

        if (user) {
            
            const userDocRef = doc(FIREBASE_FIRESTORE, 'users', user.uid);
            getDoc(userDocRef)
                .then((userDoc) => {
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserFirstName(userData.firstname);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }

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

                    setIsLoading(false);
                    } catch (error) {
                        console.log('Error decrypting password:', error);
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
            setIsLoading(false);
        });
        return () => {
            unsubscribe();
        }
    }, [searchInput, sortMode]);

    const toggleSortMode = () => {
        if (sortMode === 'date') {
            setSortMode('alphabetical');
        } else if (sortMode === 'alphabetical') {
            setSortMode('date');
        }
    };   

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
                    } else if (item.title === 'Moonton') {
                        return PLATFORM_IMAGES.mobile.uri;
                    } else if (item.title === 'Lazada') {
                        return PLATFORM_IMAGES.lazada.uri;
                    }
                })()}
                style={styles.image}
                resizeMode="contain"
                />
                <View style={{marginLeft: 5, maxWidth: 250}}>
                    <Text style={{ fontSize: 15, marginBottom: 5, fontFamily: 'Open-Sans-Bold'}}>{item.title} Account</Text>
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
                    <View>
                        <Ionicons name="chevron-forward-circle" size={30} color="black" style={{marginHorizontal: 10}}/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>

    );


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <ProfileImageUpload/>
                    <Text style={{fontSize: 15, color: 'black', fontFamily: 'Open-Sans'}}>  Hi <Text style={{fontFamily: 'Open-Sans-Bold'}}>{userFirstName}</Text></Text>
                </View>
                <View style={styles.iconHeader}>
                    <TouchableOpacity onPress={() => bottomSheetRef.current.open()}>
                        <Ionicons name="settings-outline" size={24} color="black"/>
                    </TouchableOpacity>
                </View>
                
            </View>
            
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalContainer}>
                    <View style={styles.item}>
                        <View style={{flexDirection: 'row'}}>
                        <Ionicons name="bulb-outline" size={20} color="orange"/>
                        <Text style={{color: 'black', fontFamily: 'Open-Sans'}}>Create a strong password.</Text> 
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto'}}>
                            <TouchableOpacity style={styles.button} onPress={item1}>
                            <Text style={{color: 'black', fontFamily: 'Open-Sans'}}>View</Text>
                            </TouchableOpacity>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Ionicons name="heart-outline" size={22} color="black"/> 
                            <Text style={{color: 'black'}}> {likeCount2}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.item2}>
                        <View style={{flexDirection: 'row'}}>
                        <Ionicons name="bulb-outline" size={20} color="orange"/>
                        <Text style={{color: 'black', fontFamily: 'Open-Sans'}}>How to secure your account.</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto'}}>
                            <TouchableOpacity style={styles.button} onPress={item2}>
                            <Text style={{color: 'black', fontFamily: 'Open-Sans'}}>View</Text>
                            </TouchableOpacity>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Ionicons name="heart-outline" size={22} color="black"/> 
                            <Text style={{color: 'black'}}> {likeCount}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.item3}>
                        <View style={{flexDirection: 'row'}}>
                        <Ionicons name="bulb-outline" size={20} color="orange"/>
                        <Text style={{color: 'black', fontFamily: 'Open-Sans'}}>Most common reasons why account have been hacked.</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto'}}>
                            <TouchableOpacity style={styles.button} onPress={item3}>
                            <Text style={{color: 'black', fontFamily: 'Open-Sans'}}>View</Text>
                            </TouchableOpacity>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Ionicons name="heart-outline" size={22} color="black"/> 
                            <Text style={{color: 'black'}}> {likeCount3}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.searchContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', flex: 1, borderColor: '#FAAC33', marginHorizontal: 3, paddingHorizontal:5, paddingVertical: 3, borderRadius: 5, elevation: 5 }}>
                    <Ionicons name="search-outline" size={24} color="black"/>
                    <TextInput placeholder="Search by name, title..." value={searchInput} onChangeText={setSearchInput} style={styles.searchInput}/>
                    </View>
                </View>

                <View style={styles.crudContainer}>
                        <TouchableOpacity onPress={handleItemAdd} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 5, padding: 8, backgroundColor: 'white', elevation: 5}}>
                            <Ionicons name="add-circle-outline" size={22} color="black"/>
                            <Text style={{color: 'black', fontSize: 13.5, fontFamily: 'Open-Sans'}}> Add account</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleGenerate} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 5, padding: 8, backgroundColor: 'white', elevation: 5}}>
                            <Ionicons name="key-outline" size={22} color="black"/>
                            <Text style={{color: 'black', fontSize: 13.5, fontFamily: 'Open-Sans'}}> Generate Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleHistory} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 5, padding: 8, backgroundColor: 'white', elevation: 5}}>
                            <Ionicons name="timer-outline" size={22} color="black"/>
                            <Text style={{color: 'black', fontSize: 13.5, fontFamily: 'Open-Sans'}}> View History</Text>
                        </TouchableOpacity>
                </View>


                <View style={styles.mainContent}>
                    <View style={{alignItems: 'flex-start', marginTop: 20, marginHorizontal: 5, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{fontSize: 20, fontFamily: 'Open-Sans-Bold', color: 'black'}}>Saved Password</Text>
                        <TouchableOpacity onPress={toggleSortMode}>
                            <Ionicons name="filter-outline" size={20} color="black"/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listContent}>
                    {isLoading ? (
                    <LoadingOverlay/>
                    ) : sortedAccounts.length === 0 ? (
                        <Text style={{fontFamily: 'Open-Sans'}}>Add account to display here</Text>
                    ) : ( 
                        <FlatList
                            data={sortedAccounts}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                        /> 
                    )}
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
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={{fontFamily: 'Open-Sans'}}>Enable Biometric Authentication</Text>
                            <Switch value={biometricEnabled}
                             onValueChange={toggleBiometricEnabled}/>
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={{fontFamily: 'Open-Sans'}}>About the developer</Text>
                            <TouchableOpacity onPress={aboutDeveloper}>
                                <Ionicons name="person-circle-outline" size={30}/>
                            </TouchableOpacity>
                        </View> 
                        
                        <TouchableOpacity style={{alignItems: 'flex-start', borderWidth: 1, alignItems: 'center', borderRadius: 20, marginHorizontal: 60, marginTop: 20}} onPress={handleLogout}>
                            <View style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
                            {isLoading2 ? (
                            <ActivityIndicator size="small" color="black" />
                            ) : (
                            <> 
                            <Ionicons name="log-out-outline" size={20}/>
                            <Text style={{fontFamily: 'Open-Sans'}}> Logout your account</Text>
                            </>
                            )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </BottomSheet>
        
        </View>
        
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginLeft: 10,
    },
    header: {
        backgroundColor: 'white',
        padding: 10, 
        color: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 5,
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
        marginTop: 10,
        padding: 10,
        maxHeight: 128,
        backgroundColor: 'white',
        elevation: 5,
    },
    item3: {
        width: 220,
        height: 100,
        padding: 15,
        backgroundColor: 'white',
        marginTop: 3,
        margin: 5,
        marginRight: 15,
        borderRadius: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 5,
    },
    item2: {
        width: 220,
        height: 100,
        padding: 15,
        backgroundColor: 'white',
        marginTop: 3,
        margin: 5,
        marginRight: 15,
        borderRadius: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 5,
    },
    item: {
        width: 220,
        height: 100,
        padding: 15,
        backgroundColor: 'white',
        paddingRight: 20,
        marginTop: 3,
        margin: 5,
        marginRight: 15,
        borderRadius: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 5,
    },
    searchContainer: {
        marginTop: 5,
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
        flex: 1,
        fontFamily: 'Open-Sans'
      },
    
      sortIcon: {
        marginLeft: 10,
        marginRight: 20,
        color: 'white',
      },
      button: {
        marginTop: 'auto',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 30,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:  2,
        paddingBottom: 2,
        color: 'white'
      },
      mainContent: {
        marginTop: 5,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: 'white',
        elevation: 20,
        flex: 1,
        paddingBottom: 5,
        paddingHorizontal: 20,
      },
      crudContainer: {
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
        justifyContent: 'center',
        flex: 1
      },
      itemList: {
        width: 350,
        height: 90,
        borderLeftWidth: 5,
        borderLeftColor: 'black',
        borderRightWidth: 2,
        borderRightColor: 'black',
        backgroundColor: 'white',
        marginBottom: 5,
        marginTop: 5,
        elevation: 3,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 0.5,
        borderTopColor: 'lightgray'
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
      textBox: {
        fontFamily: 'Open-Sans'
      }
});

export default HomeScreen;