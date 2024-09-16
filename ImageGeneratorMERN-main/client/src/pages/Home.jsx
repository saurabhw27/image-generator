import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SearchBar from "../components/SearchBar";
import ImageCard from "../components/ImageCard";
import { Button, CircularProgress } from "@mui/material";
import axios from 'axios';
const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
  background: ${({ theme }) => theme.bg};
  padding: 30px 30px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 6px 10px;
  }
`;

const Headline = styled.div`
  text-align: center;
  font-size: 34px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  flex-direction: column;

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;
const Span = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.secondary};

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 0px;
  display: flex;
  justify-content: center;
`;

const CardWrapper = styled.div`
  display: grid;
  gap: 20px;
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 640px) and (max-width: 1199px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 639px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // let baseURL = 'http://localhost:8080/api/';
let baseURL = "https://imagegeneratormern.onrender.com/api/"
  const getPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}post?pageNumber=${pageNumber}`);
      setLoading(false);
  
      // Create a Set of existing post IDs for fast lookup
      const existingPostIds = new Set(posts.map(post => post._id));
  
      // Filter out duplicates in the new posts based on existing post IDs
      const uniqueNewPosts = res.data.data.filter(
        (newPost) => !existingPostIds.has(newPost._id)
      );
  
      // Combine existing posts with unique new posts, avoiding duplicates
      const updatedPosts = [...uniqueNewPosts ,...posts];
  
      // Update both posts and filteredPosts states with the new list
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts); // assuming the same logic applies for filtering
  
      // Check if there are more pages
      if (pageNumber >= res.data.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    getPosts();
  }, [pageNumber]);

  useEffect(() => {
    if (!search) {
      setFilteredPosts(posts);
      return;
    }

    const SearchFilteredPosts = posts.filter((post) => {
      const promptMatch = post?.prompt
        ?.toLowerCase()
        .includes(search.toString().toLowerCase());
      const authorMatch = post?.name
        ?.toLowerCase()
        .includes(search.toString().toLowerCase());

      return promptMatch || authorMatch;
    });

    setFilteredPosts(SearchFilteredPosts);
  }, [posts, search]);

  const loadMorePosts = () => {
    if (hasMore) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };
  console.log(pageNumber)
  return (
    <Container>
      <Headline>
        Explore popular posts in the Community!
        <Span>⦿ Generated with AI ⦿</Span>
      </Headline>
      <SearchBar search={search} setSearch={setSearch} />
      <Wrapper>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {loading && pageNumber === 1 ? (
          <CircularProgress />
        ) : (
          <CardWrapper>
            {filteredPosts.length === 0 ? (
              <>No Posts Found</>
            ) : (
              <>
                {filteredPosts
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <ImageCard key={index} item={item} />
                  ))}
                {hasMore && !loading && (
                  <Button onClick={loadMorePosts}>Load More</Button>
                )}
                {loading && <CircularProgress />}
              </>
            )}
          </CardWrapper>
        )}
      </Wrapper>
    </Container>
  );
};


export default Home;
