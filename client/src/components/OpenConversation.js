import React, { useState, useCallback } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useConversations } from "../contexts/ConversationsProvider";

export default function OpenConversation() {
	const [text, setText] = useState("");
	const setRef = useCallback((node) => {
		if (node) {
			node.scrollIntoView({ smooth: true });
		}
	}, []);
	const { sendMessage, selectedConversation } = useConversations();

	function handleSubmit(e) {
		e.preventDefault();

		sendMessage(
			selectedConversation.recipients.map((r) => r.id),
			text
		);
		setText("");
	}

	return (
		<div>
			<div>
				<div>
					{selectedConversation.messages.map((message, index) => {
						const lastMessage = selectedConversation.messages.length - 1 === index;
						return (
							<div>
								<div>{message.text}</div>
								<div className={`text-muted small ${message.fromMe ? "text-right" : ""}`}>{message.fromMe ? "You" : message.senderName}</div>
							</div>
						);
					})}
				</div>
			</div>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="m-2">
					<InputGroup>
						<Form.Control as="textarea" required value={text} onChange={(e) => setText(e.target.value)} />
						<InputGroup.Append>
							<button type="submit">Send</button>
						</InputGroup.Append>
					</InputGroup>
				</Form.Group>
			</Form>
		</div>
	);
}
