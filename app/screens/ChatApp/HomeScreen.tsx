import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { FlatList, Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import {
    Header, Icon, // @demo remove-current-line
    Text
} from "../../components"
import { useStores } from "../../models" // @demo remove-current-line
import { colors } from "../../theme"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';


interface HomeScreenProps extends DemoTabScreenProps<"Home"> { }

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen(
    _props, // @demo remove-current-line
) {
    // @demo remove-block-start
    const { navigation } = _props
    const {
        authenticationStore: { logout, user },
    } = useStores();


    const [users, setUsers] = useState([]);
    const [oldUser, setOldUsers] = useState([]);
    const [chatLists, setChatLists] = useState([]);
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        getAllUsers();
        getChatList();
    }, [])

    const getAllUsers = () => {
        setLoading(true);

        database()
            .ref('/users')
            .once('value')
            .then(snapshot => {
                setUsers(Object.values(snapshot.val()).filter((usr) => usr?.id !== user.id));
                setOldUsers(Object.values(snapshot.val()).filter((usr) => usr?.id !== user.id));
                setLoading(false);
            });
    }


    const getChatList = async () => {
        database()
            .ref('/chatList/' + user.id)
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    setChatLists(Object.values(snapshot.val()));
                }
            });

    }

    if (loading) {
        return (<>
            <Text>Loading</Text>
        </>)
    }



    return (
        <>
            <Header
                title="Chats"
                titleMode="flex"
                titleStyle={$rightAlignTitle}
                RightActionComponent={
                    <View style={$customLeftAction}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Icon icon="bell" color="#FFFFFF" onPress={logout} />
                            <View style={{ width: 30, height: 30, borderRadius: 60, overflow: 'hidden' }}>
                                <Image source={{ uri: user?.img }} style={{ width: '100%', height: "100%", resizeMode: 'cover' }} />
                            </View>
                        </View>
                    </View>
                }
                safeAreaEdges={["top", "bottom"]}
                style={{ backgroundColor: '#115E55', elevation: 2 }}
            />
            <View style={$container}>

                <FlatList
                    data={chatLists}
                    keyExtractor={(user) => user?.id}
                    renderItem={({ item }) => {
                        console.log("🚀 ~ file: HomeScreen.tsx:97 ~ item:", item)
                        
                        return (
                            <TouchableOpacity style={$userContainer} onPress={() => navigation.navigate("Chat", {
                                chatItem: item
                            })}>
                                <View style={$leftColumn}>
                                    {/* Circular profile image */}
                                    <Image
                                        source={{ uri: item.img }}
                                        style={$profileImage}
                                    />
                                </View>
                                <View style={$rightColumn}>
                                    <Text style={$userName}>{item.name}</Text>
                                    <Text style={[$userName, { fontWeight: 'normal' }]}>
                                        {item.lastMsg.length > 30 ? item.lastMsg.slice(0, 30) + '...' : item.lastMsg}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    numColumns={1}
                    contentContainerStyle={$listContainer}
                />
            </View>
            <TouchableOpacity
                style={$fab}
                onPress={() => navigation.navigate("UserList")}
            >
                <Icon icon="community" color="white" />
            </TouchableOpacity>
        </>
    )
})

const $fab: ViewStyle = {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#115E55",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // Add shadow for Android
}

const $listContainer: ViewStyle = {
    // padding: 16,
}
const $userContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    gap: 15
}
const $leftColumn: ViewStyle = {
}
const $rightColumn: ViewStyle = {
    justifyContent: 'center',
    gap: 4
}
const $profileImage: ImageStyle = {
    width: 40,
    height: 40,
    borderRadius: 20, // To make it circular
}
const $userName: TextStyle = {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize'
}

const $customLeftAction: ViewStyle = {
    marginHorizontal: 10,

}

const $rightAlignTitle: TextStyle = {
    textAlign: "left",
    color: '#FFFFFF'
}
const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
    marginHorizontal: 16
}
