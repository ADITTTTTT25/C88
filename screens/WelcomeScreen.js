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
} from "react-native";
import db from "../config";
import firebase from "firebase";
import SantaClaus from "../components/SantaClaus";
export default class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "test@gmail.com",
      password: "qwertyui",
      firstName: "",
      lastName: "",
      contact: "",
      address: "",
      confirmPassword: "",
      isModalVisible: false,
    };
  }
  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: "100%" }}>
            <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
              <Text style={styles.modalTitle}>Registration</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={"First Name"}
                maxLength={10}
                onChangeText={(text) => {
                  this.setState({
                    firstName: text,
                  });
                }}
                value={this.state.firstName}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Last Name"}
                maxLength={10}
                onChangeText={(text) => {
                  this.setState({
                    lastName: text,
                  });
                }}
                value={this.state.lastName}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Contact"}
                maxLength={10}
                keyboardType={"numeric"}
                onChangeText={(text) => {
                  this.setState({
                    contact: text,
                  });
                }}
                value={this.state.contact}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Address"}
                multiline={true}
                onChangeText={(text) => {
                  this.setState({
                    address: text,
                  });
                }}
                value={this.state.address}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Email Address"}
                keyboardType={"email-address"}
                onChangeText={(text) => {
                  this.setState({
                    email: text,
                  });
                }}
                value={this.state.email}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Password"}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
                value={this.state.password}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Confirm Password"}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    confirmPassword: text,
                  });
                }}
                value={this.state.confirmPassword}
              />
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                    this.signUp(
                      this.state.email,
                      this.state.password,
                      this.state.confirmPassword
                    );
                  }}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    this.setState({
                      isModalVisible: false,
                    });
                  }}
                >
                  <Text style={{ color: "#ff5722" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };
  signIn = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate("DonateBooks");
      })
      .catch((error) => {
        console.log(error.message);
        return Alert.alert(error.message);
      });
  };
  signUp = async (email, password, confirmPassword) => {
    if (password != confirmPassword) {
      return Alert.alert("Passwords Do Not Match /n Check Password");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          if (response) {
            db.collection("users").add({
              "name": this.state.firstName,
              "last_name": this.state.lastName,
              "contact": this.state.contact,
              "email": this.state.email,
             " address": this.state.address,
             "isBookRequestActive":false
            });
            return Alert.alert("User Added Successfully", "", [
              {
                text: "OK",
                onPress: () => {
                  this.setState({ isModalVisible: false });
                },
              },
            ]);
          }
        })
        .catch((error) => {
          return Alert.alert(error.message);
        });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {this.showModal()}
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <SantaClaus />
          <Text style={styles.title}>Book Santa</Text>
        </View>
        <View>
          <TextInput
            style={styles.loginBox}
            placeholder="ABC@example.com"
            onChangeText={(text) => {
              this.setState({
                email: text,
              });
            }}
            keyboardType="email-address"
            value={this.state.email}
          />
          <TextInput
            style={styles.loginBox}
            placeholder="Password"
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
            secureTextEntry={true}
            value={this.state.password}
          />
          <TouchableOpacity
            style={[styles.button, { marginBottom: 20, marginTop: 20 }]}
            onPress={() => {
              this.signIn(this.state.email, this.state.password);
            }}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({
                isModalVisible: true,
              });
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8BE85",
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 65,
    fontWeight: "300",
    paddingBottom: 30,
    color: "#ff3d00",
  },
  loginBox: {
    width: 300,
    height: 40,
    borderBottomWidth: 1.5,
    borderColor: "#ff8a65",
    fontSize: 20,
    margin: 10,
    paddingLeft: 10,
  },
  KeyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 30,
    color: "#ff5722",
    margin: 50,
  },
  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 80,
    marginBottom: 80,
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
  registerButton: {
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
  },
  registerButtonText: { color: "#ff5722", fontSize: 15, fontWeight: "bold" },
  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    alignSelf: "center",
  },
  button: {
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#ff9800",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
    padding: 10,
  },
  buttonText: { color: "#ffff", fontWeight: "200", fontSize: 20 },
});
