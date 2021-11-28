import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../UserContext";
import Sidebar from "../testChat/Sidebar";
import io from "socket.io-client";
let socket;
const Home = () => {
	const { user, setUser } = useContext(UserContext);
	const ENDPT = "localhost:5000";
	useEffect(() => {
		socket = io(ENDPT);
		return () => {
			socket.disconnect();
			socket.off();
		};
	}, [ENDPT]);

	return (
		<div>
			<Sidebar />
		</div>
	);
};

export default Home;
