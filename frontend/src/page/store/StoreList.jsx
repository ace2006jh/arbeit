import {
  Box,
  Button,
  Tab,
  Table,
  TabList,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import {
  faBriefcase,
  faEllipsisH,
  faIndustry,
  faScissors,
  faTruck,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function StoreList() {
  const [storeList, setStoreList] = useState([]);
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get("/api/store/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setStoreList(res.data));
  }, []);

  const iconMapping = {
    utensils: faUtensils,
    scissors: faScissors,
    truck: faTruck,
    briefcase: faBriefcase,
    industry: faIndustry,
    ellipsis: faEllipsisH,
  };

  return (
    <Box display="flex" flexDirection="row">
      <Box
        position="sticky"
        top="0"
        backgroundColor="white"
        zIndex="1"
        h="100vh"
        overflowY="auto"
      >
        <Tabs variant="enclosed-colored" orientation="vertical">
          <TabList ml={"10px"}>
            <Tab w="200px" h="100px">
              가게 목록
            </Tab>
            <Tab w="200px" h="100px">
              무언가
            </Tab>
            <Tab w="200px" h="100px">
              뭘하지
            </Tab>
          </TabList>
        </Tabs>
      </Box>

      <Box
        flex="1"
        maxHeight="1300px"
        boxShadow="lg"
        borderRadius="md"
        bg="white"
        p={4}
        ml="150px"
      >
        <Box fontSize="2xl" fontWeight="bold" mb={4}>
          가게 목록
        </Box>
        <Table>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>가게명</Th>
              <Th>주소</Th>
              <Th>업종</Th>
            </Tr>
          </Thead>
          <Tbody>
            {storeList.map((store) =>
              account.hasAccess(store.memberId) ? (
                <Tr
                  key={store.id}
                  _hover={{
                    bgColor: "gray.200",
                    transform: "translateX(-40px) scale(1.05)",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  cursor={"pointer"}
                  onClick={() => navigate(`/store/${store.id}`)}
                  height="4cm"
                  overflow="hidden"
                >
                  <Td>{store.id}</Td>
                  <Td>{store.name}</Td>
                  <Td>{store.address}</Td>
                  <Td>
                    <FontAwesomeIcon
                      icon={iconMapping[store.icon]}
                      style={{ marginRight: "8px" }}
                    />
                    {store.cate}
                  </Td>
                </Tr>
              ) : null,
            )}
          </Tbody>
        </Table>
      </Box>
      <Box position="fixed" bottom={8} right={8}>
        <Button
          colorScheme="blue"
          onClick={() => navigate("/store/add")}
          boxShadow="lg"
        >
          추가
        </Button>
      </Box>
    </Box>
  );
}
