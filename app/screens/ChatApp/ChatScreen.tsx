import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Image, TextStyle, View, ViewStyle, ImageBackground, TextInput, TouchableOpacity } from "react-native"
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

const chatbg = require("../../../assets/images/chatbg.png")

interface ChatScreenProps extends AppStackScreenProps<"Chat"> { }

export const ChatScreen: FC<ChatScreenProps> = observer(function ChatScreen(
  _props,
) {

  const { navigation, route: { params } } = _props
  const {
    authenticationStore: { logout, user },
  } = useStores();
  const [message, setMessage] = useState("");

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const sendMessage = () => {

    const messageBody = {
      roomId: params?.chatItem?.roomId,
      message: message,
      from: user.id,
      to: params?.chatItem?.id,
      sentTime: moment().format(),
      msgType: 'text'
    }
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


  return (
    <>
      <Header
        LeftActionComponent={
          <View style={{ marginHorizontal: 13 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <Icon icon="caretLeft" onPress={() => navigation.goBack()} />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 30, height: 30, borderRadius: 60, borderWidth: 1, overflow: 'hidden' }}>
                  <Image source={{ uri: params?.chatItem?.img }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                </View>
                <Text style={{ marginLeft: 8, color: '#000000', fontSize: 16, fontStyle: 'normal', fontWeight: 600 }}>{params?.chatItem?.name}</Text>
              </View>
            </View>
          </View>
        }


      />
      <View style={[$container, $bottomContainerInsets]}>
        <ImageBackground source={chatbg} resizeMode="cover" style={$topContainer}>
          <View>
            <View style={$receiverMessage}>
              <Text style={$messageText}>Hello!</Text>
            </View>

            {/* Sender's Message */}
            <View style={$senderMessage}>
              <Text style={$messageText}>Hi there!</Text>
            </View>
          </View>
          <View style={$inputContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              style={$textInput}
              placeholder="Message..."
              multiline
            />
            <TouchableOpacity disabled={!message} style={[$sendButton, !message && { backgroundColor: '#12CC8F' }]} onPress={sendMessage}>
              <Icon icon="sent" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </>
  )
})
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

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "11%",
  backgroundColor: 'transparent',
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
}

const $inputContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 10,
  backgroundColor: 'transparent',
  position: 'absolute',
  bottom: 10,
  left: 0,
  right: 0

}
const $textInput: ViewStyle = {
  flex: 1,
  paddingHorizontal: 15,
  borderWidth: 1,
  borderRadius: 50
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
