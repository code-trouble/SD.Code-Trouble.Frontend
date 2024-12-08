import React from "react";
import { Header } from "../../components/Header";
import { PostWriter } from "../../components/PostWriter";



export const TestingPage: React.FC = () => {

  return (
    <div className="main-wrapper">
      <Header theme="blue" loggedIn={true}/>

      
      <PostWriter/>
    </div>
  );
};
