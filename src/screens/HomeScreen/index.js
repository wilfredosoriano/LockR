import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, FlatList, Switch, TouchableOpacity, ToastAndroid, BackHandler, ActivityIndicator } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { FIREBASE_FIRESTORE } from "../../../Firebaseconfig";
import BottomSheet from 'react-native-raw-bottom-sheet';
import { collection, getDoc, doc, onSnapshot, addDoc, getDocs, query, where } from "firebase/firestore";
import CryptoJS from 'crypto-js';
import { useNavigation, useRoute } from "@react-navigation/native";
import * as LocalAuthentication from 'expo-local-authentication';
import { PLATFORM_IMAGES } from "../../utils/platformImages";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileImageUpload from "./ProfileImageUpload";
import LoadingOverlay from "../../components/LoadingOverlay";


const HomeScreen = () => {

    //const randomBytes = CryptoJS.lib.WordArray.random(32);

    //const secretKey = randomBytes.toString(CryptoJS.enc.Hex);
    const auth = getAuth();
    const user = auth.currentUser;
    const userUID = user ? user.uid : null;

    const navigation = useNavigation();
    const route = useRoute();

    const bottomSheetRef = useRef(null);

    const [showPasswords, setShowPasswords] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);

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
                    <View>
                        <Ionicons name="chevron-forward-circle" size={30} color="#244499" style={{marginHorizontal: 10}}/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>

    );


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <ProfileImageUpload/>
                    <Text style={{fontSize: 15, color: 'white'}}>  Hi {userFirstName}</Text>
                </View>
                <View style={styles.iconHeader}>
                    <TouchableOpacity onPress={() => bottomSheetRef.current.open()}>
                        <Ionicons name="settings-outline" size={25} color="white"/>
                    </TouchableOpacity>
                </View>
                
            </View>
            
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalContainer}>
                    <View style={styles.item}>
                        <View style={{flexDirection: 'row'}}>
                        <Ionicons name="bulb-outline" size={20} color="orange"/>
                        <Text style={{color: 'white'}}>Steps on how to create a strong password.</Text> 
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto'}}>
                            <TouchableOpacity style={styles.button} onPress={item1}>
                            <Text style={{color: 'white'}}>View</Text>
                            </TouchableOpacity>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Ionicons name="heart-outline" size={22} color="white"/> 
                            <Text style={{color: 'white'}}> {likeCount2}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.item2}>
                        <View style={{flexDirection: 'row'}}>
                        <Ionicons name="bulb-outline" size={20} color="orange"/>
                        <Text style={{color: 'white'}}>How to secure your account.</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto'}}>
                            <TouchableOpacity style={styles.button} onPress={item2}>
                            <Text style={{color: 'white'}}>View</Text>
                            </TouchableOpacity>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Ionicons name="heart-outline" size={22} color="white"/> 
                            <Text style={{color: 'white'}}> {likeCount}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.item3}>
                        <View style={{flexDirection: 'row'}}>
                        <Ionicons name="bulb-outline" size={20} color="orange"/>
                        <Text style={{color: 'white'}}>Most common reasons why account have been hacked.</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto'}}>
                            <TouchableOpacity style={styles.button} onPress={item3}>
                            <Text style={{color: 'white'}}>View</Text>
                            </TouchableOpacity>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Ionicons name="heart-outline" size={22} color="white"/> 
                            <Text style={{color: 'white'}}> {likeCount3}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.searchContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', flex: 1, borderWidth: 2, borderColor: '#6495ED', marginHorizontal: 5, paddingVertical: 3, borderRadius: 30, elevation: 2 }}>
                    <Ionicons name="search-circle" size={40} color="#244499"/>
                    <TextInput placeholder="Search" value={searchInput} onChangeText={setSearchInput} style={styles.searchInput}/>
                    </View>
                </View>

                <View style={styles.crudContainer}>
                        <TouchableOpacity onPress={handleItemAdd} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 8, backgroundColor: '#244499'}}>
                            <Ionicons name="add-circle-outline" size={22} color="white"/>
                            <Text style={{color: 'white', fontSize: 13.5}}> Add account</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleGenerate} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 8, backgroundColor: '#CB362E'}}>
                            <Ionicons name="key-outline" size={22} color="white"/>
                            <Text style={{color: 'white', fontSize: 13.5}}> Generate Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleHistory} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 8, backgroundColor: '#018FF8'}}>
                            <Ionicons name="timer-outline" size={22} color="white"/>
                            <Text style={{color: 'white', fontSize: 13.5}}> View History</Text>
                        </TouchableOpacity>
                </View>


                <View style={styles.mainContent}>
                    <View style={{alignItems: 'flex-start', marginTop: 20, marginHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>Saved Password</Text>
                        <TouchableOpacity onPress={toggleSortMode}>
                            <Ionicons name="funnel-outline" size={20} color="white"/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listContent}>
                    {isLoading ? (
                    
                    //<ActivityIndicator size="small" color="#0000ff" />
                    <LoadingOverlay/>
                    ) : (
                    <> 
                        <FlatList
                            data={sortedAccounts}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                        />
                    </> 
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
                            <Text>Enable Biometric Authentication</Text>
                            <Switch value={biometricEnabled}
                             onValueChange={toggleBiometricEnabled}/>
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text>About the developer</Text>
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
                            <Text> Logout your account</Text>
                            </>
                            )}
                            </View>
                        </TouchableOpacity>
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
        marginTop: 5,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: '#695BEE',
        flex: 1,
        paddingHorizontal: 20,
      },
      crudContainer: {
        marginHorizontal: 10,
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
        borderLeftWidth: 5,
        borderLeftColor: '#018FF8',
        borderRightWidth: 2,
        borderRightColor: '#018FF8',
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