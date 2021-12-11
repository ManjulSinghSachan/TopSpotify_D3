import React, { useEffect, useState } from 'react';
import './App.css';
import BarChart from './charts/BarChart';
import * as d3 from 'd3';

// var rawData = {};

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        loadData();
    });

    const loadData = () => {
        d3.json("/StreamingHistory0.json").then(function(d) {
            analyzeData(d);
        })
    }

    const analyzeData = (raw) => {
        var cume_artist_time = {};

        var temp_name, temp_time = null;
        for(var i=0; i < raw.length; i++){
            temp_name = raw[i]["artistName"];
            temp_time = parseInt(raw[i]["msPlayed"])/1000.0/60.0/60.0;
            if(temp_name in cume_artist_time){
                cume_artist_time[temp_name] = cume_artist_time[temp_name] + temp_time;
            }
            else { 
                cume_artist_time[temp_name] = temp_time;
            }
        }

        var cume_artist_time_arr = [];

        Object.keys(cume_artist_time).forEach((key) => cume_artist_time_arr.push(
            {
                artist: key,
                total_time: cume_artist_time[key]
            }));
        


        var graphData = cume_artist_time_arr;


        graphData.sort((a,b) => d3.descending(a.total_time, b.total_time));

        graphData = graphData.slice(0,25);

        setData(graphData);
    }

    // useEffect(() => {
    //     changeData();
    // }, [rawData]);

    // const changeData = () => {
    //     setData(datas[i++]);
    //     if(i === datas.length) i = 0;
    // }


    return (
        <div className="App" style={{backgroundColor: '#191414', color: '#1DB954'}}>
            <h2>Top 25 Spotify Artists</h2>
            {/* <button onClick={changeData}>Change Data</button> */}
            <BarChart width={800} height={600} data={data} />
        </div>
    );
}

export default App;