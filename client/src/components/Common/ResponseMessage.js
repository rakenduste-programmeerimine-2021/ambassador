import React from "react";

const ResponseMessage = (props) => {
	return (
		<div className="row margin-bot-s">
			<div className="col">
				<div className="row justify-start">
					<span>{props.username}</span>
				</div>
				<div className="row justify-start">
					<p className="response-message-body">{props.text}</p>
				</div>
			</div>
		</div>
	);
};

export default ResponseMessage;
