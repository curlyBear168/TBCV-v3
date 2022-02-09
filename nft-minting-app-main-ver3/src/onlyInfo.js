import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
//import DateCountdown from 'react-date-countdown-timer';

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 150px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledLogoLeft = styled.img`
  width: 200px;
  vertical-align: middle;
  @media (min-width: 767px) {
    width: 150px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledLogoSmall = styled.img`
  width: 30px;
  @media (min-width: 767px) {
    width: 30px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;
export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;
export const StyledImgHsq = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 10%;
  width: 250px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;
export const StyledImgSq = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 5%;
  width: 100px;
  @media (min-width: 900px) {
    width: 150px;
  }
  @media (min-width: 1000px) {
    width: 200px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
    <s.Container
      flex={1}
      ai={"center"}
      style={{ padding: 24, backgroundColor: "var(--primary)" }}
      image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg-pink.png" : null}      
      >
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          > 
      <a href={CONFIG.MARKETPLACE_LINK} style={{left:"auto"}}>
          <StyledLogo alt={"logo"} src={"/config/images/BoredValentineClubFinal.png"} />
      </a>
          <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              Bored Valentines Club
            </s.TextTitle>     
            </s.Container>       
    </s.Container>

      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg-pink.png" : null}
      >

        {/*}
        <a href={CONFIG.MARKETPLACE_LINK}>
          <StyledLogo alt={"logo"} src={"/config/images/BoredValentineClubFinal.png"} />
        </a>*/}
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImgHsq alt={"example"} src={"/config/images/ezgif.com-gif-maker.gif"}/>
            {/* style={{ transform: "scaleX(-1)" }} */}
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              FREE Bored Valentines NFT Giveaway
            </s.TextTitle>          
            <s.TextDescription
              style={{
                textAlign: "center",
                fontSize:30,
                color: "var(--primary-text)",
              }}
            >
            Complete 3 simple tasks to get a <StyledLink target={"_blank"} >FREE</StyledLink> Bored Valentines NFT.
              </s.TextDescription>
              <s.TextDescription
              style={{
                textAlign: "center",               
                fontSize:30,
                color: "var(--primary-text)",
              }}
            >
               Ends on Feb 13.

               <span>         </span>
               <StyledLink target={"_blank"} href="https://twitter.com/BoredValentines">
             Click Here
              </StyledLink>           
            </s.TextDescription>

            <s.TextDescription
              style={{
                textAlign: "center",
                fontSize:30,
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} >
              Join the community   
              </StyledLink>          
              <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >

              
              <StyledLink target={"_blank"} href="https://twitter.com/BoredValentines"> <StyledLogoSmall src={"/config/images/twitter.webp"} /></StyledLink>
              <span>                                                </span>
              <StyledLogoSmall src={"/config/images/discord.webp"} />

            </s.TextTitle>


            </s.TextDescription>
            <span
              style={{
                textAlign: "center",
              }}
            >

            <s.TextDescription
              style={{
                textAlign: "center",
                fontSize:30,
                color: "var(--primary-text)",
              }}
            >
              Public Sale:  Feb 14, 2022, UTC XX:XX:XX
            </s.TextDescription>
{/*}
      no need button here
              <StyledButton
                onClick={(e) => {
                  window.open("/config/roadmap.png", "_blank");
                }}
                style={{
                  margin: "5px",
                }}
              >
                Roadmap
              </StyledButton>
              <StyledButton
                style={{
                  margin: "5px",
                }}
                onClick={(e) => {
                  window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                }}
              >
                {CONFIG.MARKETPLACE}
              </StyledButton>


              */}
            </span>



            <s.SpacerSmall />
            <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
              *in Polygon network , Minting Price:
            </s.TextDescription>
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />

          {/*}
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/ngun.jpeg"}
             
            />
          </s.Container>
            */}

        </ResponsiveWrapper>
        <s.SpacerMedium />

        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>

        <s.Container
            flex={2}
            jc={"center"}
            ai={"left"}
            
            style={{
              width:"100%",
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >     
          <s.TextTitle
                style={{
                  textAlign: "left",
                  fontSize: 18,
                
                  color: "var(--accent-text)",
                }}
            >
          The Bored Valentines Club is a fixed set of 10,000 randomly generated unique 
          bored guy displaying how we guys view a relationship.
          </s.TextTitle>
          <s.SpacerXSmall/>
          <s.TextTitle
                style={{
                  textAlign: "left",
                  fontSize: 18,
              
                  color: "var(--accent-text)",
                }}
            >
            Owning a Bored Valentine Guy grants you access to the BV Dating Club, 
            where you can meet other owners of the upcoming Bored Valentine Girls. 
            There will also be a Mating Room where you can create Bored Valentine Babies.
             Excited, yea?
            </s.TextTitle>
            <s.SpacerXSmall/>
            <s.TextTitle
                style={{
                  textAlign: "left",
                  fontSize: 18,
                 
                  color: "var(--accent-text)",
                }}
            >
            You could buy this NFT as a Valentine's Gift to your virtual partner, 
            or as a display of Bored status on socials. 2% of the earnings will 
            be donated to "The Charity for Male traumatized from a Relationship".
             Or just flip it, bruh.
            </s.TextTitle>

          </s.Container>

          <s.SpacerMedium />    
        <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            
            style={{
              width:"100%",
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
          <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              Roadmap
            </s.TextTitle>   

            <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
              Feb 9, 2022 - Register open for Free NFT
            </s.TextDescription>
            <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
              Feb 14, 2022 - Public Sale starts
            </s.TextDescription>
            <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
              March 14, 2022 - Bored Valentine Girl Club launch
            </s.TextDescription>
            <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
              July 2022 - Launch of the BV Dating Club
            </s.TextDescription>
            <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
              Oct 2022 - Launch of the Mating Room
            </s.TextDescription>
        </s.Container>   

        </ResponsiveWrapper>
        <s.SpacerSmall />        
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>    
        <s.Container
            flex={2}
            jc={"center"}
            ai={"left"}
            
            style={{
              width:"100%",
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >        
          <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: 30,
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}
            >
            What is BV Dating Club?
            </s.TextTitle>  
            <s.SpacerXXSmall/>
            <s.TextTitle
              style={{
                textAlign: "left",
                fontSize: 15,
                color: "var(--accent-text)",
              }}
            >
 BV Dating Club is essentially a blockchain-based social dating community that offers key elements missing from current dating app, like trust, transparency, data security and fraud protection against nefarious actors, or ‘catfishes.
             
            </s.TextTitle>  
           <s.SpacerXXSmall/>
            <s.TextTitle
              style={{
                textAlign: "left",
                fontSize: 15,
                color: "var(--accent-text)",
              }}
            >
              By owning a Bored Valentines Club NFT, you gain accesss to the Dating Club community where you can meet other like-minded Valentines. NFT owner will also be airdropped a Bored Valentine Girl NFT in the future.
            </s.TextTitle>  
        </s.Container>
        <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImgHsq alt={"example"} src={"/config/images/ezgif.com-gif-maker.gif"}/>
            {/* style={{ transform: "scaleX(-1)" }} */}
          </s.Container>

        </ResponsiveWrapper>

        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>    
        <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            
            style={{
              width:"100%",
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
              display:"inline",
              margin: "0 auto",

            }}
          >   
          <s.TextTitle
              jc={"center"} ai={"center"} 
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >

            <StyledImgSq
              alt={"example"}
              src={"/config/images/christina.png"}
            />
          <s.TextTitle
                style={{
                textAlign: "left",
                fontSize: 12,
                color: "var(--accent-text)",
              }}
            >
 Christina, the wife, the Tech Lead of the project, has over 10 years of experience as a full stack developer, and is in love with blockchain in recent years. She loves drawing, meditating & reading in her spare time.             
           </s.TextTitle>            
            </s.TextTitle>  
        </s.Container>  
        <s.SpacerXSmall/>
        <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            
            style={{
              width:"100%",
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
              display:"inline",
              margin: "0 auto",

            }}
          >   
          <s.TextTitle
              jc={"center"} ai={"center"} 
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >

            <StyledImgSq
              alt={"example"}
              src={"/config/images/jack.png"}
            />
          <s.TextTitle
                style={{
                textAlign: "left",
                fontSize: 12,
                color: "var(--accent-text)",
              }}
            >
Jack, the husband, and the Project Manager of Bored Valentines Club, has over 10 years of experience in game development and project management. He and Christina are actually at the edge of divorcing, the result of this project could affect the outcome of their marriage.              </s.TextTitle>            
            </s.TextTitle>  
        </s.Container> 
        <s.SpacerXSmall/>          
        <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            
            style={{
              width:"100%",
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
              display:"inline",
              margin: "0 auto",

            }}
          >   
          <s.TextTitle
              jc={"center"} ai={"center"} 
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >

            <StyledImgSq
              alt={"example"}
              src={"/config/images/sophia.png"}
            />
          <s.TextTitle
                style={{
                textAlign: "left",
                fontSize: 12,
                color: "var(--accent-text)",
              }}
            >
Sophia, the Community Manager, loves speaking with people, she will be your helping hand.               </s.TextTitle>            
            </s.TextTitle>  
        </s.Container>  
        <s.SpacerXSmall/>
        <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            
            style={{
              width:"100%",
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
              display:"inline",
              margin: "0 auto",

            }}
          >   
        
          <s.TextTitle
              jc={"center"} ai={"center"} 
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >

            <StyledImgSq
              alt={"example"}
              src={"/config/images/lex.png"}
            />

          <s.TextTitle
                style={{
                textAlign: "left",
                fontSize: 12,
                color: "var(--accent-text)",
              }}
            >
Lex, the Utility Manager, will be managing the utility of the NFT, like the BV Dating Club & the Mating Room.
              </s.TextTitle>
            </s.TextTitle>  
        </s.Container>  
        </ResponsiveWrapper>



        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>

    
  );
}

export default App;
