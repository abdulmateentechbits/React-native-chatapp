import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, ImageBackground, TextInput, TouchableOpacity } from "react-native"
import {
  Button, Header, Icon, // @demo remove-current-line
  Text,
} from "../../components"
import { isRTL } from "../../i18n"
import { useStores } from "../../models" // @demo remove-current-line
import { AppStackScreenProps } from "../../navigators" // @demo remove-current-line
import { colors, spacing } from "../../theme"
import { useHeader } from "../../utils/useHeader" // @demo remove-current-line
import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"

const chatbg = require("../../../assets/images/chatbg.png")

interface ChatScreenProps extends DemoTabScreenProps<"Chat"> { }

export const ChatScreen: FC<ChatScreenProps> = observer(function ChatScreen(
  _props, // @demo remove-current-line
) {
  // @demo remove-block-start
  const { navigation } = _props
  const {
    authenticationStore: { logout },
  } = useStores()

  function goNext() {
    navigation.navigate("Demo", { screen: "DemoShowroom" })
  }



  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <>
      <Header
        LeftActionComponent={
          <View style={{ marginHorizontal: 13 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <Icon icon="caretLeft" />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 30, height: 30, borderRadius: 60, borderWidth: 1, overflow: 'hidden' }}>
                  <Image source={chatbg} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                </View>
                <Text style={{ marginLeft: 8, color: '#000000', fontSize: 16, fontStyle: 'normal', fontWeight: 600 }}>Mateen</Text>
              </View>
            </View>
          </View>
        }


      />
      <View style={$container}>
        <ImageBackground source={chatbg} resizeMode="cover" style={$topContainer}>

        </ImageBackground>

        <View style={[$bottomContainer, $bottomContainerInsets]}>
          <View style={$inputContainer}>
            <TextInput
              style={$textInput}
              placeholder="Type your message..."
              multiline
            />
            <TouchableOpacity style={$sendButton}>
              <Icon icon="caretRight" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "88%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "11%",
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
}

const $inputContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
}
const $textInput: ViewStyle = {
  flex: 1,
  paddingHorizontal: 10,
}
const $sendButton: ViewStyle = {
  borderRadius: 50,
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 10,
}
