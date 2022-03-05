
import React, { useState, useEffect } from 'react';
import axios from 'axios';





import { Box, Typography, Button } from '@mui/material';

export interface TodoInterface {
	id: number;
	userId: number;
	title: string;
	categoryId: number;
	statusId: number;
	updatedAt: string;
	createdAt: string;
}

export interface TodoAddInterface {
	title: string;
	categoryId: number;
	statusId: number;
}

export interface TodoGetInterface {
	apiToken: string;
}

export interface TodoUpdateInterface {
	apiToken?: string;
	todo: TodoInterface;
}

export interface Category {
	id: number;
	userId: number;
	title: string;
	createdAt: string;
	updatedAt: string;
}

interface CategoryOprProps {
	apiToken?: string;
}

export interface CategoryAddProps extends CategoryOprProps {
	title: Category['title'];
}

export interface CategoryUpdateProps extends CategoryOprProps {
	id: Category['id'];
	title: Category['title'];
}

export interface CategoryDeleteProps extends CategoryOprProps {
	id: Category['id'];
}

interface StatusCommon {
	title: string;
	categoryId: number;
	color: string;
}

export interface Status extends StatusCommon {
	id: number;
}

export interface StatusAddProps extends StatusCommon {
	apiToken?: string;
}

export interface StatusGetProps {
	apiToken?: string;
	categoryId: number;
}

export interface StatusGetAllProps {
	apiToken?: string;
	categories: Category[];
}

export interface StatusUpdateProps {
	apiToken?: string;
	id: number;
	title: string;
	color: string;
	categoryId: number;
}

export interface StatusDeleteProps {
	apiToken?: string;
	id: number;
}

export interface Login {
	username: string;
	password: string;
}

export interface Register extends Login {
	passwordConfirm: string;
}

export interface Pages {
	currentPage: 'Login' | 'App' | 'CategoryEdit' | 'StatusEdit' | null;
	prevPage: 'Login' | 'App' | 'CategoryEdit' | 'StatusEdit' | null;
}

