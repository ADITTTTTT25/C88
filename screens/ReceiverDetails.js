import React from "react";
import { View, Text, TouchableOpacity,StyleSheet } from "react-native";
import firebase from "firebase";
import db from "../config";
import { Card, Header, Icon } from "react-native-elements";
export default class ReceiverDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      receiverId: this.props.navigation.getParam("details")["user_id"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      bookName: this.props.navigation.getParam("details")["book_name"],
      reason_for_requesting: this.props.navigation.getParam("details")[
        "reason_to_request"
      ],
      receiverName: "",
      receiverContact: "",
      receiverAddress: "",
      userName : ""
    };
  }
addNotification=()=>{
  var message = this.state.userName + " Has shown interest in donating the book...";
  db.collection("all_notification").add({
    "targeted_user_id":this.state.receiverId,
    "donor_id":this.state.userId,
    "request_id":this.state.requestId,
    "book_name":this.state.bookName,
    "date":firebase.firestore.FieldValue.serverTimestamp(),
    "notification_status":"unread",
    "message":message,
  })
}
getUserDetails=()=>{
  db.collection("users")
  .where("email", "==", this.state.userId)
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      this.setState({
        userName: doc.data().name + " " + doc.data().last_name
      });
    });
  });
}
  getReceiverDetails = () => {
    db.collection("users")
      .where("email", "==", this.state.receiverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            receiverName: doc.data().name,
            receiverContact: doc.data().contact,
            receiverAddress: doc.data().address,
          });
        });
      });
  };
  updateBookStatus = () => {
    db.collection("all_donation").add({
      "book_name": this.state.bookName,
      "request_id": this.state.requestId,
      "requested_by": this.state.receiverName,
      "donor_id": this.state.userId,
      "request_status": "Donor Interested",
    });
  };
  componentDidMount = () => {
    this.getReceiverDetails();
    this.getUserDetails();
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#696969"
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                centerComponent={{
                  text: "Donate Books",
                  style: { color: "90A5A9", fontSize: 20, fontWeight: "bold" },
                }}
                backgroundColor="#eaf8fe"
              />
            }
          />
        </View>
        <View style={{ flex: 0.3 }}>
        <Card>
          <Card.Title>{"Book Information"}</Card.Title>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Book Name: {this.state.bookName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Reason : {this.state.reason_for_requesting}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={{ flex: 0.3 }}>
          
          <Card>
          <Card.Title>{"Receiver Information"}</Card.Title>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name: {this.state.receiverName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Contact: {this.state.receiverContact}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Address: {this.state.receiverAddress}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.receiverId !== this.state.userId ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addNotification();
                this.updateBookStatus();
                this.props.navigation.navigate("MyDonation");
              }}
            >
              <Text>I Want To Donate!</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})