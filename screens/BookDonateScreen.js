import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";
export default class BookDonateScreen extends Component {
  constructor() {
    super();
    this.state = {
      requestedBooksList: [],
    };
    this.requestRef = null;
  }

  getRequestedBooksList = () => {
    this.requestRef = db
      .collection("requested_books")
      .onSnapshot((snapshot) => {
        var requestedBooksList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          requestedBooksList: requestedBooksList,
        });
      });
  };

  componentDidMount() {
    this.getRequestedBooksList();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>{item.book_name}</ListItem.Title>

          <View style={styles.subtitleView}>
            <ListItem.Subtitle style={{ flex: 0.8 }}>
              {item.reason_to_request}
            </ListItem.Subtitle>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.props.navigation.navigate("ReceiverDetails", {
                  details: item,
                });
              }}
            >
              <Text style={{ color: "#ffff" }}>Donate</Text>
            </TouchableOpacity>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    return (
      <View style={styles.view}>
        <MyHeader title="Donate Books" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.requestedBooksList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Requested Books</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.requestedBooksList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  button: {
    flex: 0.2,
    width: 100,
    height: 30,   
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  subtitleView: {
    flex: 1,
    flexDirection: "row",
    padding: 2,
  },
  view: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
