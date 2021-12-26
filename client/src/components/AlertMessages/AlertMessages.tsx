import React, { useContext, useEffect } from "react";
import { Alert, Col, Row } from "antd";
import { AlertMessagesContext } from "contexts/alert-messages";

function AlertMessages() {
  const { messages, deleteById } = useContext(AlertMessagesContext);

  const handleClose = (id: number) => {
    deleteById(id);
  };

  useEffect(() => {
    let timer: any;
    if (messages.length > 0) {
      timer = setTimeout(() => {
        deleteById(messages.length - 1);
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [messages, deleteById]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <Row>
      <Col span={24}>
        {messages.map((message) => (
          <Alert
            key={message.id}
            message={message.text}
            closable
            showIcon
            onClose={() => handleClose(message.id)}
            style={{ marginBottom: 16 }}
            type={message.type}
          />
        ))}
      </Col>
    </Row>
  );
}

export default AlertMessages;
