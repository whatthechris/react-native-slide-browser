import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  WebView,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  FlatList,
  Image,
} from 'react-native'
import {Constants, Svg, Path, G} from 'expo';
import { ViewPagerAndroid, DrawerLayout, RectButton, LongPressGestureHandler, State} from 'react-native-gesture-handler';

let screenWidth = Dimensions.get('window').width;
const initialUrl = 'https://github.com';
const numColumns = 3;

var favListData = [
	{key: 'https://google.ca'},
  {key: 'https://facebook.com'},
] ;

export default class Example extends Component {

	state = {
		url: initialUrl,
	};

	submitForm = () => {
		this.setState({ url: "https://" + this.state.urlValue})
		this._urlDrawer.closeDrawer()
		this._tabDrawer.closeDrawer()
	};

	onWebLoad = () => {
		this.setState({ urlValue : initialUrl})
	}

	_onNavigationStateChange(webViewState){
		this.setState({ urlValue : webViewState.url})
	}

	tabToSite =(item)=>{
		this.setState({ url: item.key})
		this._tabDrawer.closeDrawer()
  }

	goToSite =(item)=>{
		this.setState({ url: item.key})
		this._urlDrawer.closeDrawer()
		this._tabDrawer.closeDrawer()
  }

	focusURL = () => {
		this.urlInput.focus()
	}

	blurURL = () => {
		this.urlInput.blur()
	}

	clearURLBar = () => {
		this.urlInput.clear()
	}

	addToFavs = () => {
		favListData.push({key: this.state.url})
		alert(this.state.url + " has been added to your favourites")
	}
	deleteFav() {
	  alert("Favourite was removed")
	}

  render() {
		const { url } = this.state;

		const tabBarView = (
      <View style={styles.tabList}>
				<FlatList
					contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}
					data={[
						{key: 'https://google.ca'},
						{key: 'https://mashable.com'},
						{key: 'https://newyorktimes.com'},
						{key: 'https://vice.com'},
					]}
					renderItem={({item}) =>
						<RectButton
							style={styles.tabButton}
							onPress={ this.tabToSite.bind(this, item) }
						>
						<Image
							style={{width: 20, height: 20}}
							source={{uri: 'https://www.google.com/s2/favicons?domain_url=' + item.key}}
						/>
				</RectButton>
					}
				/>
			{/*Add Favourite Button*/}
				<RectButton
						style={styles.tabButton}
						onPress={this.addToFavs}
					>
					<Svg height={20} width={20}>
							<Svg.Path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
					</Svg>
				</RectButton>
      </View>
    );

		const urlView = (
			<KeyboardAvoidingView
				style={{ flex: 1, backgroundColor: '#EDEDF1' }}
				behavior="padding"
			>
				<Text style={{ color: "#757788", textAlign: "center", marginVertical: 15}}>
					Favourites
				</Text>
				<FlatList
					keyboardShouldPersistTaps={'handled'}
					style={styles.favList}
          data={favListData}
					extraData={this.state}
					numColumns={numColumns}
          renderItem={({item}) =>
					<LongPressGestureHandler
				      onHandlerStateChange={({ nativeEvent }) => {
				        if (nativeEvent.state === State.ACTIVE) {
				          this.deleteFav()
				        }
				      }}
				      minDurationMs={600}>
						<RectButton
							style={styles.favButton}
							onPress={ this.goToSite.bind(this, item) }
						>
							<Image
								style={{width: 30, height: 30}}
								source={{uri: 'https://www.google.com/s2/favicons?domain_url=' + item.key}}
							/>
						</RectButton>
						</LongPressGestureHandler>
					}
			  />
			<View
				style={{
						flexDirection: 'row', alignItems: 'center'
				}}>
			<TextInput
        ref={ref => (this.urlInput = ref)}
				style={styles.input}
				underlineColorAndroid="transparent"
        value={this.state.urlValue}
				returnKeyType="go"
				autoCapitalize="none"
        onChangeText={urlValue => this.setState({urlValue})}
        onSubmitEditing={this.submitForm}
      />
			<RectButton
				onPress={this.clearURLBar}
				style={{
					backgroundColor: '#fff', padding:25
				}}>
				<Svg height={20} width={20}>
					<Svg.G rotation="45" origin="15,10">
				    <Svg.Path d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M17,13 L13,13 L13,17 L11,17 L11,13 L7,13 L7,11 L11,11 L11,7 L13,7 L13,11 L17,11 L17,13 Z" id="Shape" fill="#000000" fill-rule="nonzero"/>
					</Svg.G>
				</Svg>
			</RectButton>
			</View>
			 </KeyboardAvoidingView>
		);

		let jsCode = `
        document.querySelector('body').style.userSelect = 'none';
    `;

    return (
      <ViewPagerAndroid style={styles.container}>
        <View>
					<StatusBar hidden={true} />
					<DrawerLayout
						ref={(ref) => this._urlDrawer = ref}
						drawerWidth={screenWidth}
						drawerType='slide'
						edgeWidth={screenWidth/6}
						drawerPosition={DrawerLayout.positions.Right}
						onDrawerOpen = {this.focusURL}
						onDrawerClose = {this.blurURL}
						renderNavigationView={() => urlView}
					>
	          <DrawerLayout
							ref={(ref) => this._tabDrawer = ref}
	            drawerWidth={70}
							drawerType='slide'
							overlayColor="rgba(0, 0, 0, 0.2)"
							edgeWidth={screenWidth/6}
	            drawerPosition={DrawerLayout.positions.Right}
	            renderNavigationView={() => tabBarView}
						>
							<WebView
			          source={{
			            uri: url,
			          }}
			          style={{ flex: 1, width:screenWidth }}
								onLoad={this.onWebLoad}
								injectedJavaScript={jsCode}
                javaScriptEnabledAndroid={true}
								onNavigationStateChange={this._onNavigationStateChange.bind(this)}
		        	/>
          	</DrawerLayout>
					</DrawerLayout>
        </View>
      </ViewPagerAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDEDF1',
  },
	input: {
		flex: 4,
		height: 70,
		fontSize: 20,
		backgroundColor: 'rgba(255,255,255, 0.8)',
		paddingLeft: 20
	},
	tabList: {
		flex: 1,
		backgroundColor: '#EDEDF1',
		marginBottom: 10
	},
	tabButton: {
		height: 50,
		width: 50,
		marginTop: 10,
		marginRight: 10,
		marginLeft: 10,
		padding: 15,
		borderRadius: 4,
		backgroundColor: '#FFFFFF',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 1.0
	},
	favList:{
    flexDirection: 'row',
    flexWrap: 'wrap',
		marginRight: 10
	},
	favButton: {
		justifyContent: 'center',
    alignItems: 'center',
		height: screenWidth/3-13.33,
		width: screenWidth/3-13.33,
		marginLeft: 10,
		marginTop: 10,
		borderRadius: 4,
		backgroundColor: '#FFFFFF',
		shadowColor: '#000000',
	 	shadowOffset: { width: 0, height: 2 },
	 	shadowOpacity: 1.0
	}
});
