import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { FlatList, Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import {
    Button, Header, Icon, // @demo remove-current-line
    Text,
    SectionList,
    TextField
} from "../../components"
import { isRTL } from "../../i18n"
import { useStores } from "../../models" // @demo remove-current-line
import { AppStackScreenProps } from "../../navigators" // @demo remove-current-line
import { colors, spacing } from "../../theme"
import { useHeader } from "../../utils/useHeader" // @demo remove-current-line
import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import database from '@react-native-firebase/database';


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
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("");


    useEffect(() => {
        getAllUsers()
    }, [])

    const getAllUsers = () => {
        setLoading(true);

        database()
            .ref('/users')
            .once('value')
            .then(snapshot => {
                console.log("🚀 ~ file: HomeScreen.tsx:39 ~ getAllUsers ~ snapshot:", snapshot.val());
                setUsers(Object.values(snapshot.val()).filter((usr) => usr?.id !== user.id));
                setOldUsers(Object.values(snapshot.val()).filter((usr) => usr?.id !== user.id));
                setLoading(false);
            });
    }


    const filterUsers = (val) => {
        setFilter(val);
        setUsers(oldUser.filter((usr) => usr?.name.match(val)))
    }
    const cancelFilter = () => {
        setUsers(oldUser);
        setFilter("")
    }

    const createChatLists = (data) => {
        const myData = {
            name: user.name,
            img: user.img,
            emailId: user.emailId,
            about: user.about,
            token: user.token,
            lastMsg: ""
        }
        try {
            database()
                .ref('/chatList/' + data?.id + "/" + user.id)
                .update(myData)
                .then(() => console.log('Data updated.'));

            delete data['password'];
            data.lastMsg = "";
            
            database()
                .ref('/chatList/' + user?.id + "/" + data.id)
                .update(data)
                .then(() => console.log('Data updated.'));
               
                navigation.navigate("Demo", { screen: "Chat" })
            
        } catch (error) {
             console.log("🚀 ~ file: HomeScreen.tsx:90 ~ createChatLists ~ error:", error)
        }
    }

    if (loading) {
        console.log("Loading............");
        return (<>
            <Text>Loading</Text>
        </>)
    }

    console.log("Users:  ", users)



    return (
        <>
            <Header
                title="Users"
                titleMode="flex"
                titleStyle={$rightAlignTitle}
                RightActionComponent={
                    <View style={$customLeftAction}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Icon icon="bell" onPress={logout} />
                            <View style={{ width: 30, height: 30, borderRadius: 60, overflow: 'hidden' }}>
                                <Image source={{ uri: user?.img }} style={{ width: '100%', height: "100%", resizeMode: 'cover' }} />
                            </View>
                        </View>
                    </View>
                }
                safeAreaEdges={["top"]}
            />
            <View style={$container}>
                {/* search filter */}
                <View style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
                    <Icon icon="search" style={{ flex: 1 }} />
                    <TextField
                        value={filter}
                        onChangeText={(val) => filterUsers(val)}
                        containerStyle={$textField}
                        autoCapitalize="none"
                        autoComplete="name"
                        autoCorrect={false}
                        keyboardType="default"
                        placeholder="Search by name..."
                    />
                    <TouchableOpacity style={{ flex: 1 }} onPress={cancelFilter}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={users}
                    keyExtractor={(user) => user.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={$userContainer} onPress={() => createChatLists(item)}>
                            <View style={$leftColumn}>
                                {/* Circular profile image */}
                                <Image
                                    source={{ uri: item.img }}
                                    style={$profileImage}
                                />
                            </View>
                            <View style={$rightColumn}>
                                <Text style={$userName}>{item.name}</Text>
                                <Text style={[$userName, { fontWeight: 'normal' }]}>{item.about}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    numColumns={1}
                    contentContainerStyle={$listContainer}
                />
            </View>
        </>
    )
})

const $textField: ViewStyle = {
    flex: 3,
    borderRadius: 20
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
}

const $customLeftAction: ViewStyle = {
    marginHorizontal: 10
}

const $rightAlignTitle: TextStyle = {
    textAlign: "left",
}
const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
    marginHorizontal: 16
}





