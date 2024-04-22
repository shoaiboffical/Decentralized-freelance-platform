// // import React, { useEffect, useState } from "react";
// import React from "react";
// import "./pay.scss";
// import {ethers} from 'ethers';

// // import { loadStripe } from "@stripe/stripe-js";
// // import { Elements } from "@stripe/react-stripe-js";
// // import newRequest from "../../utils/newRequest";
// // import { useParams } from "react-router-dom";
// // import CheckoutForm from "../../components/checkOutForm/CheckOutForm";

// import { Slider } from "infinite-react-carousel";
// import { useQuery } from "@tanstack/react-query";
// import newRequest from "../../utils/newRequest";
// import { Link, useParams } from "react-router-dom";
// import Reviews from "../../components/reviews/Reviews";


// const Pay = () => {

//   const { id } = useParams();
//   // console.log(id);
//   const { data } = useQuery({
//       queryKey: ['gig'],
//       queryFn: () =>
//           newRequest.get(`/gigs/single/${id}`)
//               .then((res) => {
//                   return res.data;
//               })
//   });
//   const userId=data?.userId;
//   const {  data: dataUser } = useQuery({
//       queryKey: ['user'],
//       queryFn: () =>
//           newRequest.get(`/users/${userId}`)
//               .then((res) => {
//                   return res.data;    
//               }),enabled:!!userId,
//   });
//   console.log("------------>>>>>>>>>>-------");
   
//    console.log("User's Wallet Address:", dataUser?.username);
//    console.log("User's Wallet Address:", dataUser?.wallet_address);

// console.log("Gig's Title:", data?.price);

// const requestAccounts = async () => {
//   try {
   
//     const accounts = await window.ethereum.request({
//       method: 'eth_requestAccounts'
//     });
//     console.log(accounts); // Do something with the accounts

//     // If you're sending a transaction, ensure this is in response to a user action
    
//     const transactionParameters = {
//       from: accounts,
//       to: dataUser?.wallet_address,
//       gas: "0x76c0", // 30400
//       gasPrice: "0x9184e72a000", // 10000000000000
//       value: data?.price, // 2441406250
//       data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
//     };

//     const txHash = await window.ethereum.request({
//       method: 'eth_sendTransaction',
//       params: [transactionParameters],
//     });
//     console.log(txHash); // Use the transaction hash as needed
   
//   } catch (error) {
//     console.error(error);
//   }
// };

// requestAccounts();
//   return <div className="pay">
//     {/* {clientSecret && (
//         <Elements options={options} stripe={stripePromise}>
//           <CheckoutForm />
//         </Elements>
//       )} */}
 
  
    
      
//   </div>;
// };

// export default Pay;

import React, { useEffect } from "react";
import "./pay.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import Reviews from "../../components/reviews/Reviews";
import {ethers} from 'ethers';

const Pay = () => {
  const { id } = useParams();

  const { data: gigData } = useQuery({
      queryKey: ['gig'],
      queryFn: () => newRequest.get(`/gigs/single/${id}`).then(res => res.data)
  });

  const userId = gigData?.userId;

  const { data: userData } = useQuery({
      queryKey: ['user'],
      queryFn: () => newRequest.get(`/users/${userId}`).then(res => res.data),    
      enabled: !!userId,
  });

  useEffect(() => {
    const requestAccounts = async () => {
      if (!window.ethereum) {
        console.error("Ethereum object not found. You need to install MetaMask or another Ethereum wallet.");
        return;
      }

      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected accounts:", accounts);

        // Define the transaction parameters
        const transactionParameters = {
          from: accounts[0], // Use the first account
          to: userData?.wallet_address,
          gas: "0x76c0", // 30400
          gasPrice: "0x9184e72a000", // 10000000000000
          value: ethers.utils.parseUnits(gigData?.price.toString() || "0", "ether").toHexString(), // Convert price to Wei and then to hex
        
        };

        // Send the transaction
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
        console.log("Transaction hash:", txHash);

      } catch (error) {
        console.error("Error requesting accounts or sending transaction:", error);
      }
    };

    // Call requestAccounts if both gigData and userData are loaded
    if (gigData && userData) {
      requestAccounts();
    }
  }, [gigData, userData]); // useEffect will run when gigData and userData change

  return (
    <div className="pay">
      {/* UI elements */}
      <Reviews gigId={id} key={id}></Reviews>
    </div>
  );
};

export default Pay;
