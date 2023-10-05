import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Image, TextStyle, View, ViewStyle, ImageBackground, TextInput, TouchableOpacity, Dimensions } from "react-native"
import {
  Header, Icon, // @demo remove-current-line
  Text,
} from "../../components"
import { useStores } from "../../models" // @demo remove-current-line
import { AppStackScreenProps } from "../../navigators" // @demo remove-current-line
import { colors, spacing } from "../../theme"
import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"
import moment from 'moment';
import database from '@react-native-firebase/database';
import { FlatList } from "react-native-gesture-handler"
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

const chatbg = require("../../../assets/images/chatbg.png");

const { height: windowHeight } = Dimensions.get('window');

interface ChatScreenProps extends AppStackScreenProps<"Chat"> { }

export const ChatScreen: FC<ChatScreenProps> = observer(function ChatScreen(
  _props,
) {

  const { navigation, route: { params } } = _props
  const chatData = params?.chatItem
  console.log("🚀 ~ file: ChatScreen.tsx:26 ~ chatData:", chatData)



  const {
    authenticationStore: { user },
  } = useStores();
  const [message, setMessage] = useState("");
  const [allChats, setAllChats] = useState([]);
  const [flatListHeight, setFlatListHeight] = useState(windowHeight - 160);

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"]);


  useEffect(() => {
    const onChildAdd = database()
      .ref('/messages/' + params?.chatItem?.roomId)
      .on('child_added', snapshot => {
        console.log('A new node has been added', snapshot.val());
        setAllChats(prev => [snapshot.val(), ...prev])
      });

    // Stop listening for updates when no longer required
    return () => database().ref('/messages/' + params?.chatItem?.roomId).off('child_added', onChildAdd);
  }, [params?.chatItem?.roomId]);


  const sendMessage = () => {

    const messageBody = {
      roomId: params?.chatItem?.roomId,
      message: message,
      from: user.id,
      to: params?.chatItem?.id,
      sentTime: moment().format(),
      msgType: 'text'
    }
    updateMessageToDatabase(messageBody)

  }

  const updateMessageToDatabase = async (messageBody)=>{
    const newReference = database().ref('/messages/' + params?.chatItem?.roomId).push();
    console.log('Auto generated key: ', newReference.key);
    messageBody.id = newReference.key
    newReference
      .set(messageBody)
      .then(() => {
        let myData = {
          lastMsg: message,
          sentTime: messageBody.sentTime
        }
        database()
          .ref('/chatList/' + params?.chatItem?.id + "/" + user.id)
          .update(myData)
          .then(() => console.log('Data updated.'));
        database()
          .ref('/chatList/' + user.id + "/" + params?.chatItem?.id)
          .update(myData)
          .then(() => console.log('Data updated.'));
        setMessage("");
      });
  }

  const uploadImage = () => {
    ImagePicker.openPicker({
      cropping: false
    }).then(async image => {

      let imgName = image.path.substring(image.path.lastIndexOf('/') + 1);
      let ext = imgName.split('.').pop();
      let name = imgName.split('.')[0];
      const newName = name + Date.now() + '.' + ext
      const reference = storage().ref('chatMedia/' + newName);
      await reference.putFile(image.path);
      const mediaUrl = await storage().ref('chatMedia/' + newName).getDownloadURL();
      console.log("🚀 ~ file: ChatScreen.tsx:102 ~ uploadImage ~ url:", mediaUrl)
      const messageBody = {
        roomId: params?.chatItem?.roomId,
        message: mediaUrl,
        from: user.id,
        to: params?.chatItem?.id,
        sentTime: moment().format(),
        msgType: 'image'
      }
      updateMessageToDatabase(messageBody)

    });
  }

  const renderMessageContent = (item) => {
    if (item.msgType === 'image') {
      return (
        <Image source={{ uri: item.message }} style={{ width: 200, height: 200 }} />
      );
    } else {
      return (
        <Text style={$messageText}>{item.message}</Text>
      );
    }
  }


  return (
    <>
      <Header
        LeftActionComponent={
          <View style={{ marginHorizontal: 13 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <Icon icon="caretLeft" color="#FFFFFF" onPress={() => navigation.goBack()} />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 30, height: 30, borderRadius: 60, borderWidth: 1, overflow: 'hidden' }}>
                  <Image source={{ uri: params?.chatItem?.img }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                </View>
                <Text style={{ marginLeft: 8, color: '#FFFFFF', fontSize: 16, fontStyle: 'normal', fontWeight: 600 }}>{params?.chatItem?.name}</Text>
              </View>
            </View>
          </View>

        }
        safeAreaEdges={["top"]}
        style={{ backgroundColor: '#115E55', elevation: 2 }}

      />
      <View style={[$container, $bottomContainerInsets]}>
        <ImageBackground source={chatbg} resizeMode="cover" style={[$topContainer, $bottomContainerInsets]}>

          <View style={{ marginTop: 10 }}>
            <FlatList
              data={allChats}
              renderItem={({ item }) => {
                console.log("🚀 ~ file: ChatScreen.tsx:112 ~ item:", item);

                return (
                  <>
                    {item.from === user.id ? (
                      <View
                        style={[$triangleShapeCSS, $right]}
                      />
                    ) : (
                      <View
                        style={[$triangleShapeCSS, $left]}
                      />
                    )}
                    <View style={item.from === user.id ? $senderMessageContainer : $receiverMessageContainer}>
                      <View style={item.from === user.id ? $senderMessage : $receiverMessage}>
                         {renderMessageContent(item)}
                        <View
                          style={[$mainView, {
                            justifyContent: 'flex-end',
                          }]}
                        >
                          <Text style={{
                            fontSize: 7,
                            color: item.from === user.id ? "#000000" : "#000000"
                          }}>
                            {moment(item.sentTime).format('hh:mm A')}
                          </Text>
                          <Icon
                            icon="markRead"
                            size={15}
                            style={{ marginLeft: 5 }}
                          />

                        </View>
                      </View>
                    </View>
                  </>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              inverted
              showsVerticalScrollIndicator={false}
              style={{ height: flatListHeight }}
            />

          </View>


          <View style={$inputContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              style={$textInput}
              placeholder="Message..."
              multiline
              placeholderTextColor="#FFFFFF"

            />
            <TouchableOpacity style={[$sendButton, !message && { backgroundColor: '#12CC8F' }]} onPress={uploadImage}>
              <Icon icon="attachment" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity disabled={!message} style={[$sendButton, !message && { backgroundColor: '#12CC8F' }]} onPress={sendMessage}>
              <Icon icon="sent" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </>
  )
})

const $mainView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2
}

const $triangleShapeCSS: ViewStyle = {
  position: 'absolute',
  // top: -3,
  width: 0,
  height: 0,
  // borderBottomLeftRadius:5,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderLeftWidth: 15,
  borderRightWidth: 5,
  borderBottomWidth: 20,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  // borderBottomColor: '#757474'
}
const $left: ViewStyle = {
  borderBottomColor: "#FFFFFF",
  left: 0,
  bottom: 10,
  transform: [{ rotate: '0deg' }]
}
const $right: ViewStyle = {
  borderBottomColor: "#DBF8C8",
  right: -2,
  // top:0,
  bottom: 8,
  transform: [{ rotate: '103deg' }]
}
const $receiverMessageContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start', // Align sender messages to the left
  marginBottom: 5,
};

const $senderMessageContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-end', // Align receiver messages to the right
  marginBottom: 5,
};
const $messageText: TextStyle = {
  color: 'black',
  fontSize: 16,
}
const $receiverMessage: ViewStyle = {
  backgroundColor: '#FFFFFF',
  alignSelf: 'flex-start',
  borderRadius: 5,
  paddingHorizontal: 10,
  paddingVertical: 5,
  margin: 5,
}
const $senderMessage: ViewStyle = {
  backgroundColor: '#DBF8C8',
  alignSelf: 'flex-end',
  borderRadius: 5,
  paddingHorizontal: 10,
  paddingVertical: 5,
  margin: 5,
}
const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  paddingHorizontal: spacing.lg,
  
}


const $inputContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 10,
  paddingVertical: 10,
  backgroundColor: '#115E55',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,

}
const $textInput: ViewStyle = {
  flex: 1,
  paddingHorizontal: 15,
  borderWidth: 1,
  borderRadius: 50,
  borderColor: '#FFFFFF',

}
const $sendButton: ViewStyle = {
  borderRadius: 40,
  width: 45,
  height: 45,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 10,
  backgroundColor: '#12BC7E'

}
