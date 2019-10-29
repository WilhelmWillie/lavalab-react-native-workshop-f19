# Game Scores - LavaLab React Native Workshop (Fall 2019)

Hey there! This workshop was made for LavaLab to teach developers how to use React Native to rapidly build mobile apps using
the popular Javascript framework React.

During this workshop, you'll be building a mobile application that will let you search for college football game scores using a public API. The app will display game scores in a nice scrollable list.

*Link to slides:* https://docs.google.com/presentation/d/10VoxRZNU5R6WOMvDhu55jMZVLgAN1gAeVSCS6sxNLfc/edit?usp=sharing

## Learning Outcomes

* Understand how React Native works and the general development workflow
* Understand how data is passed in React
* Learn how to use React Native components
* How to interface with external APIs through `fetch`

## Pre-Requisites

* Install Node.js and NPM on your computer (https://nodejs.org/en/)
* Install expo-cli on the command line by running `npm install -g expo-cli`
* Download the Expo mobile app so you can test your app on your mobile device (https://expo.io/)
* Optional: Install an Android or iOS simulator. If you download Expo on your phone you should be good but if you prefer, you can use a simulator

This workshop is meant to be beginner friendly but some development experience is expected. Bigger plus if you have experience with React (web) or general HTML/CSS.

## Navigating this workshop

The completed source code for this application is included in this repository. However, I'll walk you through building this app from scratch, all the way from the command line to writing the actual code.

## Project Set up

One of the pre-requisites told you to install expo-cli and install the application on your phone. Expo is a super helpful tool that bridges the gap
between your computer and your mobile device. Expo will handle compiling your code and communicating with your phone so you can code and test without
needing to plug in a device! First though, we need to create an Expo/React Native project.

* Run `expo init game-scores` into a folder of your choice. This will create a folder called `game-scores` that will contain the boilerplate React Native code for your application
  * When prompted, select the "blank" template -- this will create a barebones React Native app that we'll build on top of
* Run `cd game-scores` then `expo start` -- this will start your application via Expo so you can access the app on your mobile device. A web page will open up with a QR code. Scan this on your phone so you can open the app via the Expo app
* (Optional) if you prefer, there will be an option to open the app via an Android or iOS simulator. If you decide to go the simulator route, this is available

At this point, you should see a very basic mobile application on your phone. Open up the `game-scores` folder onto the text editor of your choice. We will begin grinding out code and making our game scores app!


## Start from Scratch

We're going to start from scratch and re-write our own version of `App`. 

First, replace the top few lines with the following (we're going to pre-emptively import everything we need, you'll see soon).

```jsx
import React, { useState } from 'react';
import { Text, TextInput, Button, View, FlatList } from 'react-native';
```

Delete the current `App()` function and replace it with the following:

```jsx
export default function App() {
  const [team, setTeam] = useState('');
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
  }

  return (
    <>
      <View style={{
        display: 'flex',
        backgroundColor: '#276092',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
      }}>
        <View 
          style={{
            width: '100%',
            padding: 15,
          }}
        >
          <TextInput
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: '#FFFFFF',
              borderWidth: 1,
              borderRadius: 5,
              padding: 15,
              width: '100%',
              marginBottom: 15,
            }}
            onChangeText={(event) => setTeam(event)}
            value={team}
          />
          <Button 
            title="Get Scores" 
            color="#FFFFFF" 
            onPress={handlePress}
          />
        </View>
      </View>
    </>
  );
}
```

This will create a barebones search interface to work off of. What's happening here is that we declare 3 types of state we want to keep track of: team input, game data, and whether or not we're loading data. Currently, we only care about the team input.

What we do is use the default `TextInput` and have it update our `team` state everytime a user changes the text. Next is to do some action when the user presses the "Get Scores" button

## Get Game Data

Right now `handlePress` is empty. Let's write some actual functional code in that method. Replace the empty method with this function: 

```jsx
const handlePress = () => {
  const getTeam = async () => {
    setGameData(null);
    setLoading(true);
    const rawData = await fetch(`https://api.collegefootballdata.com/games?year=2019&seasonType=regular&team=${team}`);
    const data = await rawData.json();
    setGameData(data);
    setLoading(false);
  }

  getTeam();
}
```

Here's what we're doing, in order: first we set the game data to `null`, essentially clearing off any data we have loaded. Then, we set the `loading` state to true (we'll use this to display a loading indicator later).

The next two lines will hit our game data API, convert that data from JSON text to a JavaScript object, then set our game data state. Finally, we set our `loading` state to false so we no longer show a loading indicator.

You can confirm this by adding a `console.log` statement but now when we save and run the app, when we type in an input and click "Get Scores", game data is being stored in our App's state. In the next part, we'll actually display some meaningful information.

## Display Game Data

Right before our App function, write in the following:

```jsx
function Game(props) {
  return (
    <View style={{ paddingLeft: 30, paddingRight: 30, paddingTop: 30, paddingBottom: 0, }}>
      <View style={{ padding: 30, backgroundColor: '#FFFFFF', }}>
        <Text style={{fontSize: 20}}>Home: {props.homeTeam} ({props.homePoints || 'TBD'})</Text>
        <Text style={{fontSize: 20}}>Away: {props.awayTeam} ({props.awayPoints || 'TBD'})</Text>
      </View>
    </View>
  )
}
```

What we're doing here is creating a re-usable Game component that reads from props. We can use this component like `<Game homeTeam='USC' awayTeam='Stanford' homePoints='10000' awayPoints='-1' />` throughout our App.

Going back to `App()`, right after we close the first `<View>`, we want to display a list:

```jsx
<View style={{flex: 1, backgroundColor: '#EDEDED', paddingBottom: 30}}>
  {loading ? <Text style={{width: '100%', textAlign: 'center', padding: 30}}>Loading...</Text> : null}
  {gameData !== null && (
    <FlatList 
      data={gameData}
      extraData={team}
      renderItem={renderGame}
      keyExtractor={getGameKey}
    />
  )}
</View>
```

This creates a view that will occupy the rest of the screen. If the `loading` state is true, we display a loading text. Otherwise, if we have game data, we display it in a list. We're almost done, we just need to write our `renderItem` and `keyExtractor` methods.

Under our `handlePress` method, include the following methods:

```jsx
const renderGame = (game) => {
  const { home_team, away_team, home_points, away_points } = game.item;
  return <Game homeTeam={home_team} awayTeam={away_team} homePoints={home_points} awayPoints={away_points} />
}

const getGameKey = (game) => game.id.toString();
```

The first method is used by FlatList. We pass in an array of data into FlatList. For each item, FlatList will render that item using the method we pass in. Here, we want to use the re-usable game component for each entry in the gameData array.

The second method is used by React internals. React wants to give each item a key to track which items have entered/left. The API we use provides a unique ID for each entry so we return that (to simplify things).

Now, if we save and run our app, we can type a search query in, click "Get Games", then get a list of game scores. This app isn't perfect but we've already accomplished so much! Hurray! 

## Further Reading

* https://reactnavigation.org/
* https://facebook.github.io/react-native/docs/getting-started.html
* https://facebook.github.io/react-native/docs/tutorial
* https://survivejs.com/react/getting-started/understanding-react-components/