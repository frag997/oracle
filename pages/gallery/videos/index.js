import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";

import TweetsView from "components/VideosView";
import DashboardLayout from "components/GalleryLayout";

import {
  Box,
  useColorModeValue as mode,
  useToast,
  chakra,
  LightMode,
  Stack,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

export default function Tweets() {
  const { query } = useRouter();
  const toast = useToast();
  const [questionQuery, setQuestionQuery] = useState("");
  const [questionResponse, setQuestionResponse] = useState(null);

  const queryAPI = async (user) => {
    const values = {
      handle: user?.replace("@", ""),
    };
    const response = await fetch(`/api/searchTwitterApi`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      setQuestionResponse(data);
      toast({
        status: "success",
        description: `Data submited successfully for user @${user}`,
        duration: 6000,
      });
    }
  };

  useEffect(() => {
    if (query.user !== "") {
      setQuestionQuery(query.user);
      queryAPI(query.user);
    }
  }, [query.user]);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (questionQuery) await queryAPI(questionQuery);
    } catch (e) {
      toast({
        status: "error",
        description: "Failed to submit",
        duration: 6000,
      });
    }
  };
  return (
    <DashboardLayout title="All Videos">
      <chakra.h1>Ask a new question:</chakra.h1>
      <Box display="flex" alignItems="center" justifyContent="flex-start">
        <chakra.form onSubmit={onSubmit}>
          <LightMode>
            <Stack
              direction={{ base: "column", md: "row" }}
              align={{ md: "flex-end" }}
            >
              <Box flex="1">
                <FormLabel htmlFor="questionQuery" srOnly>
                  Ask the Oracle
                </FormLabel>
                <Input
                  id="questionQuery"
                  name="questionQuery"
                  size="lg"
                  fontSize="md"
                  bg="white"
                  _placeholder={{ color: "gray.400" }}
                  color="gray.900"
                  placeholder="@"
                  focusBorderColor="blue.200"
                  value={questionQuery}
                  onChange={(e) => {
                    setQuestionQuery(e.target.value);
                  }}
                />
              </Box>
              <Button
                type="submit"
                size="lg"
                colorScheme="yellow"
                fontSize="md"
                px="10"
              >
                Ask the Oracle
              </Button>
            </Stack>
          </LightMode>
        </chakra.form>
      </Box>
      <Box>
        <TweetsView items={questionResponse} />
      </Box>
    </DashboardLayout>
  );
}
