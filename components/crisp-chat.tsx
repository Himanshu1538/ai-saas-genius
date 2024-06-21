"use client";

import { Crisp } from "crisp-sdk-web";
import React, { useEffect } from "react";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("7529dc52-5e64-4553-a4bc-b3dde8ab747d");
  }, []);

  return null;
};

export default CrispChat;
