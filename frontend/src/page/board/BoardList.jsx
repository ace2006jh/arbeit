import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    axios
      .get(`api/board/list?${searchParams}`)
      .then((res) => setBoardList(res.data));
  }, [searchParams]);
  return (
    <Box>
      <Box bgColor={"yellow.200"}>자유 게시판</Box>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>제목</Th>
              <Th>본문</Th>
              <Th>
                <FontAwesomeIcon icon={faUserPen} />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Tr
                _hover={{
                  baColor: "blue.200",
                }}
                cursor={"pointer"}
                onClick={() => navigate(`/board/${board.id}`)}
                key={board.id}
              >
                <Td> {board.id}</Td>
                <Td> {board.title}</Td>
                <Td> {board.content}</Td>
                <Td> {board.writer}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
