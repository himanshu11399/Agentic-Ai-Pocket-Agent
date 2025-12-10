import { KeyboardAvoidingView, Platform, StyleSheet, Text, Image, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoveLeftIcon, PlusIcon, Rocket, ImageDown, Copy, CopyCheck, X } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ToastAndroid, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { setDoc, doc } from 'firebase/firestore';



import { LinearGradient } from 'expo-linear-gradient';
import color from '@/shared/color';
import { useGeminiChat } from '../../hooks/getgeminichat';
import { firestoreDb } from '@/config/firbaseconfig';
import { useUser } from '@clerk/clerk-expo';

const ChatUI = () => {
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { user } = useUser();
  const { agentName, agentInitialText, agentPrompt, chatId, messagesList } = useLocalSearchParams<{
    agentName?: string;
    agentInitialText?: string;
    agentPrompt?: string;
    chatId?: string;
    messagesList?: []
  }>();
  const [docId, setDocId] = useState<string | null>();

  useEffect(() => {
    if (!chatId) {
      const id = Date.now().toString();
      setDocId(id);
    }
  }, [])



  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setcopied(true);
      // Show a small confirmation message
      if (Platform.OS === 'android') {
        ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
      } else {
        Alert.alert('Copied', 'Message copied to clipboard');
      }
      setTimeout(() => setcopied(false), 2500);
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      ToastAndroid.show(' Failed to Copy', ToastAndroid.SHORT);
    }
  }
  const { messages, sendMessage, loading, resetChat } = useGeminiChat(agentName, agentInitialText, agentPrompt, messagesList)

  // const [messages, setMessages] = useState<Message[]>(initialMesasage);
  const [input, setInput] = useState<string>('')
  const [copied, setcopied] = useState(false);
  const [file, setfile] = useState<string | null>();
  const [saveImg, setsaveinputimg] = useState<string | null>();

  //save History
  useEffect(() => {
    if (!messages?.length || !docId || !firestoreDb) return;

    const saveChat = async () => {
      try {
        await setDoc(
          doc(firestoreDb!, 'chats', docId),
          {
            userEmail: user?.primaryEmailAddress?.emailAddress ?? null,
            messages, // plural is clearer
            agentName,
            agentInitialText,
            agentPrompt,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Failed to save chat to Firestore:', error);
      }
    };

    saveChat();
  }, [messages, docId, user, firestoreDb]);


  //Image Picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      // aspect:[4,3],
      quality: 0.5
    });

    if (!result.canceled) {
      setsaveinputimg(result.assets[0].uri);
      setfile(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }

  }
  const deleteimage = () => {
    setsaveinputimg(null);
    setfile(null);
  }

  // Auto-scroll when new messages arrive
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);


  const newchatstart = () => {
    resetChat([{ role: "assistant", content: "Hello! How can I help you today?" }])
  }

  const handleSend = async () => {
    await sendMessage(input, file);
    setInput("");
    setfile(null);
    setsaveinputimg(null);
  };


  // --- JSX Rendering (The rest of your component) ---
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} >
      <LinearGradient
        colors={["#efc8d6ff", "#e3f2fd", "#ace6eeff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity style={{ marginRight: 20 }} onPress={() => router.back()}>
            <MoveLeftIcon size={24} color="#3692ff" />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{agentName} Agent</Text>
          <View style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end' }}>

            <TouchableOpacity disabled={loading} onPress={newchatstart}>
              <PlusIcon size={24} color="#3692ff" />
            </TouchableOpacity>
          </View>
        </View>

        {/**Chat Ui */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          style={{ flex: 1 }}
        >
          <FlatList
            ref={flatListRef} // Attach ref
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            pointerEvents="box-none"
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  item.role === "user"
                    ? styles.userMessage
                    : styles.assistantMessage,
                ]}
              >
                {item.role === 'assistant' ? (

                  item.content === 'Typing...' ? (
                    <View>
                      <ActivityIndicator size='small' color='#000' />
                    </View>
                  ) : (
                    <TouchableOpacity onLongPress={()=>copyToClipboard(item.content)}>
                      <View style={{}}>
                        {item.image && (
                          <Image
                            source={{ uri: item.image }}
                            style={{
                              width: 200,
                              height: 200,
                              borderRadius: 12,
                              marginBottom: 5,
                            }}
                            resizeMode="cover"
                          />
                        )}
                        <Text style={styles.assistancetextstyle}>{item.content}</Text>

                        {/* <TouchableOpacity onLongPress={() => copyToClipboard(item.content)} activeOpacity={0.6}>
                        {copied ? <CopyCheck size={20} color={'#d31f3aff'} /> : <Copy size={20} color={'#000'} />}
                      </TouchableOpacity> */}
                      </View>
                    </TouchableOpacity>
                  )
                ) : (
                  <View>
                    {item.image && (
                      <Image
                        source={{ uri: item.image }}
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 10,
                          marginBottom: 5,
                        }}
                      />
                    )}
                    <Text style={styles.userTextstyle}>{item.content}</Text>
                  </View>
                )}

              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          />
          {loading && <Text style={{ color: color.PRIMARY, marginRight: 10, alignSelf: 'center' }}>Typing...</Text>}


          {/**Search Bar */}
          <View>

            {/* //Preview Image */}
            {saveImg && (
              <View style={{ flexDirection: 'row', backgroundColor: color.PRIMARY, maxWidth: 150, paddingVertical: 5, borderRadius: 15, marginLeft: 16 }}>
                <Image source={{ uri: saveImg }} style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  marginLeft: 16
                }} />
                <TouchableOpacity onPress={deleteimage}>
                  <X />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.searchContainer}>

              {/**Input box */}

              <View style={styles.inputContainer}>

                {/**Add Image  */}
                <TouchableOpacity disabled={loading} onPress={pickImage}>
                  <ImageDown size={22} color={color.PRIMARY} />
                </TouchableOpacity>

                <TextInput
                  placeholder={loading ? "Waiting for response..." : "Type Your Message..."}
                  onChangeText={(v) => setInput(v)}
                  value={input}
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    maxHeight: 120,
                    paddingVertical: 8,
                  }}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                // editable={!loading} // Disable input while loading
                />
              </View>

              {/**Send Button */}
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: color.PRIMARY,
                  borderRadius: 25,
                  marginLeft: 10,
                  marginTop: 10,
                  opacity: input?.trim() && !loading ? 1 : 0.5,
                }}
                onPress={handleSend}
                disabled={(!input?.trim() && !file) || loading}
              // Disable button if no text or if loading
              >
                <Rocket size={26} color={color.WHITE} />
              </TouchableOpacity>

            </View>
          </View>

        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  )
}

export default ChatUI;

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
  },
  messageContainer: {
    maxWidth: '90%',
    marginVertical: 8,
  },
  userMessage: {
    backgroundColor: color.PRIMARY,
    alignSelf: 'flex-end',
    padding: 12,
    borderTopRightRadius: 0,
    borderRadius: 12,
    color: '#fff'

  },
  assistantMessage: {
    backgroundColor: '#d4cfcfff',
    alignSelf: 'flex-start',
    padding: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    color: '#000'

  }, userTextstyle: {
    color: '#fff',
    fontSize: 14
  }, assistancetextstyle: {
    color: '#000',
    fontSize: 14
  },
  inputContainer: {
    flex: 0.95,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    borderColor: '#aeacacff',
    marginTop: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 40,
    backgroundColor: "transparent",
  },

})
