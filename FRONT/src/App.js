import logo from './logo.svg';
import './App.css';
import './reset.css';
import {useEffect, useRef, useState} from "react";
import ReactMapGL, {FlyToInterpolator, Layer, NavigationControl, Source} from 'react-map-gl';    import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import {getAllArrondissement, getAllLieuxTournage, getLieuxTournage} from "./shared/QueryManager/QueryManager";

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;


function App() {

  const[viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: 48.856614,
    longitude: 2.3522219,
    zoom: 11.5
  });
  const [isLoading, setIsLoading] = useState(false)
  const [allArrondissements, setAllArrondissements] = useState(null)
  const [tournages, setTournages] = useState({
    type: 'FeatureCollection',
    features: []
  })
  const [activeArr, setActiveArr] = useState(null)

  const layerStyleArrondissements = {
    id: 'polygon',
    type: 'fill',
    paint: {
      'fill-color': '#0080ff', // blue color fill
      'fill-opacity': 0.5
    }
  };

  const layerStyleTournage = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#007cbf'
    }
  };

  useEffect(async () => {
    setIsLoading(true)
    let waitGetAllArrondissements = await getAllArrondissement();

    if (waitGetAllArrondissements.success) {
      setAllArrondissements({
        type: 'FeatureCollection',
        features: waitGetAllArrondissements.data.data
      })
    }
  }, [])

  useEffect(() => {
    console.log(allArrondissements)
    if (allArrondissements !== null) {
      console.log(allArrondissements)
      let e = [];
      for (let i = 0;i < allArrondissements.features.length; i++) {
        e.push({
          arrName: allArrondissements.features[i].properties.l_ar,
          status: false
        })
      }
      setActiveArr(e)
    }
    console.log(allArrondissements)
  }, [allArrondissements])

  useEffect(() => {
    console.log(tournages)
  }, [tournages])

  const handleTabEvent = async (tabEvent) => {
    console.log(activeArr)
    if (activeArr === null) return
    for (let i = 0; i<  activeArr.length; i++) {

      if (activeArr[i].arrName === tabEvent.arr && activeArr[i].status !== tabEvent.status) {
        if (tabEvent.status) {
          console.log("yeet")
          activeArr[i].status = tabEvent.status
          let code = tabEvent.arr.match(/(\d+)/)
          let waitLieuxTournage = await getLieuxTournage(code[0])
          if (waitLieuxTournage.success) {
            let tournageState = tournages.features
            for (let j = 0; j < waitLieuxTournage.data.data.length; j++) {

              tournageState.push(waitLieuxTournage.data.data[j])
            }
            setTournages({
              type: 'FeatureCollection',
              features: tournageState
            })
          }
        } else {
          let tournageState = tournages.features;
          let code = tabEvent.arr.match(/(\d+)/)
          code = code[0]
          if (code.length < 2) {
            code = "7500" + code
          } else {
            code = "750" + code
          }
          for (let j = 0; j< tournages.features.length; j++) {
            if (tournages.features[j].properties.nom_tournage ==="Long métrage") {
              console.log(tournageState[j].properties.ardt_lieu)
              console.log(code)
            }

            if (tournageState[j].properties.ardt_lieu === code) {
              for (let k = 0; k < tournageState.length; k++) {
                if (tournages.features[k].properties.nom_tournage === tournageState[k].properties.nom_tournage) {
                  tournageState.splice(k, 1)
                }
              }
              console.log("yeet")
              tournageState.splice(j, 1)
            } else {
              console.log("no")
            }
          }
          setTournages({
            type: 'FeatureCollection',
            features: tournageState
          })
        }
      }
    }
  }

  return (
    <div className="App">
      <div className="header">
        <div className="tabContainer">
          {
            allArrondissements ?
              allArrondissements.features.map((arr, index) => <CheckBoxArrondissement stateChange={handleTabEvent} arrCode={arr.properties.l_ar} key={index} />)
              :
              null
          }
        </div>
      </div>
      <div className="mapContainer">
        <ReactMapGL
          {...viewport}
          onViewportChange={setViewport}
          mapboxApiAccessToken={"pk.eyJ1Ijoic29ybmluIiwiYSI6ImNrd3BhdWhpZzBheWYycHFvcWQ4amJidGoifQ.7zhsGAIKFCkBUHBg3qwAug"}
          mapStyle="mapbox://styles/sornin/ckrg0ju132jca17p79l4gtliz">
          <Source id="arrondissements" type="geojson" data={allArrondissements}>
            <Layer {...layerStyleArrondissements}/>
          </Source>
          <Source id="lieuxTournage" type="geojson" data={tournages}>
            <Layer {...layerStyleTournage}/>
          </Source>
          </ReactMapGL>
      </div>
    </div>
  );
}

const CheckBoxArrondissement = (props) => {

  const [isOn, setIsOn] = useState(props.isOn);
  const indicatorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    props.stateChange({
      arr: props.arrCode,
      status: isOn
    });
    if (isOn) {
      indicatorRef.current.style.left = "135px"
      containerRef.current.style.background = "#CECECE"
      indicatorRef.current.style.background = "#7CFC00"
    } else {
      indicatorRef.current.style.left = "0"
      containerRef.current.style.background = "#FFFFFF"
      indicatorRef.current.style.background = "#CD5C5C"
    }
  }, [isOn])

  const handleClick = () => {
    setIsOn(!isOn)
  }

  return (
    <div ref={containerRef} onClick={() => handleClick()} className="checkBoxArrondissement">
      <div ref={indicatorRef} className="isOnIndicator"/>
      <div className="nameContainer">
        {props.arrCode}
      </div>
    </div>
  )
}

export default App;
