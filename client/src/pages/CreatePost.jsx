import React, { useState } from "react";
import styled from "styled-components";
import GenerateImageForm from "../components/GenerateImageForm";
import GeneratedImageCard from "../components/GeneratedImageCard";
import { DownloadRounded } from "@mui/icons-material";
import FileSaver from "file-saver";
import { Button } from "@mui/material";
const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
  background: ${({ theme }) => theme.bg};
  padding: 30px 30px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 6px 10px;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: fit-content;
  max-width: 1200px;
  gap: 8%;
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const GeneratedPicWrapper = styled.div`
  width:50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
`
const CreatePost = () => {
  const [generateImageLoading, setGenerateImageLoading] = useState(false);
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [post, setPost] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  return (
    <Container>
      <Wrapper>
        <GenerateImageForm
          post={post}
          setPost={setPost}
          createPostLoading={createPostLoading}
          setGenerateImageLoading={setGenerateImageLoading}
          generateImageLoading={generateImageLoading}
          setCreatePostLoading={setCreatePostLoading}
        />
        <GeneratedPicWrapper>
          <GeneratedImageCard src={post?.photo} loading={generateImageLoading} />
          {post?.photo &&  
          <Button onClick={() => FileSaver.saveAs(post?.photo, "download.jpg")}>Download</Button>}
        </GeneratedPicWrapper>
      </Wrapper>
    </Container>
  );
};

export default CreatePost;