function App() {

	const [token, setToken] = useState<string>(() => getCookie('token') || '');
	const [pages, setPages] = useState<Pages>({
		currentPage: 'App',
		prevPage: null,
	});
	const [todoList, setTodoList] = useState<TodoInterface[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [status, setStatus] = useState<Status[]>([]);
	const [editCategory, setEditCategory] = useState<Category | null>(null);


	useEffect(() => {
		if (token) {
			getCategories({ apiToken: token });
			getAllTodo({ apiToken: token });
		}
	}, [token]);

	useEffect(() => {
		if (editCategory) {
			setPages({
				currentPage: 'StatusEdit',
				prevPage: 'CategoryEdit',
			});
		}
	}, [editCategory]);

	useEffect(() => {
		if (pages) {
			console.log(pages);
		}
	}, [pages]);



	function getCookie(cname: string): string {
		let name = cname + '=';
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}


	function handleLogin(formData: Login): void {
		const data = JSON.stringify(formData);
		axios
			.post('http://localhost:80/auth/login', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					const apiToken = response.data.token;
					document.cookie = `token=${apiToken}`;
					setToken(apiToken);
					setPages({ currentPage: 'App', prevPage: 'Login' });
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}


	function handleRegister(formData: Register): void {
		const data = JSON.stringify(formData);
		axios
			.post('http://localhost:80/auth/register', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					const apiToken = response.data.token;
					document.cookie = `token=${apiToken}`;
					setToken(apiToken);
					setPages({ currentPage: 'App', prevPage: 'Login' });
					addCategory({ apiToken, title: 'General' });
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}


	function addCategory({ apiToken = token, title }: CategoryAddProps): void {
		const data = JSON.stringify({ title });

		axios
			.post('http://localhost:80/category', data, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
					'Content-Type': 'application/json',
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					const category: Category = response.data;
					setCategories((prev) => [...prev, category]);
					addStatus({
						apiToken,
						title: 'Backlog',
						categoryId: category.id,
						color: 'purple',
					});
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function getCategories({ apiToken = token }: CategoryOprProps): void {
		axios
			.get('http://localhost:80/category', {
				headers: {
					Authorization: `Bearer ${apiToken}`,
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					const categories: Category[] = response.data;
					setCategories(categories);
					getAllStatus({ categories });
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function updateCategory({
		apiToken = token,
		id,
		title,
	}: CategoryUpdateProps): void {
		const data = JSON.stringify({ title });

		axios
			.put(`http://localhost:80/category/${id}`, data, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
					'Content-Type': 'application/json',
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					getCategories({ apiToken: token });
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function deleteCategory({ apiToken = token, id }: CategoryDeleteProps): void {
		axios
			.delete(`http://localhost:80/category/${id}`, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					getCategories({ apiToken: token });
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}


	function addStatus({
		title,
		categoryId,
		color,
		apiToken = token,
	}: StatusAddProps): void {
		const data = JSON.stringify({ title, categoryId, color });

		axios
			.post('http://localhost:80/status', data, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
					'Content-Type': 'application/json',
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					const status: Status = response.data;
					setStatus((prev) => [...prev, status]);
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	async function getStatus({ apiToken = token, categoryId }: StatusGetProps) {
		const status: Status[] = await axios
			.get(`http://localhost:80/status?categoryId=${categoryId}`, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					return response.data;
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
		return status;
	}

	async function getAllStatus({
		apiToken = token,
		categories,
	}: StatusGetAllProps) {
		const receivedStatus = await Promise.all(
			categories.map((category) => getStatus({ categoryId: category.id }))
		);

		receivedStatus.forEach((status) =>
			setStatus((prev) => [...prev, ...status])
		);
	}

	function updateStatus({
		apiToken = token,
		id,
		title,
		color,
		categoryId,
	}: StatusUpdateProps): void {
		const data = JSON.stringify({ title, categoryId, color });

		axios
			.put(`http://localhost:80/status/${id}`, data, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
					'Content-Type': 'application/json',
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					getAllStatus({ apiToken: token, categories });
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function deleteStatus({ apiToken = token, id }: StatusDeleteProps): void {
		axios
			.delete(`http://localhost:80/status/${id}`, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					getAllStatus({ apiToken: token, categories });
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}



	function addTodo(todoData: TodoAddInterface): void {
		const data = JSON.stringify(todoData);
		axios
			.post('http://localhost:80/todo', data, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					const todo: TodoInterface = response.data;
					setTodoList((prev) => [...prev, { ...todo }]);
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function updateTodo({ apiToken = token, todo }: TodoUpdateInterface): void {
		const data = JSON.stringify({
			title: todo.title,
			categoryId: todo.categoryId,
			statusId: todo.statusId,
		});

		axios
			.put(`http://localhost:80/todo/${todo.id}`, data, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
					'Content-Type': 'application/json',
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					console.log(response.data);
					getAllTodo({ apiToken: token });
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function deleteTodo({ apiToken = token, todo }: TodoUpdateInterface): void {
		axios
			.delete(`http://localhost:80/todo/${todo.id}`, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
				},
			})
			.then((response:any) => {
				if (response.status === 200) {
					console.log(response.data);
					getAllTodo({ apiToken: token });
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function getAllTodo({ apiToken }: TodoGetInterface): void {
		axios
			.get('http://localhost:80/todo', {
				headers: {
					Authorization: `Bearer ${apiToken}`,
				},
			})
			.then(async (response:any) => {
				if (response.status === 200) {
					const receivedTodoList: TodoInterface[] = response.data;
					setTodoList(receivedTodoList);
				}
			})
			.catch((error:any) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}





	function filter(action: boolean, categoryId?: number, statusId?: number) {
	

		console.log(action, categoryId, statusId);
	}

	// App Ekrani Donuluyor
	if (token && pages.currentPage === 'App') {
	

		return (
			<Box
				sx={{
					maxWidth: '100%',
					width: '100%',
					p: 2,
					boxSizing: 'border-box',
				}}
			>
			
				<Typography variant="h1" component="h1" gutterBottom>
					TodoList App
				</Typography>

		
				<Todo
					onSubmit={addTodo}
					categoryList={categories}
					onCategoryChange={getStatus}
				/>

		
				<Filter
					onSubmit={filter}
					categoryList={categories}
					onCategoryChange={getStatus}
				/>


				<TodoList
					todoList={todoList}
					categoryList={categories}
					statusList={status}
					onTodoUpdate={updateTodo}
					onTodoDelete={deleteTodo}
				/>

	
				<Button
					type="button"
					variant="contained"
					onClick={() =>
						setPages({ currentPage: 'CategoryEdit', prevPage: 'App' })
					}
				>
					Kategorileri duzenle
				</Button>
			</Box>
		);
	} else if (token && pages.currentPage === 'CategoryEdit') {

		return (
			<CategoryPage
				onNewCategorySubmit={addCategory}
				onUpdateCategorySubmit={updateCategory}
				onDeleteCategorySubmit={deleteCategory}
				onStatusEdit={setEditCategory}
				categoriesList={categories}
			/>
		);
	} else if (token && pages.currentPage === 'StatusEdit') {

		return (
			<>
				{pages.prevPage ? (
					<Button
						onClick={() => {
							const curPage = pages.currentPage;
							const prePage = pages.prevPage;

							setPages({ currentPage: prePage, prevPage: curPage });
						}}
					>
						Go Back
					</Button>
				) : (
					''
				)}
				<StatusPage
					categoryItem={editCategory}
					onAddStatus={addStatus}
					onGetStatus={getStatus}
					onUpdateStatus={updateStatus}
					onDeleteStatus={deleteStatus}
				/>
			</>
		);
	} else {

		return <LoginRegister onLogin={handleLogin} onRegister={handleRegister} />;
	}
}

export default App;
