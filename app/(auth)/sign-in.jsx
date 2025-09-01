import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { authStyles } from '../../assets/styles/auth';   
import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';
import IonIcons from '@expo/vector-icons/Ionicons';

const SignInScreen = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if(!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập cả email và mật khẩu.");
      return;
    }

    if(!isLoaded) return;
    setLoading(true);
    try{
      const signInAttempt = await signIn.create({
        identifier: email,
        password
      })

      if(signInAttempt.status === "complete"){
        setActive({ session: signInAttempt.createdSessionId })
      }else{
        Alert.alert("Lỗi", "Đăng nhập không thành công. Vui lòng thử lại.");
        console.log(JSON.stringify(signInAttempt, null, 2));
      }
    }catch(error){
      Alert.alert("Lỗi", "Không tìm thấy tài khoản");
      console.log(JSON.stringify(error, null, 2));
    }finally{
      setLoading(false);
    }
  }

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
      style={authStyles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >

        <ScrollView
        contentContainerStyle={authStyles.ScrollView}
        showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image source={require('../../assets/images/i1.png')} 
            style={authStyles.image} 
            contentFit="cotain"
            />
          </View>
          <Text style={authStyles.title}>Vui Lòng Đăng Nhập</Text>
          
          {/* FORM CONTAINER */}
          <View style={authStyles.formContainer}>
            {/* EMAIL INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
              style={authStyles.textInput}
              placeholder="Nhập Email"
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'>
              </TextInput>
            </View>
            
            {/* PASSWORD INPUT */}
          <View style={authStyles.inputContainer}>
            <TextInput
            style={authStyles.textInput}
            placeholder="Nhập Mật Khẩu"
            placeholderTextColor={COLORS.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize='none'>
            </TextInput>

            <TouchableOpacity
            style={authStyles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            >
              <IonIcons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>
            {/* SIGN IN BUTTON */}
            <TouchableOpacity
            style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Đang Đăng Nhập..." : "Đăng Nhập"}
              </Text>
            </TouchableOpacity>

            {/* SIGN UP LINK */}
            <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={() => router.push("/(auth)/sign-up")}
            >
              <Text style={authStyles.linkText}>
                Chưa có tài khoản? <Text style={authStyles.link}>Đăng ký</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  )
}

export default SignInScreen