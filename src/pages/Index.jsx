import React, { useState } from "react";
import { Container, VStack, Text, Input, Button, Box, HStack, IconButton, useToast } from "@chakra-ui/react";
import { FaRocket } from "react-icons/fa";

const Index = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const toast = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Message cannot be empty.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const newMessage = { sender: "user", text: message };
    setChatHistory([...chatHistory, newMessage]);
    setMessage("");

    try {
      const response = await fetch("YOUR_BENTOML_BACKEND_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.reply };
      setChatHistory([...chatHistory, newMessage, botMessage]);
    } catch (error) {
      toast({
        title: "Error sending message.",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Chat with AI</Text>
        <Box width="100%" height="60vh" overflowY="auto" border="1px" borderColor="gray.200" borderRadius="md" p={4}>
          {chatHistory.map((chat, index) => (
            <Box key={index} alignSelf={chat.sender === "user" ? "flex-end" : "flex-start"} mb={2}>
              <Text bg={chat.sender === "user" ? "blue.100" : "green.100"} p={2} borderRadius="md">
                {chat.text}
              </Text>
            </Box>
          ))}
        </Box>
        <HStack width="100%">
          <Input placeholder="Type your message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} />
          <IconButton aria-label="Send" icon={<FaRocket />} onClick={handleSendMessage} />
        </HStack>
      </VStack>
    </Container>
  );
};

export default Index;
