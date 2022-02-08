import React from "react";
import Layout from "../components/Layout";
const FaqItem = ({ faq }) => {
  const [textShow, setTextShow] = React.useState(false);
  return (
    <>
      <li
        onClick={() => setTextShow(!textShow)}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        {faq.faqTitle}
      </li>
      {textShow ? (
        <div
          style={{ fontSize: 18, textAlign: "center", lineHeight: "2rem" }}
          dangerouslySetInnerHTML={{ __html: faq.faqText }}
        ></div>
      ) : null}
    </>
  );
};
const Faqs = () => {
  const [faqService, setFaqService] = React.useState({
    data: [
      {
        faqId: 1,
        faqTitle: "What is fees.wtf?",
        faqText:
          "Created in mid 2019, fees.wtf is the OG site showing Ethereum users their lifetime spend on Ethereum blockchain transactions.",
      },
      {
        faqId: 2,
        faqTitle: "What is the airdrop?",
        faqText:
          "Claiming the airdrop gives you access to:\r\n\r\nWTF tokens\r\nOfficial fees.wtf 1/1 NFT\r\nUpcoming pro version of fees.wtf as long as you hold a WTF NFT\r\nWTF rewards\r\nLP and WTF staking\r\nUpgradable referral link that pays you in ETH",
      },
      {
        faqId: 3,
        faqTitle: "Am I eligible for the airdrop?",
        faqText:
          "All Ethereum addresses that spent at least Ξ0.05 in gas fees by block 13916450 are eligible for the airdrop. At the time of block 13916450, Ξ0.05 was approximately $186. In response to an overwhelming flood of donations to the tip jar at fees.wtf in the lead up to the gas use snapshot, we are also providing airdrops to those who donated up until block 13943000.\r\n\r\n",
      },
      {
        faqId: 4,
        faqTitle: "How do referral links work?",
        faqText:
          "You'll get your own referral link which you can share with your friends to get paid in ETH. Your ref link never expires and can be upgraded with WTF.",
      },
      {
        faqId: 5,
        faqTitle: "How do I upgrade my referral link?",
        faqText:
          "One of the burn incentives happens here. Your referral link gets 10% of the allotted fees with the rest going to the team but you can max it out at 50%. If you want a bigger portion, you can burn WTF to upgrade the % that your referral link gets.\r\n\r\nBurn 10 WTF to upgrade from 10% to 20%\r\nBurn 100 WTF to upgrade from 20% to 30%\r\nBurn 1,000 WTF to upgrade from 30% to 40%\r\nBurn 10,000 WTF to upgrade from 40% to 50%",
      },
      {
        faqId: 6,
        faqTitle: "What is the utility of the NFT?",
        faqText:
          "Each NFT is unique to its owner. These aren't JPGs - they comprise SVG data that can be updated (at no cost) to reflect the current USD value of the gas you spent up until the snapshot. Holding your fees.wtf NFT in your wallet will give you access to the pro version of fees.wtf when it's released. There is a finite number of these NFTs, and they're only available to those that are eligible to claim. Others will need to burn WTF or acquire the NFT on secondary markets if they want access to the pro version.",
      },
    ],
    loading: true,
    error: false,
  });

  const renderUlStyles = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: 30,
    fontSize: 30,
  };

  return (
    <Layout title="Faqs">
      <div className="faqs">
        <div className="faqs-row">
          <div className="container py-5">
            <h1 className="text-center display-4 mb-5">Faqs</h1>
            <ul style={renderUlStyles}>
              {faqService.data.map((faq, idx) => (
                <FaqItem key={idx} faq={faq} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Faqs;
