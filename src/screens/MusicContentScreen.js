import React, { Component } from "react";
import { ScrollView, Modal, Alert, findNodeHandle, Image } from "react-native";
import {
  Container,
  StyleProvider,
  Text,
  View,
  Button,
  Item
} from "native-base";
import Pdf from 'react-native-pdf';
import { Row, Grid } from "react-native-easy-grid";
import getTheme from "../themes/components";
import scorenshareTheme from "../themes/variables/scorenshareTheme";
import { styles } from "../themes/variables/customStyles";
import FooterPlayer from "../components/Music/FooterPlayer";
import { LoaderOverlay, ErrorOverlay } from "../components/MiscComponents";
import { GetData } from "../services/ApiCaller";
import { BlurView } from "react-native-blur";

class MusicContentScreen extends Component {
  componentDidMount() {
    this.initMusicContentPage();
  }

  constructor(props) {
    super(props);
    this.state = {
      viewRef: 0,
      modalVisible: false,
      isLoading: true,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      paused: true,
      totalLength: 1,
      currentPosition: 0,
      selectedTrack: 0,
      repeatOn: false,
      shuffleOn: false,
      isChanging: true,
      musicObj: []
    };
  }

  initMusicContentPage = () => {
    const musId = this.props.navigation.getParam("id", "NULL");
    this.setState({ isLoading: true });
    GetData("music/collection/" + musId + "?resType=json")
      .then(result => {
        let response = result;
        this.setState({
          isLoading: false,
          ajaxCallState: 200,
          ajaxCallError: null,
          catalogue: response.catalogue,
          musicObj: response.musicObj
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          ajaxCallState: "NET_ERR",
          ajaxCallError: error.message
        });
      });
  };

  setModalVisible(visible) {
    if (visible == undefined) {
      visible = !this.state.modalVisible;
    }
    this.setState({ modalVisible: visible });
  }

  imageLoaded() {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
    alert(findNodeHandle(this.backgroundImage));
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title")
    };
  };

  render() {
    const { navigate } = this.props.navigation;
    const tracks = [
      {
        title: "Stressed Out",
        artist: "Twenty One Pilots",
        albumArtUrl:
          "http://36.media.tumblr.com/14e9a12cd4dca7a3c3c4fe178b607d27/tumblr_nlott6SmIh1ta3rfmo1_1280.jpg",
        audioUrl:
          "http://dl.fazmusics.in/Ali/music/aban/hot%20100%20.7%20nov%202015(128)/Twenty%20One%20Pilots%20-%20Stressed%20Out.mp3"
      },
      {
        title: "Love Yourself",
        artist: "Justin Bieber",
        albumArtUrl:
          "http://arrestedmotion.com/wp-content/uploads/2015/10/JB_Purpose-digital-deluxe-album-cover_lr.jpg",
        audioUrl:
          "http://srv2.dnupload.com/Music/Album/Justin%20Bieber%20-%20Purpose%20(Deluxe%20Version)%20(320)/Justin%20Bieber%20-%20Purpose%20(Deluxe%20Version)%20128/05%20Love%20Yourself.mp3"
      },
      {
        title: "Hotline Bling",
        artist: "Drake",
        albumArtUrl:
          "https://upload.wikimedia.org/wikipedia/commons/c/c9/Drake_-_Hotline_Bling.png",
        audioUrl:
          "http://dl2.shirazsong.org/dl/music/94-10/CD%201%20-%20Best%20of%202015%20-%20Top%20Downloads/03.%20Drake%20-%20Hotline%20Bling%20.mp3"
      },
      {
        title: "Heart to love",
        artist: "Passanger",
        albumArtUrl:
          "https://upload.wikimedia.org/wikipedia/commons/c/c9/Drake_-_Hotline_Bling.png",
        audioUrl:
          "https://naijaextra.com/wp-content/uploads/2018/07/Passenger-Heart-To-Love.mp3"
      }
    ];

    return (
      <StyleProvider style={getTheme(scorenshareTheme)}>
        {this.state.isLoading ? (
          <LoaderOverlay text={"Fetching... Please wait"} />
        ) : this.state.ajaxCallState == "NET_ERR" ? (
          <ErrorOverlay
            text={this.state.ajaxCallError}
            reloadPage={this.initCatalogueContentPage}
          />
        ) : (
          <Container>
            <Grid style={[{ flex: 1, flexDirection: "column" }]}>
              <Row
                style={[
                  styles.bgDark,
                  {
                    flex: 3,
                    flexDirection: "row"
                  }
                ]}
              >
                <ScrollView>
                <View style={styles.PdfContainer}>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        console.log(error);
                    }}
                    style={styles.pdf}/>
            </View>
                </ScrollView>
              </Row>
              <FooterPlayer
                content={this.state.music}
                tracks={tracks}
                selectedTrack={this.state.selectedTrack}
                currentPosition={this.state.currentPosition}
                totalLength={this.state.totalLength}
                paused={this.state.paused}
                trackPaused={() => this.setState({ paused: true })}
                trackPlayed={() => this.setState({ paused: false })}
                Shuffle={() =>
                  this.setState({ shuffleOn: !this.state.shuffleOn })
                }
                shuffleState={this.state.shuffleOn}
                Repeat={() => this.setState({ repeatOn: !this.state.repeatOn })}
                repeatState={this.state.repeatOn}
                forwardDisabled={this.state.selectedTrack === tracks.length - 1}
                isChanging={this.state.isChanging}
                toggleModal={() => {
                  this.setModalVisible();
                }}
              />
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  Alert.alert("This modal will be closed in a sec");
                  this.setModalVisible(false);
                }}
              >
                <View
                  style={[
                    styles.flexRow_1,
                    {
                      flexDirection: "column-reverse",
                      backgroundColor: "rgba(0,0,0,.94)"
                    }
                  ]}
                >
                  <View style={{ backgroundColor: "red" }}>
                    <Text>Hello World!</Text>
                    <Text>Hi, I am a tiny menu item</Text>

                    <Button
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                      }}
                    >
                      <Text>Hide Modal</Text>
                    </Button>
                  </View>
                </View>
              </Modal>
            </Grid>
          </Container>
        )}
      </StyleProvider>
    );
  }
}
export default MusicContentScreen;
