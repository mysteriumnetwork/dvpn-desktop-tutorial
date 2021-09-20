import React, { useState } from "react";
import "./identity.css";
import { Radio, Input, Space, Button } from "antd";
import { IdentityRef } from "mysterium-vpn-js";

type Params = {
  identities: IdentityRef[];
  onSubmit: CallableFunction;
};

export type IdentityResponse = {
  password: string;
  id: string;
  create: boolean;
};

function Identity(params: Params) {
  const { identities, onSubmit } = params;
  const [option, setOption] = useState("");
  const [password, setPassword] = useState("");
  const submit = () => {
    onSubmit({
      password: password,
      id: option,
      create: option ? false : true,
    });
  };
  return (
    <div className="form">
          <Radio.Group
            className="radio"
            onChange={(e) => setOption(e.target.value)}
            value={option}
          >
            <Space direction="vertical">
              {identities.map((x: IdentityRef, i: number) => (
                <Radio key={i+1} value={x.id}>{x.id}</Radio>
              ))}
              <Radio key={0} value="">New</Radio>
            </Space>
          </Radio.Group>
          <Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="primary" shape="round" size="large" onClick={submit}>
            Unclock
          </Button>
    </div>
  );
}

export default Identity;
