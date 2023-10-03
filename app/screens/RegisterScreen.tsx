import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import uuid from 'react-native-uuid';
import Toast from 'react-native-simple-toast';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';

interface RegisterScreenProps extends AppStackScreenProps<"Register"> { }

export const RegisterScreen: FC<RegisterScreenProps> = observer(function RegisterScreen(_props) {
  const {navigation} = _props;

  const authPasswordInput = useRef<TextInput>();
  const emailRef = useRef<TextInput>();
  const aboutRef = useRef<TextInput>();
  
  const [fullName, setFullName] = useState("");
  const [about, setAbout] = useState("");

  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, validationError },
  } = useStores()



  const error = isSubmitted ? validationError : ""

  async function register() {
    if (fullName === "" || authEmail === "" || authPassword === "" || about === "") {
      Toast.show('Fill all the fields.', Toast.LONG, {
        backgroundColor: 'blue',
      });
      return;
    }

    const data = {
      id: uuid.v4(),
      name: fullName,
      emailId: authEmail,
      password: authPassword,
      about: about,
      img:'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png',
      token:uuid.v4()
   
    }
    
    console.log("🚀 ~ file: RegisterScreen.tsx:50 ~ register ~ data:", data)



    try {

      console.log("firebase: ")
      database()
        .ref('/users/' + data.id)
        .set(data)
        .then(() => {
          Toast.showWithGravity(
            'Register Successfully',
            Toast.LONG,
            Toast.TOP,
          );

          setAuthEmail("");
          setAuthPassword("");
          setAbout("");
          setFullName("");
          navigation.navigate("Login");
          

        });

    } catch (error) {
      console.log("🚀 ~ file: RegisterScreen.tsx:59 ~ register ~ error:", error)

    }

  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
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
      <Text testID="login-heading" text="Register" preset="heading" style={$signIn} />
      {attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />}

      <TextField
        value={fullName}
        onChangeText={setFullName}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.fullNameLabel"
        placeholderTx="loginScreen.fullNamePlaceholder"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <TextField
        ref={emailRef}
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
        RightAccessory={PasswordRightAccessory}
      />
      <TextField
        ref={aboutRef}
        value={about}
        onChangeText={setAbout}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        multiline
        keyboardType="email-address"
        labelTx="loginScreen.aboutLabel"
        placeholderTx="loginScreen.aboutPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
      />

      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={register}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

// @demo remove-file
