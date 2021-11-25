import React, { useState } from "react";
import { Tab, Nav, Button, Modal } from "react-bootstrap";
import Conversations from "./Conversations";
import Contacts from "./Contacts";
import NewContactModal from "./NewContactModal";
import NewConversationModal from "./NewConversationModal";

const CONVERSATIONS_KEY = "conversations";
const CONTACTS_KEY = "contacts";

export default function Sidebar({ id }) {
	const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY);
	const [modalOpen, setModalOpen] = useState(false);
	const conversationsOpen = activeKey === CONVERSATIONS_KEY;

	function closeModal() {
		setModalOpen(false);
	}

	return (
		<div style={{ width: "250px" }} className="d-flex flex-column">
			<Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
				<Nav variant="tabs" className="justify-content-center">
					<Nav.Item>
						<Nav.Link eventKey={CONVERSATIONS_KEY}>Conversations</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey={CONTACTS_KEY}>Contacts</Nav.Link>
					</Nav.Item>
				</Nav>
				<Tab.Pane eventKey={CONVERSATIONS_KEY}>
					<Conversations />
				</Tab.Pane>
				<Tab.Pane eventKey={CONTACTS_KEY}>
					<Contacts />
				</Tab.Pane>
				Your Id: <span className="text-muted">{id}</span>
				<button onClick={() => setModalOpen(true)}>New {conversationsOpen ? "Conversation" : "Contact"}</button>
			</Tab.Container>

			<Modal show={modalOpen} onHide={closeModal}>
				{conversationsOpen ? <NewConversationModal closeModal={closeModal} /> : <NewContactModal closeModal={closeModal} />}
			</Modal>
		</div>
	);
}
