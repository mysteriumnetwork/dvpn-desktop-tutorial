import React, { useState } from "react";
import "./connection.css";
import { Descriptions, Button } from "antd";
import { ConnectionInfo } from "mysterium-vpn-js";

type Params = {
  disconnect: CallableFunction;
  connect: CallableFunction;
  connection: ConnectionInfo | undefined;
};

/*
"consumer_id": "0x00",
"hermes_id": "0x00",
"proposal": {
"access_policies": [
{
"id": "string",
"source": "string"
}
],
"compatibility": 0,
"format": "string",
"location": {
"asn": 1,
"city": "Amsterdam",
"continent": "EU",
"country": "NL",
"ip_type": "residential",
"isp": "Telia Lietuva, AB"
},
"price": {
"currency": "string",
"per_gib": 0,
"per_hour": 0
},
"provider_id": "0x0000000000000000000000000000000000000001",
"quality": {
"bandwidth": 0,
"latency": 0,
"quality": 0
},
"service_type": "openvpn"
},
"session_id": "4cfb0324-daf6-4ad8-448b-e61fe0a1f918",
"status": "Connected"

*/

function Connection(params: Params) {
  const { connect, disconnect, connection } = params;

  const [wait, setWait] = useState(false);
  return (
    <>
      <Descriptions title="Connection Info">
        <Descriptions.Item label="Price/Hour">
          {((connection?.proposal?.price.perHour || 0) / 1e18).toFixed(5)}
          {connection?.proposal?.price.currency}
        </Descriptions.Item>
        <Descriptions.Item label="Price/Gb">
          {((connection?.proposal?.price.perGib || 0) / 1e18).toFixed(5)}
          {connection?.proposal?.price.currency}
        </Descriptions.Item>
        <Descriptions.Item label="Conn. Type">
          {connection?.proposal?.location.ipType}
        </Descriptions.Item>

        <Descriptions.Item label="Location">
          {connection?.proposal?.location.country}{" "}
          {connection?.proposal?.location.city}
        </Descriptions.Item>
        <Descriptions.Item label="Prvider ID">
          {connection?.proposal?.providerId}
        </Descriptions.Item>
      </Descriptions>
      {(!connection || connection.status != "Connected") && (
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={() => {
            connect();
            setWait(true);
          }}
        >
          Connect to Random Node
        </Button>
      )}
      {!!connection && connection.status == "Connected" && (
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={() => disconnect()}
        >
          Disconnect
        </Button>
      )}
    </>
  );
}

export default Connection;
