import React, { useState } from "react";
import { Register } from "..//..//App";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface FormElements extends HTMLFormControlsCollection {
	usernameInput: HTMLInputElement;
	passwordInput: HTMLInputElement;
	passwordConfirmInput: HTMLInputElement;
}

interface UserFormElements extends HTMLFormElement {
	readonly elements: FormElements;
}

interface LoginRegisterProps {
	onLogin: (formData: Login) => void;
	onRegister: (formData: Register) => void;
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Box>{children}</Box>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

function LoginRegister({ onLogin, onRegister }: LoginRegisterProps) {
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const handleLoginSubmit = (event: React.FormEvent<UserFormElements>) => {
		event.preventDefault();

		const username = event.currentTarget.elements.usernameInput;

		const password = event.currentTarget.elements.passwordInput;

		onLogin({ username: username.value, password: password.value });

		username.value = "";
		password.value = "";
	};

	const handleRegisterSubmit = (event: React.FormEvent<UserFormElements>) => {
		event.preventDefault();

		const username = event.currentTarget.elements.usernameInput;
		const password = event.currentTarget.elements.passwordInput;
		const passwordConfirm = event.currentTarget.elements.passwordConfirmInput;

		onRegister({
			username: username.value,
			password: password.value,
			passwordConfirm: passwordConfirm.value,
		});

		username.value = "";
		password.value = "";
		passwordConfirm.value = "";
	};

	return (
		<Box
			sx={{
				maxWidth: "100%",





				width: "100%",
				p: 2,
				boxSizing: "border-box",
			}}
		>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					aria-label="Login/Register Page"
				>
					<Tab label="Login" {...a11yProps(0)} />
					<Tab label="Register" {...a11yProps(1)} />
				</Tabs>
			</Box>
			<TabPanel value={tabValue} index={0}>
				<form autoComplete="off" onSubmit={handleLoginSubmit}>
					<TextField
						sx={{ display: "flex", width: "25ch", mb: 1 }}
						id="usernameInput"
						name="usernameInput"
						label="Kullanici Ismi"
						placeholder="Kullanici Ismi"
						required
					/>
					<TextField
						sx={{ display: "flex", width: "25ch", mb: 1 }}
						id="passwordInput"
						name="passwordInput"
						label="Sifre"
						type="password"
						placeholder="Sifre"
						autoComplete="off"
						required
					/>
					<Button type="submit" variant="contained">
						Giris Yap
					</Button>
				</form>
			</TabPanel>
			<TabPanel value={tabValue} index={1}>
				<form autoComplete="off" onSubmit={handleRegisterSubmit}>
					<TextField
						sx={{ display: "flex", width: "25ch", mb: 1 }}
						id="usernameInput"
						name="usernameInput"
						label="Kullanici Ismi"
						placeholder="Kullanici Ismi"
						required
					/>
					<TextField
						sx={{ display: "flex", width: "25ch", mb: 1 }}
						id="passwordInput"
						name="passwordInput"
						label="Sifre"
						type="password"
						placeholder="Sifre"
						autoComplete="off"
						required
					/>
					<TextField
						sx={{ display: "flex", width: "25ch", mb: 1 }}
						id="passwordConfirmInput"
						name="passwordConfirmInput"
						label="Sifre Tekrari"
						type="password"
						placeholder="Sifre Tekrari"
						autoComplete="off"
						required
					/>
					<Button type="submit" variant="contained">
						Kayit Ol
					</Button>
				</form>
			</TabPanel>
		</Box>
	);
}

export default LoginRegister;
