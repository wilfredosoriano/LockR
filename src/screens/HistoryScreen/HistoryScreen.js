import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Modal} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_FIRESTORE } from "../../../Firebaseconfig";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const HistoryScreen = () => {

    const navigation = useNavigation();

    const [historyLogs, setHistoryLogs] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);


    const auth = getAuth();

    useEffect(() => {
      const fetchHistoryLogs = async () => {
        try {
        const user = auth.currentUser;
          const q = query(
            collection(FIREBASE_FIRESTORE, 'history'),
            orderBy('timestamp', 'desc') 
          );
          const querySnapshot = await getDocs(q);
          const logs = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === user.uid){
            logs.push(doc.data());
            }
          });
          setHistoryLogs(logs);
        } catch (error) {
          console.error('Error fetching history logs:', error);
        }
      };
  
      fetchHistoryLogs();
    }, []);

    const handleBack = () => {
        navigation.navigate('Home');
    }

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
      };
      

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={handleBack}>
                        <Ionicons name="arrow-back-circle-outline" size={30}/>
                    </TouchableOpacity>
                    <Text style={styles.passwordDetail}>History</Text>
                </View>
            </View>

            <View style={styles.mainContent}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent:'space-between' }}>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={toggleModal}>
                        <Ionicons name="information-circle-outline" size={24} color="#DE922A"/>
                    </TouchableOpacity>
                    <Text style={{ fontFamily:'Open-Sans' }}>About</Text>
                    </View>

                </View>
                <FlatList
                    data={historyLogs}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                    <View style={styles.logItem}>
                        <Text style={{fontFamily: 'Open-Sans-Bold'}}>{item.action}</Text>
                        <Text style={{fontFamily: 'Open-Sans'}}>{item.timestamp.toDate().toLocaleString()}</Text>
                    </View>
                    )}
                />
                {isModalVisible && (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={isModalVisible}
                        onRequestClose={toggleModal}
                    >
                        <TouchableOpacity onPress={toggleModal} activeOpacity={11} style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                        
                            <View style={{alignItems: 'center', marginBottom: 5,}}>
                                <Ionicons name="information-circle-outline" size={30} color="#DE922A"/>
                            </View>
                            <View style={{marginBottom: 10}}>
                            <Text style={{textAlign: 'center', fontFamily: 'Open-Sans' }}>This section functions as a private activity log, capturing your actions within the app for your reference. 
                            It ensures that you have visibility into your recent interactions and activities, allowing you to keep track of your actions and confirming your activity history. </Text>
                            </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                    )}

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        elevation: 5,
        justifyContent: 'space-between'
    },
    headerLeft: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    passwordDetail: {
        fontSize: 20,
        marginHorizontal: 10,
        fontFamily: 'Open-Sans-Bold'
    },
    mainContent: {
        backgroundColor: 'white',
        flex: 1,
        elevation: 5,
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    logItem: {
        padding: 16,
        borderRadius: 5,
        borderLeftWidth: 7,
        borderRightWidth: 2,
        marginVertical: 2,
        marginHorizontal: 5,
       elevation: 2,
       borderLeftColor: '#CB362E',
       borderRightColor: '#CB362E',
       backgroundColor: 'white',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 20,
        width: '80%',
        elevation: 5,
      },
      
      
      
});

export default HistoryScreen;