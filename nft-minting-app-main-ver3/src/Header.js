import React from 'react';
import * as s from "./styles/globalStyles";
import styled from "styled-components";
const Header = () => {
    return (
        <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
      
      ></s.Container>        
        
        </s.Screen>

    );
};

export default Header;