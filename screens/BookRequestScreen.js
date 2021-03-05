import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  TouchableHighlight
} from "react-native";
import {BookSearch} from 'react-native-google-books';
import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";
export default class BookRequestScreen extends React.Component {
  //AIzaSyD2trvrp7b12XNK1FCQk49U3Yu6uk4l4FI
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookName: "",
      reasonToRequest: "",
      isBookRequestActive:false,
      userDocId:"",
      bookStatus:'',
      requestedBookName:'',
      docId:'',
      userDocId:'',
      requestId:'',
      dataSource:'',
      showFlatList:false
      };
  }
  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (bookName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    await db.collection("requested_books").add({
      "user_id": userId,
      "book_name": bookName,
      "reason_to_request": reasonToRequest,
      "request_id": randomRequestId,
      "book_status":"requested",
      "date":firebase.firestore.FieldValue.serverTimestamp()
    });
  
     this.getBookRequest();
    db.collection("users").where("email","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection("users").doc(doc.id).update({
      isBookRequestActive: true
      })
    })
  })
  this.setState({
    bookName: "",
    reasonToRequest: "",
  });

    return Alert.alert("Book Requested Successfully");
  };
  getIsBookRequestActive=()=>{
    db.collection("users").where("email","==",this.state.userId).onSnapshot((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          isBookRequestActive: doc.data().isBookRequestActive,
          userDocId : doc.id
        })
      })
    })
  }
  getBookRequest=()=>{
    db.collection("requested_books").where("user_id","==",this.state.userId).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().book_status !== "received"){
          this.setState({
            requestedBookName:doc.data().book_name,
            bookStatus:doc.data().book_status,
            docId: doc.id,
            requestId:doc.data().request_id
          })
        }
      })
    });
  }
  
  componentDidMount=async()=>{
    this.getIsBookRequestActive();
    this.getBookRequest()
    
  }

  sendNotification=()=>{
    db.collection("users").where("email","==",this.state.userId).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().name
        var lastname = doc.data().last_name
        db.collection("all_notification").where("request_id","==",this.state.requestId).get().then((snapshot)=>{
          snapshot.forEach((doc)=>{
            var donorId = doc.data().donor_id
            var bookName =  doc.data().book_name
            db.collection("all_notification").add({
              "target_user_id":donorId,
              "message":  name + " " + lastname + " received the book " + bookName,
              "notification_status":"unread",
              "book_name":bookName
            })
          })
        })
      })
    })
  }

  updateBookRequestStatus=()=>{
    db.collection("request_books").doc(this.state.docId).update({
      "book_status":"received"
    })

    db.collection('users').doc(this.state.userDocId).update({
      "isBookRequestActive":false
    })


  }

  receiveBooks=(bookName)=>{
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection('received_books').add({
      "user_id":userId,
      "book_name":bookName,
      "request_id":requestId,
      "bookStatus":"received"
    })
  }
  renderItem=({item,i})=>{
    return(
      <TouchableHighlight style={{alignItems:"center",backgroundColor:"#DDDDD",padding:10,width:" 90%"}}
        activeOpacity={0.6}
        underlayColor="#DDDDD"
        onPress={
          ()=>{
            this.setState({
              showFlatList:true,
              bookName:item.volumeInfo.title
            })
          }
        }
        bottomDivider
      >
        <Text>
        {item.volumeInfo.title}
        </Text>
      </TouchableHighlight>
    )
  }
  async getBooksFromApi(bookName){
    console.log(bookName);
    this.setState({
      bookName: bookName,
    });
    if(bookName.length >2){
      var books = await  BookSearch.searchBook(bookName,'AIzaSyAV6CZ9luleYpvAKf5lmeVN6TYnhEhz3OU');
      console.log(books);
      this.setState({
        dataSource:books.data,
        showFlatList:true
      })
    }
  }
  render() {
    if(this.state.isBookRequestActive == true){
      return (
        //Status Screen
        <View style={{flex:1,justifyContent:"center"}}>
          <View style={{borderColor:"Orange",borderWidth:2,justifyContent:"center", alignItems:'center',padding:10,margin:10}}>
            <Text>Book Name:</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View style={{borderColor:"Orange",borderWidth:2,justifyContent:"center", alignItems:'center',padding:10,margin:10}}>
            <Text>Book Status:</Text>
            <Text>{this.state.bookStatus}</Text>
          </View>
          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}} onPress={
            ()=>{
              this.sendNotification()
              this.updateBookRequestStatus()
              this.receiveBooks(this.state.requestedBookName)
            }
          }>
            <Text>
              I have received the book!
            </Text>
          </TouchableOpacity>
        </View>
      )
    }else{
    
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Request Books" />
        <KeyboardAvoidingView style={styles.keyBoardStyle}>
          <TextInput
            style={styles.formTextInput}
            placeholder={"Enter Book Name..."}
            onChangeText={(text) => {
              this.getBooksFromApi(text);
            }}
            value={this.state.bookName}
          />
          {

            this.state.showFlatList ? (<FlatList
            styles={{marginTop:10}}
            data={this.state.dataSource}
            renderItem={this.renderItem}
            keyExtractor={({item, index})=>index.toString()}
            />):(
            <View style = {{alignItems:"center"}}>
                  <TextInput
              style={[styles.formTextInput, { height: 300 }]}
              placeholder={"Why Do You Need The Book?"}
              multiline={true}
              numberOfLines={8}
              onChangeText={(text) => {
                this.setState({
                  reasonToRequest: text,
                });
              }}
              value={this.state.reasonToRequest}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addRequest(this.state.bookName, this.state.reasonToRequest);
              }}
            >
              <Text>Request</Text>
            </TouchableOpacity>
            </View>
        )
          }
        
        </KeyboardAvoidingView>
      </View>
    );
          }
  }
}
const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
});
