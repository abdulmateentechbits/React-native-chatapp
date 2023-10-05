import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import database from '@react-native-firebase/database';
import Toast from 'react-native-simple-toast';

interface LoginScreenProps extends AppStackScreenProps<"Login"> { }

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { navigation } = _props;
  const authPasswordInput = useRef<TextInput>()

  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, validationError, setUser },
  } = useStores()


  const error = isSubmitted ? validationError : ""

  function login() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) return

    try {
      database()
        .ref('/users')
        .orderByChild("emailId")
        .equalTo(authEmail)
        .once('value')
        .then(snapshot => {
          if (snapshot.val() === null) {
            console.log("🚀 ~ file: LoginScreen.tsx:40 ~ login ~ Invalid Email");
            Toast.showWithGravity(
              'Invalid Email',
              Toast.LONG,
              Toast.TOP,
            );
            return
          }

          let userData = Object.values(snapshot.val())["0"];
          console.log("🚀 ~ file: LoginScreen.tsx:51 ~ login ~ userData:", userData)

          if (userData?.password !== authPassword) {
            console.log("🚀 ~ file: LoginScreen.tsx:40 ~ login ~ Invalid Password");
            Toast.showWithGravity(
              'Invalid Password',
              Toast.LONG,
              Toast.TOP,
            );
            return
          }

          setAuthEmail("");
          setAuthPassword("");
          setUser(userData);
          setAuthToken(userData?.token);

        });

    } catch (error) {
      console.log("🚀 ~ file: LoginScreen.tsx:47 ~ login ~ error:", error)
      setIsSubmitted(false)
      setAuthPassword("")
      setAuthEmail("")
    }


    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.


    // We'll mock this with a fake token.
    // setAuthToken(String(Date.now()))
  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.appPrimaryTextColor}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={{marginBottom:15}}>
        <Text testID="login-heading" text="Whatsapp Lite" preset="heading" style={[$signIn, { textAlign: 'center',color:colors.palette.appPrimaryTextColor }]} />
        {/* <Text testID="login-heading" text="Sign In" preset="heading" style={[$signIn, { textAlign: 'center',color:colors.palette.appPrimaryTextColor }]} /> */}
      </View>

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen.passwordFieldLabel"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-button"
        text="Login"
        style={$tapButton}
        preset="reversed"
        onPress={login}
      />
      <View style={{ marginTop: 10, alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text>Create account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: 'red' }}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  flex: 1,
  justifyContent: 'center'
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
  backgroundColor: colors.palette.appPrimaryColor
}

// @demo remove-file
