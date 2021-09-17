import React, { useState, useEffect } from "react";

import "antd/dist/antd.css";
import "./App.css";

import Header from "./components/Header";
import Identity, { IdentityResponse } from "./components/Identity";
import Connection from "./components/Connection";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import {State, Startup, Preload, ConnectRandom, Register, Disconnect, Back} from './api';

function App() {

  // using state just to refresh App cpmponent
  const [step, setStep] = useState("");

  // running once on App init
  useEffect(() => {
    async function run() {
      await Startup();
      let res = await Preload();
      if (res) {
        setStep('connectionInfo');
      } else {
        setStep('select');
      }
      State.connectionSucces = ()=>{
        setStep('connectionInfo');
      }
    }
    run();
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="dashboard">
        {!State.currentIdentity && !State.loaded && (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        )}
        {!State.currentIdentity && State.loaded && (
          <Identity identities={State.identities} onSubmit={async (res:IdentityResponse)=>{await Register(res); setStep("connectionMake");}} />
        )}
        {State.currentIdentity && (
          <Connection
            connect={async () => {
              setStep("Connection")
              ConnectRandom(State.currentIdentity);
            }}
            disconnect={async () => {await Disconnect(); setStep("connectionMake")}}
            back={async () => {await Back(); setStep("select")}}
            connection={State.connectionInfo}
            connecting={step=="Connection"}
          />
        )}
      </div>
    </div>
  );
}

export default App;
