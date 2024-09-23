import { useEffect, useEffectx, useState } from "react";
import {
  urlClient,
  LENS_HUB_CONTRACT_ADDRESS,
  queryRecommandedProfiles,
  queryExplorePublications,
} from "./queries";
import LENSHUB from "./lenshub";
import { ethers } from "ethers";
import { Box, Button, Image } from "@chakra-ui/react/dist";

function App() {
  const [account, setAccount] = useState(null);
  const [profilex, setProfiles] = useState([]);
  const [post, setPosts] = useState([]);

  /* Sign in - function */
  async function signIn() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  }

  async function getRecommendedProfiles() {
    const response = await urlClient
      .query(queryRecommandedProfiles)
      .toPromise();
    const profiles = response.data.recommendedProfiles.slice(0, 5);
    setProfiles(profiles);
  }

  /* Post */
  async function getPost() {
    const response = await urlClient
      .query(queryExplorePublications)
      .toPromise();

    const posts = response.data.queryExplorePublications.items.filter(
      (post) => {
        if (post.profile) return post;
        return "";
      }
    );
    setPosts(posts);
  }

  /* after you sign in follow */
  async function follow(id) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      LENS_HUB_CONTRACT_ADDRESS,
      LENSHUB,
      provider.getSigner()
    );
    const tx = await contract.follow([parseInt(id)], [0x0]);
    await tx.wait();
  }

  useEffect(() => {
    getRecommendedProfiles();
    getPosts();
  }, []);

  return <div className="app"></div>;
}

export default App;
