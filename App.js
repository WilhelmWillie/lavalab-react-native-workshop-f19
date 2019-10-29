import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View, FlatList } from 'react-native';

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

export default function App() {
  const [team, setTeam] = useState('');
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const renderGame = (game) => {
    const { home_team, away_team, home_points, away_points } = game.item;
    return <Game homeTeam={home_team} awayTeam={away_team} homePoints={home_points} awayPoints={away_points} />
  }

  const getGameKey = (game) => game.id.toString();

  return (
    <>
      <View style={styles.container}>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#276092',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
});
