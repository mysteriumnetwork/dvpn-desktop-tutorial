import React from "react";
import "./connection.css";
import { Descriptions, Button, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { ConnectionInfo } from "mysterium-vpn-js";

type Params = {
  disconnect: CallableFunction;
  connect: CallableFunction;
  back: CallableFunction;
  connection: ConnectionInfo | undefined;
  connecting: boolean;
};

function Connection(params: Params) {
  const { connect, disconnect, back, connection, connecting } = params;

  return (
    <div className="connection">
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
      {connecting && <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />}
      {(!connection || connection.status != "Connected") && (
        <div>
        <Button
          type="primary"
          shape="round"
          size="large"
          disabled={connecting}
          onClick={() => {
            connect();
          }}
        >
          Connect to Random Node
        </Button>{"  "}<Button
          type="primary"
          shape="round"
          size="large"
          onClick={() => {
            back();
          }}
        >
          Back
        </Button>
        </div>
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
    </div>
  );
}

export default Connection;
