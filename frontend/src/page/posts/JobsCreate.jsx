import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  Textarea,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import {
  eduDetailList,
  eduList,
  workPeriodList,
  workTimeList,
  workWeekList,
} from "./const.jsx";

export function JobsCreate() {
  const account = useContext(LoginContext);
  const [files, setFiles] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [jobs, setJobs] = useState({});
  const [jobsCondition, setJobsCondition] = useState({});
  const [isAgeLimitChecked, setIsAgeLimitChecked] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // file 목록 작성
  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(<li key={i}>{files[i].name}</li>);
  }

  // Create 관련 필요정보 얻어오기(store,category)
  useEffect(() => {
    axios
      .get("/api/jobs/insert", { params: { memberId: account.id } })
      .then((res) => {
        setStoreList(res.data);
        setJobs((prev) => ({
          ...prev,
          categoryName: "자동선택",
          name: account.name,
          memberId: account.id,
        }));
        // setJobsCondition((prev)=>({}))
      })
      .catch((error) => console.error(error));
  }, [account]);

  // Create
  function handleSubmitCreateJobs() {
    const formData = new FormData();
    Object.keys(jobs).forEach((key) => {
      formData.append(key, jobs[key]);
    });
    Object.keys(jobsCondition).forEach((key) => {
      formData.append(key, jobsCondition[key]);
    });
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    axios
      .post("/api/jobs/insert", formData)
      .then((res) => {
        myToast("공고생성 되었습니다", "success");
        navigate("/jobs/list");
      })
      .catch((e) => {
        myToast("입력 값을 확인해주세요.", "error");
        console.log(e);
      })
      .finally(() => {});
  }

  // input 관리
  const handleCreateInput = (field, event) => {
    const value = event.target.value;
    if (field === "storeName") {
      const [storeName, categoryId] = value.split("-cateNo:");
      const store = storeList.find(
        (store) =>
          store.name === storeName && store.categoryId === parseInt(categoryId),
      );
      setJobs((prev) => ({
        ...prev,
        storeName: storeName,
        storeId: store.id,
        categoryName: store ? store.cateName : "",
        categoryId: store ? store.categoryId : "",
      }));
    } else {
      setJobs((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  // condition input 관리
  const handleConditionInput = (field) => (e) => {
    setJobsCondition((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  function myToast(text, status) {
    toast({
      description: <Box whiteSpace="pre-line">{text}</Box>,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  const handleAgeLimitChange = (e) => {
    const isChecked = e.target.checked;
    setIsAgeLimitChecked(isChecked);
    setJobsCondition((prev) => ({
      ...prev,
      age: isChecked ? 0 : prev.age,
    }));
  };

  return (
    <Box>
      <Heading>알바공고 생성</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input
              value={jobs.title}
              onChange={(e) => handleCreateInput("title", e)}
              type={"text"}
              placeholder={"제목을 입력해주세요"}
            />

            <FormLabel>내용</FormLabel>
            <Textarea
              value={jobs.content}
              onChange={(e) => handleCreateInput("content", e)}
              type={"text"}
              placeholder={"내용을 입력해주세요"}
            />
            <FormLabel>시급</FormLabel>
            <InputGroup>
              <InputRightElement w={"15%"}>(원)</InputRightElement>
              <Input
                value={jobs.salary}
                onChange={(e) => handleCreateInput("salary", e)}
                type={"text"}
                placeholder={"시급을 입력해주세요"}
              />
            </InputGroup>

            <FormLabel>마감일</FormLabel>
            <Input
              value={jobs.deadline}
              onChange={(e) => handleCreateInput("deadline", e)}
              type={"datetime-local"}
              placeholder={"마감일을 입력해주세요"}
            />

            <Flex gap={3}>
              <Box w={"50%"}>
                <FormLabel>모집인원</FormLabel>
                <InputGroup>
                  <InputRightElement w={"15%"}>(명)</InputRightElement>
                  <Input
                    value={jobs.recruitmentNumber}
                    onChange={(e) => handleCreateInput("recruitmentNumber", e)}
                    type={"number"}
                    placeholder={"모집인원"}
                  />
                </InputGroup>
              </Box>
            </Flex>

            <FormLabel>가게명</FormLabel>
            <Select
              value={
                jobs.storeName
                  ? `${jobs.storeName}-cateNo:${jobs.categoryId}`
                  : ""
              }
              onChange={(e) => handleCreateInput("storeName", e)}
            >
              <option value="" disabled>
                선택
              </option>
              {storeList.map((store) => (
                <option
                  key={store.id}
                  value={`${store.name}-cateNo:${store.categoryId}`}
                >
                  {store.name}-cateNo:{store.categoryId}
                </option>
              ))}
            </Select>
            <Box w={"50%"}>
              <FormLabel>카테고리(자동선택)</FormLabel>
              <Input value={jobs.categoryName} readOnly />
            </Box>

            <FormLabel>작성자</FormLabel>
            <Input
              value={jobs.name}
              onChange={(e) => handleCreateInput("memberName", e)}
              type={"text"}
              readOnly
            />
            <FormLabel>가게위치</FormLabel>

            <Box>
              <Text>사진첨부</Text>
              <Input
                multiple
                type={"file"}
                onChange={(e) => {
                  setFiles(e.target.files);
                }}
              />
              {fileNameList.length > 0 && (
                <Box>
                  <Text>첨부파일 리스트:</Text>
                  <UnorderedList>{fileNameList}</UnorderedList>
                </Box>
              )}
            </Box>
            <Box>
              <Text>상세 조건</Text>
              <Box>
                <FormLabel>최소학력</FormLabel>
                <Flex>
                  <Select
                    w={"50%"}
                    value={jobsCondition.education || ""}
                    onChange={handleConditionInput("education")}
                    type={"text"}
                  >
                    <option value="" disabled>
                      선택
                    </option>
                    {eduList.map((education, index) => (
                      <option key={index} value={education}>
                        {education}
                      </option>
                    ))}
                  </Select>
                  <Select
                    w={"50%"}
                    value={jobsCondition.educationDetail || ""}
                    onChange={handleConditionInput("educationDetail")}
                    type={"text"}
                  >
                    <option value="" disabled>
                      선택
                    </option>
                    {eduDetailList.map((eduDetail, index) => (
                      <option key={index} value={eduDetail}>
                        {eduDetail}
                      </option>
                    ))}
                  </Select>
                </Flex>

                <FormLabel>연령제한</FormLabel>
                <Checkbox
                  isChecked={isAgeLimitChecked}
                  onChange={handleAgeLimitChange}
                >
                  연령무관
                </Checkbox>
                <InputGroup>
                  <InputRightElement color={"gray"} w={"70px"}>
                    세 이상
                  </InputRightElement>
                  <Input
                    value={jobsCondition.age}
                    onChange={handleConditionInput("age")}
                    type={"number"}
                    placeholder={"나이를 입력해주세요"}
                    disabled={isAgeLimitChecked}
                  />
                </InputGroup>
                <FormLabel>우대사항</FormLabel>
                <Input
                  value={jobsCondition.preferred || ""}
                  onChange={handleConditionInput("preferred")}
                  type={"text"}
                  placeholder={"예) 유사업무 경험, 인근 거주 우대"}
                />
                <FormLabel>근무기간</FormLabel>
                <Select
                  defaultValue={jobsCondition.workPeriod || ""}
                  onChange={handleConditionInput("workPeriod")}
                  type={"text"}
                >
                  <option value="" disabled>
                    선택
                  </option>
                  {workPeriodList.map((workPeriod, index) => (
                    <option key={index} value={workPeriod}>
                      {workPeriod}
                    </option>
                  ))}
                </Select>
              </Box>

              <FormLabel>근무요일</FormLabel>
              <Select
                defaultValue={jobsCondition.workWeek || ""}
                onChange={handleConditionInput("workWeek")}
                type={"text"}
              >
                <option value="" disabled>
                  선택
                </option>
                {workWeekList.map((workWeek, index) => (
                  <option key={index} value={workWeek}>
                    {workWeek}
                  </option>
                ))}
              </Select>
              <FormLabel>근무시간</FormLabel>
              <Select
                value={jobsCondition.workTime || ""}
                onChange={handleConditionInput("workTime")}
                type={"text"}
              >
                <option value="" disabled>
                  선택
                </option>
                {workTimeList.map((workTime, index) => (
                  <option key={index} value={workTime}>
                    {workTime}
                  </option>
                ))}
              </Select>
            </Box>
          </FormControl>
        </Center>
      </Flex>

      <Center ml={"10px"}>
        <Button
          onClick={handleSubmitCreateJobs}
          colorScheme={"purple"}
          w={"200px"}
          my={"70px"}
        >
          공고생성
        </Button>
      </Center>
    </Box>
  );
}
