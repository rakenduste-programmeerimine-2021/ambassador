import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const ChatListItem = (props) => {
	const [color, setColor] = useState(null);

	return (
		<div className="user-list-item padding-20 row clickable" id={"chat-item-" + props.id}>
			<div className="col">
				<div className="row height-50 space-between align-center">
					<h3>{props.name}</h3>
					{props.unread !== undefined ? <span className="user-blue-dot-active"></span> : null}
				</div>
				<div className="row height-50 space-between align-center">
					<p>{props.lastUpdate !== undefined ? moment(props.lastUpdate).calendar() : moment(props.created).calendar()}</p>
				</div>
			</div>
			{props.type === "CREATE_GROUP" ? (
				<div className="group-checkbox-col justify-center">
					<div className="checkbox-wrap">
						<input className="checkbox" type="checkbox" id={"checkbox_" + props.index + props.name} />
						<label className="checkmark" htmlFor={"checkbox_" + props.index + props.name}></label>
					</div>
				</div>
			) : null}
			<div id={props.id} className="user-list-item-overlay" onClick={props.retrieveChatId}></div>
		</div>
	);
};

export default ChatListItem;
